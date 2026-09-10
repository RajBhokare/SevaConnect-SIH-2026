# SevaConnect (SIH 2026 — PS 26089)
> **Tagline:** *Connecting Skills. Empowering Communities.*  
> A cooperative-owned, independent-worker service marketplace engineered for blue-collar professionals with FairMatch allocation, AI-powered multi-factor provider ranking, emergency dispatch, welfare tracking, and demand forecasting.

---

## 🚀 System Architecture Overview

```
SevaConnect/
├── frontend/             # React + Vite + Tailwind CSS + Lucide React + Zustand
│   ├── src/
│   │   ├── components/   # Atomic UI kit, RankBadge, WorkerCard, ServiceCard, BookingCard
│   │   ├── pages/        # Customer, Worker, and Cooperative AI Hub pages
│   │   ├── services/     # Axios client layer for backend & AI microservice (Auth, Ranking, Bookings)
│   │   ├── store/        # Zustand persistent session & role store
│   │   └── App.jsx       # Client-side router & role-based route guard
├── backend/              # Node.js + Express + Mongoose + JWT + bcryptjs
│   ├── models/           # User, Worker, Service, Booking, Payment, Rating
│   ├── controllers/      # Business logic, Ranking Engine, FairMatch, Auth, Bookings
│   ├── routes/           # REST endpoints under /api/* (including /api/ranking/*)
│   ├── config/           # Database connector with auto in-memory fallback & seed store
│   └── server.js         # Express server (Port 5000)
├── ai/                   # Python FastAPI + Scikit-Learn + NLP Sentiment Classifier
│   ├── ranking.py        # Multi-factor Bayesian ranking & review categorization
│   ├── forecast.py       # Demand forecasting engine (LOW / MEDIUM / HIGH)
│   ├── allocation.py     # Fair workforce allocation planner for cooperative coordinators
│   ├── sample_data.csv   # Historical demand & emergency rate dataset
│   └── main.py           # FastAPI service (Port 8000)
└── docs/
    └── ux-reference.md   # Structural UX heuristics study for Indian marketplaces
```

---

## 🏆 AI-Powered Service Provider Ranking System

SevaConnect implements a multi-factor **AI-assisted ranking engine** that calculates an explainable score (0–100) and assigns verified artisans to one of 5 performance tiers:

| Score Range | Rank Tier | Badge | Characteristics & Description |
| :--- | :--- | :--- | :--- |
| **90–100** | **Diamond** | 💠 | Consistently exceptional service, >95% positive feedback, and trusted track record. |
| **75–89** | **Platinum** | 💎 | Highly dependable artisan with strong positive feedback and proven field reliability. |
| **60–74** | **Gold** | 🥇 | Good customer satisfaction and steady delivery across verified tasks. |
| **40–59** | **Silver** | 🥈 | Developing track record with moderate customer feedback and steady delivery. |
| **0–39** | **Bronze** | 🥉 | Baseline entry tier with improvement opportunities noted in customer feedback. |
| *< 3 Reviews*| **Unranked** | 🆕 | New Service Provider (insufficient sample size to establish performance tier). |

### Multi-Factor Scoring Formula (0–100)
1. **Bayesian Star Rating (40%)**: Adjusted average rating weighted by review volume ($C=5, m=4.0$), preventing sample-size bias.
2. **AI Sentiment & Review Quality (25%)**: NLP polarity classification (-1.0 to +1.0) and positive ratio across written feedback.
3. **Volume & Experience Track Record (15%)**: Saturated at 30 completed gigs to reward long-term dependable delivery.
4. **Rating Consistency & Trend (10%)**: Penalizes high variance or sudden drops in customer ratings.
5. **Reliability & Complaint Avoidance (10%)**: Penalizes cancellations, decline frequency, or customer issues.

### Feedback Categorization
Written reviews are structured into categories:
- *Service Quality*, *Professionalism*, *Timeliness*, *Communication*, *Pricing & Value*, *Reliability*, *Customer Satisfaction*, *Complaint/Issue*.

---

## ⚡ Quick Start Guide

### 1. Start Backend API (Port 5000)
```bash
cd backend
npm install
node server.js
```

### 2. Start AI Operational & Ranking Service (Port 8000)
```bash
cd ai
pip install -r requirements.txt
python -m uvicorn main:app --port 8000
```

### 3. Start Frontend Web App (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🔑 Quick Demo Evaluator Credentials

The login screen includes one-click **⚡ Quick Demo Autofill** buttons:

| Role | Email | Password | Pre-seeded Context |
| :--- | :--- | :--- | :--- |
| **Customer** | `customer@demo.com` | `password123` | Customer in Kothrud, Pune with active bookings |
| **Worker** | `worker@demo.com` | `password123` | Santosh Shinde — **Diamond Provider** (94/100 Score, 58 gigs) |
