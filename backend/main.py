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

from fastapi import FastAPI, Request, UploadFile, File, HTTPException, Form, Body
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
from face_recognition_utils import find_best_match
from groq import Groq
import requests
import base64
import json
from db import get_db
import dateutil.parser
from tempfile import NamedTemporaryFile

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

# ElevenLabs API Setup
ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
if not ELEVENLABS_API_KEY:
    raise RuntimeError("ELEVENLABS_API_KEY environment variable not set.")
print(f"ElevenLabs API Key loaded: {ELEVENLABS_API_KEY[:5]}...")

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-2.0-flash')

# --- FastAPI App Setup ---
app = FastAPI()

# Define the request body structure using Pydantic
class ChatMessage(BaseModel):
    message: str

# --- TTS with ElevenLabs ---
def generate_speech_with_elevenlabs(text: str):
    try:
        print(f"Sending TTS request to ElevenLabs with API key: {ELEVENLABS_API_KEY[:5]}...")
        
        # ElevenLabs API endpoint for text-to-speech
        url = "https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM"  # Rachel voice ID
        
        # Headers with API key
        headers = {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": ELEVENLABS_API_KEY
        }
        
        # Request payload
        data = {
            "text": text,
            "model_id": "eleven_monolingual_v1",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.75
            }
        }
        
        print(f"Sending ElevenLabs request with text: {text[:30]}...")
        
        # Make the API call
        response = requests.post(url, json=data, headers=headers)
        
        print(f"ElevenLabs response status: {response.status_code}")
        
        if response.status_code == 200:
            print("ElevenLabs TTS request successful")
            return response.content
        else:
            print(f"ElevenLabs error: {response.status_code} - {response.text}")
            return None
            
    except Exception as e:
        print(f"Exception in ElevenLabs TTS: {e}")
        return None

# --- Chatbot Endpoint ---
@app.post("/chat")
async def chat_endpoint(chat_message: ChatMessage):
    user_message = chat_message.message
    
    if not user_message:
        return JSONResponse(content={"response": "Please provide a message."}, status_code=400)

    # Get current LA time
    la_tz = pytz.timezone("America/Los_Angeles")
    current_time_in_LA = datetime.now(la_tz).strftime("%Y-%m-%d %I:%M %p")

    # Construct the full prompt for Gemini
    full_prompt = f"""You are an AI assistant supporting a user with dementia.  
    Use only the information below to answer the user's question.  
    If you don't know the answer, reply "I'm sorry, I don't know."

    Be warm, direct, and encouraging. Keep responses concise.  
    If asked for the current time, insert {current_time_in_LA} but don't mention it otherwise.  
    
    Stay conversational, interactive, and supportive.

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

        # Return just the text response
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
async def process_image(payload: dict = Body(...)):
    print("Received payload:", payload)
    try:
        if "file" not in payload:
            return JSONResponse(content={"error": "Missing 'file' in request body."}, status_code=400)
        image_b64 = payload["file"]
        try:
            image_bytes = base64.b64decode(image_b64)
        except Exception:
            return JSONResponse(content={"error": "Invalid base64 encoding."}, status_code=400)
        result = recognize_face_from_bytes(image_bytes)
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
    
    # Generate speech with ElevenLabs
    audio_data = generate_speech_with_elevenlabs(text)
    
    if audio_data:
        # ElevenLabs returns MP3 format
        return StreamingResponse(BytesIO(audio_data), media_type="audio/mpeg")
    else:
        # If TTS generation failed
        return JSONResponse(content={"error": "Failed to generate speech"}, status_code=500)

@app.get("/get_memory")
async def get_memory():
    db = get_db("memory_db")
    memories = list(db.memories.find({}, {"_id": 0}))
    # Ensure date is only YYYY-MM-DD in the response
    for mem in memories:
        if "date" in mem:
            try:
                # If date is in ISO format, extract only the date part
                mem["date"] = mem["date"][:10]
            except Exception:
                pass
    return JSONResponse(content=memories)

@app.post("/set_memory")
async def set_memory(
    file: UploadFile = File(...),
    date: str = Form(...),
    description: str = Form(...)
):
    db = get_db("memory_db")
    file_bytes = await file.read()
    file_b64 = base64.b64encode(file_bytes).decode("utf-8")
    file_type = file.content_type

    # Improved date parsing, store only the date part
    try:
        # Try ISO first, then fallback to dateutil.parser
        try:
            parsed_date = datetime.fromisoformat(date)
        except Exception:
            parsed_date = dateutil.parser.parse(date)
        date_str = parsed_date.date().isoformat()  # Only YYYY-MM-DD
    except Exception:
        return JSONResponse(content={"error": "Invalid date format. Use YYYY-MM-DD or ISO format."}, status_code=400)

    memory_doc = {
        "file": file_b64,
        "file_type": file_type,
        "date": date_str,  # Only the date part
        "description": description
    }
    db.memories.insert_one(memory_doc)
    return JSONResponse(content={"message": "Memory saved successfully."})

@app.post("/set_connection")
async def set_connection(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...),
    image3: UploadFile = File(...),
    image4: UploadFile = File(...),
    image5: UploadFile = File(...),
    name: str = Form(...),
    relation: str = Form(...)
):
    db = get_db("memory_db")
    images = []
    for img_file in [image1, image2, image3, image4, image5]:
        img_bytes = await img_file.read()
        img_b64 = base64.b64encode(img_bytes).decode("utf-8")
        images.append({
            "filename": img_file.filename,
            "content_type": img_file.content_type,
            "data": img_b64
        })

    connection_doc = {
        "name": name,
        "relation": relation,
        "images": images
    }
    db.connection.insert_one(connection_doc)
    return JSONResponse(content={"message": "Connection saved successfully."})

@app.get("/get_connection")
async def get_connection():
    db = get_db("memory_db")
    connections = list(db.connection.find({}, {"_id": 0}))
    result = []
    for conn in connections:
        entry = {
            "name": conn.get("name"),
            "relation": conn.get("relation"),
        }
        images = conn.get("images", [])
        if images:
            # Only include the first image's info
            entry["image"] = {
                "filename": images[0].get("filename"),
                "content_type": images[0].get("content_type"),
                "data": images[0].get("data"),
            }
        else:
            entry["image"] = None
        result.append(entry)
    return JSONResponse(content=result)
