# Local Model Setup Guide

Your application now runs predictions directly using your local model - no external API needed!

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

This installs scikit-learn and other dependencies needed for your model.

### 2. Start the Next.js Development Server

Run this command in your project directory:

```bash
npm run dev
# or
pnpm dev
```

That's it! The Next.js server will handle everything. When you make a prediction, it will:
1. Send data to `/api/predict` (Next.js API route)
2. The route spawns a Python process that loads your model
3. Makes the prediction and returns the result

## How It Works

- **predict.py** - Python script that:
  - Loads your `Health_risk_predictor_model.pkl` model
  - Reads input from stdin as JSON
  - Outputs prediction to stdout
  - Runs as a subprocess for each prediction

- **app/api/predict/route.ts** - Next.js API route that:
  - Receives prediction requests from the frontend
  - Spawns a Python subprocess running `predict.py`
  - Returns results to the frontend

- **assessment/page.tsx** & **predict-section.tsx** - Frontend components that call `/api/predict`

## API Endpoint

**URL:** `/api/predict` (relative to your Next.js server)

**Method:** `POST`

**Request Body:**
```json
{
  "Respiratory_Rate": 20,
  "Oxygen_Saturation": 95,
  "O2_Scale": 0,
  "Systolic_BP": 120,
  "Heart_Rate": 80,
  "Temperature": 37,
  "Consciousness": 0,
  "On_Oxygen": 0
}
```

**Response:**
```json
{
  "risk_level": "Low"
}
```

## Troubleshooting

- **"Failed to get prediction"** - Make sure Python is installed and scikit-learn is available: `pip install -r requirements.txt`
- **"Model not found"** - Check that `Health_risk_predictor_model.pkl` exists in the project root
- **Windows Python not found** - Try using `python -m pip install -r requirements.txt` or add Python to PATH

## One Server Only!

You now only need to run `npm run dev`. No separate Python server needed! The Next.js app handles everything internally.


