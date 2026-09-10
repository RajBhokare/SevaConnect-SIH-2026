# SevaConnect (SIH 2026 — PS 26089)
> **Tagline:** *Connecting Skills. Empowering Communities.*  
> A cooperative-owned, independent-worker service marketplace engineered for blue-collar professionals with FairMatch allocation, emergency dispatch, welfare tracking, and AI-assisted demand forecasting.

---

## 🚀 System Architecture Overview

```
SevaConnect/
├── frontend/             # React + Vite + Tailwind CSS + Lucide React + Zustand
│   ├── src/
│   │   ├── components/   # Atomic UI kit (Button, Card, Modal, Badge, etc.) & Domain cards
│   │   ├── pages/        # Customer, Worker, and Cooperative AI Hub pages
│   │   ├── services/     # Axios client layer for backend & AI microservice
│   │   ├── store/        # Zustand persistent session & role store
│   │   └── App.jsx       # Client-side router & role-based route guard
├── backend/              # Node.js + Express + Mongoose + JWT + bcryptjs
│   ├── models/           # User, Worker, Service, Booking, Payment, Rating
│   ├── controllers/      # Business logic & FairMatch multi-objective scoring engine
│   ├── routes/           # REST endpoints under /api/*
│   ├── config/           # Database connector with auto in-memory fallback
│   └── server.js         # Express server (Port 5000)
├── ai/                   # Python FastAPI + Scikit-Learn + Pandas
│   ├── forecast.py       # Demand forecasting engine (LOW / MEDIUM / HIGH)
│   ├── allocation.py     # Fair workforce allocation planner for cooperative coordinators
│   ├── sample_data.csv   # Historical demand & emergency rate dataset
│   └── main.py           # FastAPI service (Port 8000)
└── docs/
    └── ux-reference.md   # Structural UX heuristics study for Indian marketplaces
```

---

## ⚡ Quick Start Guide

### 1. Start Backend API (Port 5000)
```bash
cd backend
npm install
node server.js
```
*Backend initializes with automatic resilient database connectivity and pre-seeded verified cooperative workers.*

### 2. Start AI Operational Service (Port 8000)
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
| **Worker** | `worker@demo.com` | `password123` | Verified Master Plumber with MSSC Cooperative (#MSSC-4092) |

---

## ✨ Core Features & Innovation

1. **FairMatch Multi-Objective Engine**:
   - Hard filters: Verified status, matching skill, active availability.
   - Ranking: Balances proximity (35%), workload fairness (25%), experience (20%), and community rating (20%).
   - Surfaces as `"Recommended for you"` with zero AI jargon to end customers.

2. **End-to-End Service Lifecycle**:
   - `REQUESTED` ➔ `ACCEPTED` ➔ `IN_PROGRESS` (On-site) ➔ `COMPLETED` ➔ `PAID` ➔ `5-Star Rated`.

3. **Rapid Emergency Dispatch Protocol**:
   - High-urgency one-tap request for severe leaks, electrical short circuits, and door jam emergencies prioritizing 5km on-call standby artisans.

4. **Cooperative Welfare & Social Security**:
   - Worker portal tracking PM-SYM / Shramik Suraksha insurance status, accumulated welfare fund balance, tool loan facilities, and cooperative dividends.
   - *Government IDs and KYC credentials remain strictly tokenized and private.*

5. **AI Demand Forecasting & Workforce Allocation**:
   - Microservice forecasting locality booking surge volume and advising cooperative coordinators on fair standby worker distribution without autonomous worker coercion.

SIH 2026
