# from fastapi import FastAPI

# app = FastAPI()

# from pymongo.mongo_client import MongoClient
# from pymongo.server_api import ServerApi 

# uri = "mongodb+srv://rifatxia:hackathon123@cluster0.4alho2f.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

# # Create a new client and connect to the server
# client = MongoClient(uri)

# # Send a ping to confirm a successful connection
# try:
#     client.admin.command('ping')
#     print("Pinged your deployment. You successfully connected to MongoDB!")
# except Exception as e:
#     print(e)

from fastapi import FastAPI, Request, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
import pytz
from io import BytesIO
import openai
from face_recognition_utils import recognize_face_from_bytes
from process import find_most_similar
from groq import Groq
import requests

# Load environment variables from a .env file (for API key)
load_dotenv()

# --- Your Context ---
patient_context = """
Information about Ethan Mitchell:

Name: Ethan Mitchell
Gender: Male
Age: 63 years old

Daily Schedule:
6:30 AM - 7:00 AM: Wake up, quick stretching, morning hygiene
7:00 AM - 7:45 AM: Light breakfast (coffee + oatmeal) and news reading
8:00 AM - 9:00 AM: Commute to work (listens to podcasts)
9:00 AM - 12:30 PM: Work (Software Development tasks, coding, team stand-up meeting at 10:00 AM)
12:30 PM - 1:30 PM: Lunch break (usually eats with colleagues at nearby café)
1:30 PM - 5:30 PM: Work (client meetings, feature development, code reviews)
5:30 PM - 6:30 PM: Gym workout (weight training + cardio)
6:30 PM - 7:00 PM: Commute back home
7:00 PM - 8:00 PM: Dinner (home-cooked or takeout) while watching TV series
8:00 PM - 9:30 PM: Personal time (gaming, reading, working on side projects)
9:30 PM - 10:00 PM: Prepare for the next day (lay out clothes, light journaling)
10:00 PM: Sleep

Family Members:
Father: David Mitchell (82 years old) – Retired School Principal
Mother: Laura Mitchell (80 years old) – Retired School Principal
Younger Sister: Emily Mitchell (55 years old) – Retired School Principal

Pet: Max (Golden Retriever, 4 years old)
"""

# --- LLM Setup ---
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("GOOGLE_API_KEY environment variable not set.")

groq_client = Groq(api_key=os.getenv("GROQ_API_KEY"))
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY environment variable not set.")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# --- FastAPI App Setup ---
app = FastAPI()

# Define the request body structure using Pydantic
class ChatMessage(BaseModel):
    message: str
    tts: bool = False

# --- TTS with Groq ---
def generate_speech_with_groq(text: str):
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    # PlayAI is a good general purpose voice
    data = {
        "model": "playai-tts",
        "voice": "Arista-PlayAI",
        "input": text,
        "response_format": "wav"
    }

    try:
        response = requests.post(
            "https://api.groq.com/openai/v1/audio/speech",
            headers=headers,
            json=data
        )

        if response.status_code == 200:
            return response.content
        else:
            print(f"Error with TTS: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"Exception in TTS: {e}")
        return None

# --- Chatbot Endpoint ---
@app.post("/chat")
async def chat_endpoint(chat_message: ChatMessage):
    user_message = chat_message.message
    tts_requested = chat_message.tts

    if not user_message:
        return JSONResponse(content={"response": "Please provide a message."}, status_code=400)

    # Get current LA time
    la_tz = pytz.timezone("America/Los_Angeles")
    current_time_in_LA = datetime.now(la_tz).strftime("%Y-%m-%d %I:%M %p")

    # Construct the full prompt for Gemini
    full_prompt = f"""You are an AI assistant helping a dementia patient. Use only the information below to answer the user's question.
If you don't know the answer, say you don't know. Be natural, direct, and supportive without extra information
If the current time is required for any answer, use this: {current_time_in_LA} whenever required. Be more natural, you dont have to mention the current time

Patient Information:
---
{patient_context}
---

User Question: {user_message}
"""

    try:
        # Make the asynchronous API call to Gemini
        response = await model.generate_content_async(
            full_prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.1,
            )
        )

        # Extract the response text
        if response.candidates and response.candidates[0].content:
            bot_response = response.candidates[0].content.parts[0].text
        else:
            bot_response = "Sorry, I couldn't generate a response for that. Can you ask in a different way?"

        # If TTS is requested, handle it
        if tts_requested:
            # Don't include the text in the URL since we'll use POST
            response_dict = {
                "response": bot_response,
                "audio_url": "/tts",  # Just the endpoint
                "audio_text": bot_response  # Include the text separately
            }
            return JSONResponse(content=response_dict)
        else:
            return JSONResponse(content={"response": bot_response})

    except Exception as e:
        print(f"Error during LLM call: {e}")
        return JSONResponse(content={"response": "Sorry, I encountered an error trying to retrieve that information. Please try again."}, status_code=500)

@app.post("/image")
async def recognize_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = recognize_face_from_bytes(image_bytes)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recognition error: {str(e)}")

@app.post("/process")
async def process_image(file: UploadFile = File(...)):
    try:
        image_bytes = await file.read()
        result = find_most_similar(image_bytes)
        return JSONResponse(content=result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")
    
# --- TTS Endpoint ---
@app.post("/tts")
async def text_to_speech(request: Request):
    # Parse the JSON body
    data = await request.json()
    text = data.get("text")
    
    if not text:
        return JSONResponse(content={"error": "No text provided"}, status_code=400)
    
    audio_data = generate_speech_with_groq(text)
    
    if audio_data:
        return StreamingResponse(BytesIO(audio_data), media_type="audio/wav")
    else:
        return JSONResponse(content={"error": "Failed to generate speech"}, status_code=500)
