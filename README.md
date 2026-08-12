<div align="center">

# MedRisk AI

**Advanced Health Risk Prediction Platform**

An open-source web application that predicts patient health risk levels — `Normal`, `Low`, `Medium`, `High` — from vital signs and clinical inputs. Built as an educational and research tool for exploring AI in healthcare, with a fully transparent, serverless architecture.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://med-risk-ai.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Python](https://img.shields.io/badge/Python-3-3776AB?logo=python&logoColor=white)](https://www.python.org)
[![scikit-learn](https://img.shields.io/badge/scikit--learn-latest-F7931E?logo=scikit-learn&logoColor=white)](https://scikit-learn.org)
[![XGBoost](https://img.shields.io/badge/XGBoost-CPU-informational?logo=xgboost&logoColor=white)](https://xgboost.ai)

</div>

---

## Overview

MedRisk AI is a machine-learning demo that shows how patient vital signs relate to health risk levels. It combines a modern **Next.js frontend** with a **Python model served serverlessly** — no external API, no third-party hosting, and **no patient data leaves the application**.

> **Not a medical device.** MedRisk AI is for educational and research purposes only. It is not a substitute for professional medical advice — always consult a qualified healthcare professional for medical decisions. See the [Disclaimer](#disclaimer).

---

## Live Demo

| Resource | Link |
| --- | --- |
| Live Web App | [med-risk-ai.vercel.app](https://med-risk-ai.vercel.app) |
| Source Code | [github.com/ItsMeArm00n/med-risk-ai](https://github.com/ItsMeArm00n/med-risk-ai) |
| Developer | [armaan-ai.vercel.app](https://armaan-ai.vercel.app) |

---

## Features

- **AI-Powered Risk Assessment** — Enter patient vitals and get an instant risk prediction (Normal / Low / Medium / High).
- **Self-Hosted Model Inference** — The trained model, scaler, and encoder are bundled with the app and served by a Vercel Python serverless function. No external API or Hugging Face dependency.
- **Privacy-First** — No patient data is stored. Predictions happen in the backend environment and are returned to the browser only.
- **Educational By Design** — Built for students, developers, and researchers interested in clinical modeling and AI in healthcare.
- **Informed by a Benchmark Model** — The underlying model achieves up to **95.55% accuracy** in internal tests on benchmark datasets.
- **Open Source** — Fully transparent, customizable, and ready for learning.

---

## Architecture

Unlike typical ML web apps that proxy to a remote inference service, MedRisk AI ships its model artifacts with the codebase and runs inference **entirely inside its own backend**:

```
+--------------------+        POST /api/predict        +-----------------------------+
|   Next.js Frontend  | -------------------------------> |  Vercel Python Function     |
|  (React + Tailwind) | <------------------------------- |  api/predict.py             |
+--------------------+        { "risk_level": "Low" }  |  |- scaler.pkl              |
                                                        |  |- target_encoder.pkl     |
                                                        |  `- Health_risk_model.pkl  |
                                                        +-----------------------------+
```

1. The user enters vital signs in the **Assessment** page.
2. The frontend sends them to `POST /api/predict`.
3. `api/predict.py` loads the bundled model artifacts once (cached on warm containers), scales the input, and runs a prediction.
4. The predicted risk level is returned to the UI.

---

## Model Inputs

The prediction API expects the following fields:

| Field | Description | Example |
| --- | --- | --- |
| `Respiratory_Rate` | Breaths per minute | `16` |
| `Oxygen_Saturation` | Blood oxygen saturation (%) | `98` |
| `O2_Scale` | Oxygen therapy scale used | `1` |
| `Systolic_BP` | Systolic blood pressure (mmHg) | `120` |
| `Heart_Rate` | Heart beats per minute | `72` |
| `Temperature` | Body temperature (°C) | `37.0` |
| `Consciousness` | Consciousness level on the ACVPU-style scale (see below) | `0` |
| `On_Oxygen` | Whether the patient is on supplemental oxygen (`0` / `1`) | `1` |

**Consciousness scale:**

| Value | Meaning |
| --- | --- |
| `0` | Alert (A) |
| `1` | Confusion (C) |
| `2` | Pain response (P) |
| `3` | Unresponsive (U) |
| `4` | Verbal (V) |

---

## API Reference

### `POST /api/predict`

Predicts a patient's health risk level.

**Request body:**

```json
{
  "Respiratory_Rate": 16,
  "Oxygen_Saturation": 98,
  "O2_Scale": 1,
  "Systolic_BP": 120,
  "Heart_Rate": 72,
  "Temperature": 37.0,
  "Consciousness": 0,
  "On_Oxygen": 1
}
```

**Response — `200 OK`:**

```json
{
  "risk_level": "Normal"
}
```

**Error — `400 Bad Request`** (missing or invalid fields):

```json
{
  "error": "Missing required field(s): Heart_Rate"
}
```

### `GET /api/predict`

Health check for the inference function:

```json
{
  "status": "ok",
  "model_loaded": true
}
```

---

## Local Development

### Prerequisites

- **Node.js** 18+ and a package manager (`npm`, `pnpm`, or `yarn`)
- **Python 3** with `pip`

### 1. Install dependencies

```bash
# Frontend
npm install

# Python inference dependencies
pip install -r requirements.txt
```

> `requirements.txt` intentionally uses `xgboost-cpu` instead of `xgboost` — the plain package pulls in unused GPU libraries that would exceed Vercel's function bundle size limit.

### 2. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The app runs the model inference on its own — **no separate Python server is needed**.

### 3. Type-check & build

```bash
npx tsc --noEmit   # TypeScript type check
npm run build      # Production build
```

---

## Project Structure

```
--- app/
    |--- page.tsx              # Landing page
    |--- assessment/page.tsx   # Risk assessment form + results
    |--- disclaimer/page.tsx   # Medical disclaimer page
    `--- layout.tsx            # Root layout
--- api/
    |--- predict.py            # Vercel Python serverless inference function
    `--- model/                # Bundled .pkl artifacts (model, scaler, encoder)
--- components/ui/             # Reusable UI components (shadcn/ui)
--- hooks/                     # Custom hooks (e.g. usePredictor)
--- public/                    # Static assets
`--- requirements.txt          # Python dependencies for inference
```

---

## Tech Stack

| Layer | Technology |
| --- | --- |
| **Frontend** | Next.js 15, React, TypeScript, Tailwind CSS, shadcn/ui, Lucide icons |
| **Inference** | Python, scikit-learn, XGBoost (CPU), joblib |
| **Backend** | Vercel Python Serverless Functions (`/api`) |
| **Hosting & Analytics** | Vercel, Vercel Web Analytics |

---

## Disclaimer

MedRisk AI is an **experimental machine-learning demonstration** for educational and research purposes only. Risk predictions are simulated and must **never** be used to make real medical decisions. The model does not consider full medical history, medications, allergies, or clinical context and can be wrong even when confident.

- In an emergency, contact your local emergency services immediately.
- Always consult a qualified healthcare professional for any health concern.
- Read the full disclaimer on the [Disclaimer page](https://med-risk-ai.vercel.app/disclaimer).

---

## License

This project is open source. You are free to use, study, modify, and learn from it — with the understanding that it is provided **"as is"**, without warranties of any kind.

---

<div align="center">

**Built by [Armaan Kumar](https://armaan-ai.vercel.app)**

*Advancing healthcare insights through open-source machine learning.*

</div>
