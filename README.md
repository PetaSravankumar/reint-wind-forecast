# WindWatch — UK Wind Power Forecast Monitor

> REint AI Full Stack SWE Challenge Submission

A full-stack application for monitoring UK national wind power generation forecasts vs actuals, plus a Jupyter notebook analysis of forecast error characteristics and wind generation reliability.

---

## 📁 Directory Structure

```
reint-challenge/
├── backend/                 # FastAPI Python backend
│   ├── main.py              # API endpoints (/api/actuals, /api/forecasts)
│   ├── requirements.txt     # Python dependencies
│   └── Procfile             # Heroku deployment config
│
├── frontend/                # React + Vite frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx    # Main layout & state
│   │   │   ├── Controls.jsx     # Date pickers + horizon slider
│   │   │   ├── WindChart.jsx    # Recharts line chart
│   │   │   └── StatsBar.jsx     # Error stats summary cards
│   │   ├── hooks/
│   │   │   └── useWindData.js   # Data fetching hook
│   │   ├── utils/
│   │   │   └── api.js           # Axios API calls
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css            # Global styles + design tokens
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── vercel.json              # Vercel deployment config
│
└── notebooks/
    └── wind_analysis.ipynb      # Full analysis notebook
```

---

## 🚀 Running Locally

### Prerequisites
- Node.js 18+
- Python 3.11+

### 1. Start the Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`. Swagger docs at `http://localhost:8000/docs`.

### 2. Start the Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

> The Vite dev server proxies `/api` requests to `http://localhost:8000`.

---

## 🌐 Deployment

### Backend → Heroku

```bash
cd backend
heroku create your-app-name
git push heroku main
```

### Frontend → Vercel

1. Update `vercel.json` with your Heroku backend URL.
2. Set env var `VITE_API_URL` to your backend URL in Vercel dashboard.

```bash
cd frontend
npm i -g vercel
vercel --prod
```

### Live App
**App**: [https://your-app.vercel.app](https://your-app.vercel.app) ← Update after deployment

---

## 📊 Jupyter Notebook

```bash
cd notebooks
pip install jupyter pandas numpy matplotlib requests
jupyter notebook wind_analysis.ipynb
```

The notebook covers:
1. Data fetching from Elexon BMRS API (Jan 2024)
2. Forecast error analysis (MAE, RMSE, MAPE, P99, error vs horizon, time-of-day)
3. Wind generation reliability analysis and MW recommendation

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Recharts |
| Backend | FastAPI, Python 3.11, httpx |
| Analysis | Pandas, NumPy, Matplotlib, Jupyter |
| Deployment | Vercel (frontend), Heroku (backend) |

---

## 🤖 AI Tool Usage

Claude AI (Anthropic) was used to assist with:
- Initial project scaffolding and component structure
- FastAPI endpoint logic for pagination and horizon filtering
- CSS design system and responsive layout

All data analysis, statistical reasoning, and recommendations in the Jupyter notebook were written by the author with only low-level AI assistance (e.g. fixing syntax, looking up library functions).

---
**Vercel**
https://reint-wind-forecast.vercel.app
