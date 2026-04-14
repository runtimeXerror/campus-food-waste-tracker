# 🍃 NourishTrack — AI-Powered Campus Food Waste Intelligence

A full-stack application for tracking, analyzing, and reducing food waste across college campuses. Built with **React**, **FastAPI**, and **PostgreSQL**.

![Python](https://img.shields.io/badge/Python-3.11+-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)

---

## 🏗️ Architecture

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   React Frontend │────▶│  FastAPI Backend  │────▶│   PostgreSQL DB  │
│   (Port 3000)    │◀────│   (Port 8000)     │◀────│   (Port 5432)    │
└──────────────────┘     └──────────────────┘     └──────────────────┘
        │                        │
   Tailwind CSS           SQLAlchemy ORM
   React Router           Alembic Migrations
   Recharts               AI Analytics Engine
   Axios                  JWT Authentication
```

## 🚀 Features

- **📊 Real-time Dashboard** — KPIs, sparklines, trend charts, category breakdowns
- **📝 Waste Logging** — Log food waste with real-time CO₂/cost impact preview
- **🔬 Analytics** — Heatmaps, trend analysis, reason breakdowns, hall comparisons
- **🤖 AI Insights** — Predictive modeling, automated recommendations, anomaly detection
- **🏆 Gamification** — Leaderboards, streaks, achievement badges, team competitions
- **🔐 Auth** — JWT-based authentication with role-based access control
- **📱 Responsive** — Works on desktop, tablet, and mobile

## 📁 Project Structure

```
nourishtrack/
├── frontend/               # React application
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   └── assets/styles/  # CSS files
│   ├── package.json
│   └── .env.example
├── backend/                # FastAPI application
│   ├── app/
│   │   ├── api/routes/     # API route handlers
│   │   ├── core/           # Config, security, deps
│   │   ├── db/             # Database connection & session
│   │   ├── models/         # SQLAlchemy models
│   │   ├── schemas/        # Pydantic schemas
│   │   └── services/       # Business logic & AI engine
│   ├── alembic/            # Database migrations
│   ├── requirements.txt
│   └── .env.example
├── docker-compose.yml
└── README.md
```

## ⚡ Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Option 1: Docker (Recommended)

```bash
# Clone and start all services
git clone https://github.com/yourusername/nourishtrack.git
cd nourishtrack
docker-compose up --build
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Option 2: Manual Setup

#### 1. Database
```bash
# Create PostgreSQL database
createdb nourishtrack
```

#### 2. Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env      # Edit with your database credentials
alembic upgrade head      # Run migrations
python -m app.db.seed     # Seed sample data
uvicorn app.main:app --reload --port 8000
```

#### 3. Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login & get JWT token |
| GET | `/api/waste-logs` | List waste logs (paginated) |
| POST | `/api/waste-logs` | Create waste log entry |
| GET | `/api/dashboard/summary` | Dashboard KPI summary |
| GET | `/api/analytics/trends` | Waste trend data |
| GET | `/api/analytics/heatmap` | Meal × Hall heatmap |
| GET | `/api/analytics/reasons` | Waste reason breakdown |
| GET | `/api/ai/insights` | AI-generated insights |
| GET | `/api/ai/predictions` | Predictive analytics |
| GET | `/api/leaderboard` | Team leaderboard |

## 🛠️ Tech Stack

**Frontend:** React 18, React Router, Tailwind CSS, Recharts, Axios, React Hot Toast
**Backend:** FastAPI, SQLAlchemy 2.0, Alembic, Pydantic v2, Python-Jose (JWT)
**Database:** PostgreSQL 15, with full migration support
**DevOps:** Docker, Docker Compose, Nginx

## 📄 License

MIT License
