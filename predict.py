"""
Prediction script that reads input from stdin and outputs prediction to stdout.
Uses joblib to load model, scaler, and target encoder - matching FastAPI setup.
"""

import joblib
import json
import sys
import os
import numpy as np

# Get absolute path to model files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "Health_risk_predictor_model.pkl")
SCALER_PATH = os.path.join(BASE_DIR, "scaler.pkl")
TARGET_ENCODER_PATH = os.path.join(BASE_DIR, "target_encoder.pkl")

# Load model, scaler, and target encoder
try:
    model = joblib.load(MODEL_PATH)
    sys.stderr.write(f"✓ Model loaded from {MODEL_PATH}\n")
    sys.stderr.flush()
except FileNotFoundError:
    error_msg = {"error": f"Model file not found at {MODEL_PATH}"}
    print(json.dumps(error_msg))
    sys.exit(1)
except Exception as e:
    error_msg = {"error": f"Failed to load model: {type(e).__name__}: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)

try:
    scaler = joblib.load(SCALER_PATH)
    sys.stderr.write(f"✓ Scaler loaded from {SCALER_PATH}\n")
    sys.stderr.flush()
except Exception as e:
    error_msg = {"error": f"Failed to load scaler: {type(e).__name__}: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)

try:
    target_encoder = joblib.load(TARGET_ENCODER_PATH)
    sys.stderr.write(f"✓ Target encoder loaded from {TARGET_ENCODER_PATH}\n")
    sys.stderr.flush()
except Exception as e:
    error_msg = {"error": f"Failed to load target encoder: {type(e).__name__}: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)

# Read input from stdin
try:
    input_data = sys.stdin.read()
    if not input_data:
        error_msg = {"error": "No input data received"}
        print(json.dumps(error_msg))
        sys.exit(1)
    
    data = json.loads(input_data)
except json.JSONDecodeError as e:
    error_msg = {"error": f"Invalid JSON input: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)
except Exception as e:
    error_msg = {"error": f"Input error: {type(e).__name__}: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)

# Make prediction
try:
    # Prepare features in the exact order and format
    features = np.array([[
        float(data.get("Respiratory_Rate", 0)),
        float(data.get("Oxygen_Saturation", 0)),
        int(data.get("O2_Scale", -1)),
        float(data.get("Systolic_BP", 0)),
        float(data.get("Heart_Rate", 0)),
        float(data.get("Temperature", 0)),
        int(data.get("Consciousness", -1)),
        int(data.get("On_Oxygen", -1)),
    ]])
    
    sys.stderr.write(f"Features: {features}\n")
    sys.stderr.flush()
    
    # Scale features
    features_scaled = scaler.transform(features)
    sys.stderr.write(f"Scaled features: {features_scaled}\n")
    sys.stderr.flush()
    
    # Make prediction
    prediction = model.predict(features_scaled)[0]
    sys.stderr.write(f"Raw prediction: {prediction}\n")
    sys.stderr.flush()
    
    # Inverse transform to get risk label
    risk_label = target_encoder.inverse_transform([prediction])[0]
    sys.stderr.write(f"Risk label: {risk_label}\n")
    sys.stderr.flush()
    
    # Output result
    result = {"risk_level": risk_label}
    print(json.dumps(result))
    sys.exit(0)
    
except ValueError as e:
    error_msg = {"error": f"Invalid data type: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)
except Exception as e:
    error_msg = {"error": f"Prediction error: {type(e).__name__}: {e}"}
    print(json.dumps(error_msg))
    sys.exit(1)
