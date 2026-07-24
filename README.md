# 🔔 PingMe — Language Exchange Chat App

PingMe is a full-stack real-time chat application for language learners. Connect with native speakers, send friend requests, and have real-time conversations with video call support.

## ✨ Features

- 🔐 JWT Authentication (Signup / Login / Logout)
- 👤 User Onboarding (language, bio, location)
- 👥 Friend Request System
- 💬 Real-time Chat (powered by Stream.io)
- 📹 Video Calling (powered by Stream.io Video SDK)
- 🌗 Theme Switching (DaisyUI themes)
- 📱 Fully Responsive

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Stream.io Chat SDK
- bcryptjs, cookie-parser, cors

### Frontend
- React 19 + Vite
- TailwindCSS + DaisyUI
- TanStack Query (React Query)
- Stream Chat React SDK
- Stream Video React SDK
- Zustand, Axios, React Router

---

## 🚀 Getting Started (Local Development)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/PingMe.git
cd PingMe
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Fill in VITE_STREAM_API_KEY in .env
npm run dev
```

Open [https://ping-me-gold.vercel.app/](https://ping-me-gold.vercel.app/)

---

## 🔑 Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| `PORT` | Server port (default: 5001) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET_KEY` | Secret key for JWT tokens |
| `NODE_ENV` | `development` or `production` |
| `FRONTEND_URL` | Frontend URL for CORS |
| `STEAM_API_KEY` | Stream.io API Key |
| `STEAM_API_SECRET` | Stream.io API Secret |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| `VITE_STREAM_API_KEY` | Stream.io API Key (same as backend) |

> Get free Stream.io keys at [getstream.io](https://getstream.io)

---

## ☁️ Deployment

### Backend → Render
1. Push to GitHub
2. Go to [render.com](https://render.com) → **New Web Service**
3. Connect your GitHub repo
4. Set **Root Directory** → `backend`
5. **Build Command**: `npm install`
6. **Start Command**: `node src/server.js`
7. Add environment variables in Render dashboard
8. Copy your Render URL (e.g., `https://pingme-backend.onrender.com`)

### Frontend → Vercel
1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repo
3. Set **Root Directory** → `frontend`
4. Set **Framework Preset** → `Vite`
5. Add environment variable: `VITE_STREAM_API_KEY`
6. Deploy!
7. Copy your Vercel URL (e.g., `https://pingme.vercel.app`)

### Connect them
After deploying both:
- In **Render**, set `FRONTEND_URL` → your Vercel URL
- In **Vercel** → no changes needed (axios auto-uses `/api` in production)

---

## 📂 Project Structure

```
PingMe/
├── backend/
│   ├── src/
│   │   ├── controller/     # Route handlers
│   │   ├── lib/            # DB connection, Stream client
│   │   ├── middleware/     # Auth middleware
│   │   ├── models/         # Mongoose schemas
│   │   ├── route/          # Express routes
│   │   └── server.js       # Entry point
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API calls, axios config
│   │   ├── pages/          # Page components
│   │   ├── store/          # Zustand stores
│   │   └── App.jsx
│   ├── .env                # Frontend env vars
│   ├── vercel.json         # Vercel SPA config
│   └── package.json
└── render.yaml             # Render deployment config
```
