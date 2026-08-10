"""
Local Python API server for Health Risk Predictor model.
Run this before starting your Next.js dev server.
"""

import pickle
import os
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load model at startup
MODEL_PATH = os.path.join(os.path.dirname(__file__), "Health_risk_predictor_model.pkl")

try:
    with open(MODEL_PATH, "rb") as f:
        model = pickle.load(f)
    print(f"✓ Model loaded successfully from {MODEL_PATH}")
except Exception as e:
    print(f"✗ Failed to load model: {e}")
    model = None


@app.route("/predict", methods=["POST"])
def predict():
    """Predict health risk based on vital signs."""
    try:
        if model is None:
            return jsonify({"error": "Model not loaded"}), 500

        data = request.get_json()

        # Prepare input data in the correct order for the model
        features = [
            data.get("Respiratory_Rate", 0),
            data.get("Oxygen_Saturation", 0),
            data.get("O2_Scale", -1),
            data.get("Systolic_BP", 0),
            data.get("Heart_Rate", 0),
            data.get("Temperature", 0),
            data.get("Consciousness", -1),
            data.get("On_Oxygen", -1),
        ]

        # Make prediction
        prediction = model.predict([features])
        
        # Map numeric prediction to risk level
        risk_mapping = {
            0: "Normal",
            1: "Low",
            2: "Medium",
            3: "High",
        }
        
        risk_level = risk_mapping.get(int(prediction[0]), "Unknown")

        return jsonify({"risk_level": risk_level}), 200

    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({"error": str(e)}), 400


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({"status": "ok", "model_loaded": model is not None}), 200


if __name__ == "__main__":
    print("Starting Health Risk Predictor API server...")
    print("Server running on http://localhost:5000")
    print("API endpoint: POST http://localhost:5000/predict")
    app.run(debug=True, port=5000)
