from fastapi import FastAPI
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import google.generativeai as genai
import os
from dotenv import load_dotenv
from datetime import datetime
import pytz

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

genai.configure(api_key=GOOGLE_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash-latest')

# --- FastAPI App Setup ---
app = FastAPI()

# Define the request body structure using Pydantic
class ChatMessage(BaseModel):
    message: str

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
    full_prompt = f"""You are an AI assistant helping a dementia patient. Use only the information below to answer the user's question.
If you don't know the answer, say you don't know. Be natural, direct, and supportive. 
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

        return JSONResponse(content={"response": bot_response})

    except Exception as e:
        print(f"Error during LLM call: {e}")
        return JSONResponse(content={"response": "Sorry, I encountered an error trying to retrieve that information. Please try again."}, status_code=500)