# MemoAR

An augmented-reality system to help people with dementia recapture and revisit precious memories—just like the song in *Coco*, “Remember Me.”

## Overview

MemoAR consists of two parts:

1. **AR Lens**  
   - Built in Snapchat Lens Studio with JavaScript/TypeScript  
   - Runs on Snapchat’s newest Spectacles  
   - Detects a left-hand fist gesture to “pop up” memory capsules  
   - Invokes **Snapy**, an AI agent (Google Gemini 2.5 Pro) that listens for “Hello, Snapy,” answers questions, describes the environment, and cues memory prompts  

2. **Web Portal**  
   - Built with React and Tailwind CSS  
   - Allows users to upload memories (photos, diary entries, voice/video clips, songs)  
   - Users supply five photos of each loved one; a lightweight CV model learns to recognize them in AR  
   - Stores everything securely in MongoDB Atlas  
   - Provides a chat history interface with Snapy  

## Key Features

- **Memory Capsules**: Text, images, audio, video, or music tracks “anchored” to the real world  
- **Face-Aware Anchoring**: Train on just five photos per person to recognize friends/family in AR  
- **Gesture-Driven Recall**: Left-hand fist reveals anchored memories  
- **AI Agent (Snapy)**: Conversational assistant powered by Gemini 2.5 Pro  
- **Cross-Platform**: Spectacles AR lens + web portal (memoar.us)  

## Tech Stack

- **AR Lens**: Snapchat Lens Studio (JS/TS)  
- **AI Agent**: Google Gemini 2.5 Pro  
- **CV Model**: TensorFlow Lite (face recognition)  
- **Web Frontend**: React, Tailwind CSS  
- **Backend**: Python, FastAPI, Uvicorn  
- **Database**: MongoDB Atlas  
- **Domain**: GoDaddy (memoar.us)  

## Getting Started

### Web Portal

```bash
cd website/frontend
npm install
npm start
