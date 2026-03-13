# VoxShield AI Backend

## Overview
This backend provides scam call detection using rule-based and AI (Google Gemini) analysis, and stores results in Firebase Firestore.

## Structure
- `server.js`: Express server entry point
- `routes/`: API route definitions
- `controllers/`: Request handlers
- `services/`: Gemini API and risk analysis logic
- `database/`: Firestore config
- `models/`: Firestore data model
- `utils/`: Scam keyword list

## Setup Instructions

1. **Clone the repo and install dependencies:**
   ```sh
   cd backend
   npm install express cors dotenv axios firebase-admin
   ```

2. **Set up environment variables:**
   Create a `.env` file in `backend/`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key
   FIREBASE_PROJECT_ID=your_firebase_project_id
   ```
   (For local dev, ensure you have Google credentials for `firebase-admin`.)

3. **Run the server:**
   ```sh
   node server.js
   ```

4. **API Endpoints:**
   - `POST /api/detect` — Analyze transcript for scam risk
   - `GET /api/history` — Fetch detection history

## Comments
- The backend is modular and commented for clarity.
- Add your Google Gemini API key and Firebase project ID in `.env`.
- No raw audio is stored, only transcripts and results.

---

For ML integration, see `ml-model/` (not included here).
