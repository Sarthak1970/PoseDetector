# 🧍‍♂️ Rule-Based Bad Posture Detection Web App

This is a full-stack posture analysis web application that detects bad posture while squatting or sitting at a desk using rule-based logic. It uses MediaPipe for pose estimation, FastAPI for backend processing, and React (Vite) for the frontend.

---

## 🚀 Deployed Application

🔗 [Live App on Vercel](https://pose-detector-eight.vercel.app/)  
---

## 🛠️ Tech Stack

### 🎨 Frontend
- React (Vite)
- Axios
- HTML5 Video / Webcam Input
- TailwindCSS (optional for styling)

### ⚙️ Backend
- FastAPI (Python)
- MediaPipe
- OpenCV
- Uvicorn

### ☁️ Deployment
- Backend: [Render](https://posedetector.onrender.com)
- Frontend: [Vercel](https://pose-detector-eight.vercel.app/) 

---

## 📋 Features

- Upload a video or use your webcam
- Analyze posture using pose detection (MediaPipe)
- Rule-based detection
- Real-time or frame-by-frame feedback
- Visual indicators or warnings shown on video

---

## 🧪 Setup Instructions (Local)

### 1. Clone the Repository

```bash
git clone https://github.com/Sarthak1970/PoseDetector.git
cd PoseDetector
```

###2. Backend Setup (FastAPI)
```
cd Server
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
uvicorn app:app --reload
```

###3. Frontend Setup (React + Vite)
```
cd ../Frontend
npm install
npm run dev
```

## 🧠 Future Improvements

- Integrate ML model for posture classification
- Export user posture reports
- Add user authentication and history tracking

## 📎 Useful Links

- [MediaPipe Pose](https://google.github.io/mediapipe/solutions/pose.html)
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [OpenCV Python](https://docs.opencv.org/)
