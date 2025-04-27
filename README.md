# MemoAR

> *“Nothing is ever really lost to us as long as we remember it.”*  
> — Inspired by *Coco*

MemoAR is an innovative augmented reality (AR) system designed to help people with dementia recapture, revisit, and relive their most precious memories. Drawing inspiration from the movie *Coco*, where a song helps a grandmother remember her father, MemoAR brings the power of memory, music, and connection to life through cutting-edge AR and AI.

---

## 🌟 Vision

Imagine a world where even as memories fade, technology helps you hold on to the moments and people that matter most. MemoAR is built for those living with dementia and their loved ones, making it possible to see, hear, and feel the past—right in the present.

---

## 🧠 How It Works

MemoAR consists of two powerful parts:

### 1. **AR Lens for Snapchat Spectacles**
- **Platform:** Snapchat's newest Spectacles, built with Lens Studio (JavaScript/TypeScript)
- **Memory Recall:** Make a left-hand fist gesture, and "memory capsules" pop up in your AR view—photos, videos, audio, or even a favorite song.
- **Face Recognition:** Our lightweight computer vision model learns to recognize friends and family from just 5 photos each, anchoring memories to the people who matter most.
- **AI Agent (Snapy):** Powered by Google Gemini 2.5 Pro, Snapy listens for "Hello, Snapy," answers questions, describes your environment, and cues memory prompts in real time.
- **Conversational Support:** Snapy can chat, answer questions, and help users recall details, people, and places—making every interaction supportive and meaningful.

### 2. **Web Portal**
- **Tech Stack:** React, Tailwind CSS
- **Memory Upload:** Users and families can upload photos, diary entries, voice/video clips, or songs—each with a description or story.
- **Connection Training:** Upload 5 photos of each loved one to train the AR's face recognition model.
- **Chat History:** Review past conversations with Snapy, your AI companion in AR.
- **Secure Storage:** All memories and connections are stored safely in MongoDB Atlas.

---

## 💡 Why MemoAR?

Dementia can make even the closest faces and dearest moments hard to recall. MemoAR bridges that gap:
- **Memory Capsules:** Not just photos—relive a video of a birthday, hear a midnight "I miss you" from grandma, or listen to a song that brings back a lifetime.
- **Real-Time Assistance:** Snapy, our AI agent, is always ready to help, answer questions, and guide users through their day.
- **Minimal Data, Maximum Impact:** Our CV model can recognize a loved one with just 5 photos—making setup easy and effective.
- **Inspired by *Coco*:** Like the song that brings memories flooding back, MemoAR uses music, voice, and images to spark recognition and joy.

---

## 🛠️ Technical Overview

### AR Lens (Snapchat Spectacles)
- **Lens Studio:** JavaScript/TypeScript
- **Face Recognition:** TensorFlow Lite, trained on 5 photos per person
- **AI Agent:** Google Gemini 2.5 Pro
- **Gesture Recognition:** Left-hand fist triggers memory recall
- **Real-Time Environment Detection:** Snapy can describe surroundings and answer questions

### Web Portal
- **Frontend:** React, Tailwind CSS
- **Backend:** Python, FastAPI, Uvicorn
- **Database:** MongoDB Atlas
- **Domain:** GoDaddy 

---

## 🚀 Getting Started

### Web Portal

```bash
cd website/frontend
npm install
npm start
```

### Backend

1. Create a `.env` file with your Gemini API key.
2. Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3. Start the server:
    ```bash
    uvicorn main:app --reload
    ```
4. The ML model is included in the backend.

### AR Lens (Snapchat Spectacles)

- Follow Snap Spectacles setup instructions.
- Open Lens Studio, connect your Spectacles, and load the MemoAR lens.
- Connect the lens to your MemoAR web app for seamless memory recall and AI assistance.

---

## 🧩 Features

- **Memory Capsules:** Anchor text, images, audio, video, or music to the real world.
- **Face-Aware Anchoring:** Recognize friends and family in AR with just 5 photos.
- **Gesture-Driven Recall:** Left-hand fist reveals memories instantly.
- **Conversational AI:** Snapy, powered by Gemini 2.5 Pro, is always ready to help.
- **Cross-Platform:** Works on both AR Spectacles and the web.

---

## ❤️ The Heart of MemoAR

If you've ever forgotten a face, a moment, or a song that once meant everything, MemoAR is for you. For families, caregivers, and those living with dementia, MemoAR is a bridge to the past and a companion for the present.

> *"Imagine if you forget your closest person—family, lover, friend. You know you know them, but you cannot remember. MemoAR helps you bring those precious memories back."*

---

## 📬 Contact

For questions, contributions, or to share your story open an issue on this repository.

---

**MemoAR: Memory of Us.**  
*Inspired by love, powered by technology, and built for everyone who believes that nothing is ever really lost as long as we remember it.*
