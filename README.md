# MemoAR

An augmented-reality system to help people living with dementia recapture and revisit precious memories—just like the song in *Coco*, “Remember Me.”

---

## Table of Contents

- [About](#about)  
- [Key Features](#key-features)  
- [Architecture](#architecture)  
- [Tech Stack](#tech-stack)  
- [Getting Started](#getting-started)  
  - [Website (Frontend)](#website-frontend)  
  - [Backend API](#backend-api)  
  - [Snapchat AR Lens](#snapchat-ar-lens)  
- [Usage Guide](#usage-guide)  
- [Contributing](#contributing)  
- [License](#license)  

---

## About

MemoAR is an AR-powered companion designed for people with memory loss. Inspired by *Coco*—where Abuelita remembers her father whenever she hears that song—MemoAR ensures “nothing is ever really lost to us as long as we remember it.” Users store photos, voice clips, diary entries, even favorite songs in our web portal; then, in the real world, they simply make a fist gesture in front of Snapchat’s latest Spectacles and watch their memories reappear. An AI guide named **Snapy** greets “Hello, Snapy” to assist with environmental context, memory prompts, or friendly conversation in real time.

---

## Key Features

- **Memory Capsules**  
  - Text notes, images, voice snippets, short video clips, or music tracks “pinned” to real-world locations  
  - Attach a diary entry or description to each memory  

- **Face-Aware Anchoring**  
  - Upload five photos of loved ones; our lightweight computer-vision model learns to recognize family & friends  

- **Interactive AR Agent (Snapy)**  
  - Built on Google’s Gemini 2.5 Pro LLM  
  - Listens for “Hello, Snapy” and answers questions, describes the environment, or cues memory triggers  

- **Gesture-Driven Recall**  
  - Left-hand fist gesture triggers stored memories to pop into view  

- **Cross-Platform Ecosystem**  
  - AR Lens Studio for Spectacles (JS/TS)  
  - React + Tailwind CSS web portal  
  - MongoDB for secure memory storage  

---

## Architecture

```mermaid
flowchart LR
  subgraph Web Portal
    A[React Frontend] --> B[Backend API (FastAPI)]
    B --> C[MongoDB]
  end

  subgraph AR Experience
    D[Lens Studio (JS/TS)] --> E[Gemini 2.5 Pro Agent]
    E --> F[CV Model (Family Faces)]
    E --> C
  end

  A -->|Uploads & Fetches| C
  D -->|Fetch Anchors & Memories| B
