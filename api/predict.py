"""
Vercel Python Serverless Function.

This file must live at /api/predict.py (project root's /api directory,
NOT inside /app). Vercel auto-detects any .py file in /api that defines a
`handler` class as its own serverless function, separate from your Next.js
Node.js routes. It becomes reachable at POST /api/predict.

The model/scaler/encoder are loaded once at module import time. Vercel
reuses "warm" containers between requests, so on a warm invocation this
loading cost isn't paid again -- only on a cold start.
"""

from http.server import BaseHTTPRequestHandler
import json
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "Health_risk_predictor_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "model", "scaler.pkl")
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, "model", "target_encoder.pkl")

REQUIRED_FIELDS = [
    "Respiratory_Rate",
    "Oxygen_Saturation",
    "O2_Scale",
    "Systolic_BP",
    "Heart_Rate",
    "Temperature",
    "Consciousness",
    "On_Oxygen",
]

_model = None
_scaler = None
_target_encoder = None
_load_error = None


def _load_artifacts():
    global _model, _scaler, _target_encoder, _load_error
    try:
        import joblib

        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        _target_encoder = joblib.load(TARGET_ENCODER_PATH)
    except FileNotFoundError as e:
        _load_error = (
            f"Model artifact not found: {e}. Make sure "
            f"Health_risk_predictor_model.pkl, scaler.pkl, and target_encoder.pkl "
            f"are committed inside /api/model/."
        )
    except Exception as e:
        _load_error = (
            f"Failed to load model artifacts ({type(e).__name__}): {e}. "
            f"This is often a scikit-learn/xgboost version mismatch between "
            f"training and requirements.txt."
        )


# Runs once at cold start, not on every request.
_load_artifacts()


class handler(BaseHTTPRequestHandler):
    def _send_json(self, status: int, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        # Simple health check: GET /api/predict
        self._send_json(
            200 if not _load_error else 500,
            {
                "status": "ok" if not _load_error else "error",
                "model_loaded": _model is not None,
                "error": _load_error,
            },
        )

    def do_POST(self):
        if _load_error:
            self._send_json(500, {"error": _load_error})
            return

        try:
            length = int(self.headers.get("Content-Length", 0) or 0)
            raw_body = self.rfile.read(length) if length > 0 else b"{}"
            data = json.loads(raw_body)
        except Exception as e:
            self._send_json(400, {"error": f"Invalid JSON body: {e}"})
            return

        missing = [f for f in REQUIRED_FIELDS if f not in data]
        if missing:
            self._send_json(
                400, {"error": f"Missing required field(s): {', '.join(missing)}"}
            )
            return

        try:
            import numpy as np

            features = np.array(
                [
                    [
                        float(data["Respiratory_Rate"]),
                        float(data["Oxygen_Saturation"]),
                        int(data["O2_Scale"]),
                        float(data["Systolic_BP"]),
                        float(data["Heart_Rate"]),
                        float(data["Temperature"]),
                        int(data["Consciousness"]),
                        int(data["On_Oxygen"]),
                    ]
                ]
            )

            features_scaled = _scaler.transform(features)
            prediction = _model.predict(features_scaled)[0]
            risk_label = _target_encoder.inverse_transform([prediction])[0]

            self._send_json(200, {"risk_level": str(risk_label)})
        except (ValueError, TypeError) as e:
            self._send_json(400, {"error": f"Invalid input data: {e}"})
        except Exception as e:
            self._send_json(
                500, {"error": f"Prediction error ({type(e).__name__}): {e}"}
            )
