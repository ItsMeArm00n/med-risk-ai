#!/usr/bin/env python3
"""Convert XGBoost model to ONNX format for browser inference."""

import pickle
import json
import numpy as np
from pathlib import Path
import sys

try:
    import skl2onnx
    from skl2onnx.common.data_types import FloatTensorType
    import onnx
    import onnxruntime as ort
except ImportError:
    print("ERROR: Required packages not found. Install with:")
    print("pip install skl2onnx onnx onnxruntime")
    sys.exit(1)

# Load the original model components
model_path = Path("Health_risk_predictor_model.pkl")
scaler_path = Path("scaler.pkl")
encoder_path = Path("target_encoder.pkl")

print(f"Loading model from {model_path}...")
with open(model_path, "rb") as f:
    model = pickle.load(f)

print(f"Loading scaler from {scaler_path}...")
with open(scaler_path, "rb") as f:
    scaler = pickle.load(f)

print(f"Loading encoder from {encoder_path}...")
with open(encoder_path, "rb") as f:
    target_encoder = pickle.load(f)

# Define input schema for ONNX conversion
initial_type = [("float_input", FloatTensorType([None, 8]))]

print("Converting XGBoost model to ONNX...")
try:
    # Convert the model to ONNX
    onnx_model = skl2onnx.convert_sklearn(model, initial_types=initial_type, target_opset=12)
    
    # Save the ONNX model
    onnx_path = Path("Health_risk_predictor_model.onnx")
    with open(onnx_path, "wb") as f:
        f.write(onnx_model.SerializeToString())
    
    print(f"✓ ONNX model saved to {onnx_path}")
    print(f"  File size: {onnx_path.stat().st_size / 1024:.1f} KB")
    
    # Test the ONNX model
    print("\nTesting ONNX model...")
    sess = ort.InferenceSession(str(onnx_path))
    
    # Create test input
    test_input = np.array([[16, 98, 1, 120, 72, 37, 0, 1]], dtype=np.float32)
    print(f"Test input: {test_input}")
    
    # Scale input
    scaled = scaler.transform(test_input)
    print(f"Scaled input: {scaled}")
    
    # Run ONNX prediction
    input_name = sess.get_inputs()[0].name
    output_name = sess.get_outputs()[0].name
    
    result = sess.run([output_name], {input_name: scaled})
    prediction = result[0][0]
    
    print(f"ONNX prediction (raw): {prediction}")
    
    # Inverse transform to get label
    risk_label = target_encoder.inverse_transform([int(prediction)])[0]
    print(f"Risk label: {risk_label}")
    
    # Save scaler and encoder as pickle for browser use
    print(f"\nScaler saved at {scaler_path} (size: {scaler_path.stat().st_size / 1024:.1f} KB)")
    print(f"Encoder saved at {encoder_path} (size: {encoder_path.stat().st_size / 1024:.1f} KB)")
    
    print("\n✓ Model conversion complete! Ready for browser deployment.")
    
except Exception as e:
    print(f"ERROR during conversion: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
