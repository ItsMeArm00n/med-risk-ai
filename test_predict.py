#!/usr/bin/env python
"""
Test script to verify the prediction setup works
Run this: python test_predict.py
"""

import json
import sys
import subprocess

test_data = {
    "Respiratory_Rate": 16,
    "Oxygen_Saturation": 98,
    "O2_Scale": 1,
    "Systolic_BP": 120,
    "Heart_Rate": 72,
    "Temperature": 37,
    "Consciousness": 0,
    "On_Oxygen": 1,
}

print("Testing prediction setup...")
print("=" * 50)

# Test 1: Check Python version
print("\n1. Checking Python version...")
result = subprocess.run([sys.executable, "--version"], capture_output=True, text=True)
print(f"   ✓ Python version: {result.stdout.strip()}")

# Test 2: Check dependencies
print("\n2. Checking dependencies...")
try:
    import joblib
    print(f"   ✓ joblib is installed")
except ImportError:
    print(f"   ✗ joblib NOT installed - run: pip install joblib")

try:
    import numpy
    print(f"   ✓ numpy is installed")
except ImportError:
    print(f"   ✗ numpy NOT installed - run: pip install numpy")

try:
    import sklearn
    print(f"   ✓ scikit-learn is installed")
except ImportError:
    print(f"   ✗ scikit-learn NOT installed - run: pip install scikit-learn")

# Test 3: Check model files
print("\n3. Checking model files...")
import os
for file in ["Health_risk_predictor_model.pkl", "scaler.pkl", "target_encoder.pkl"]:
    if os.path.exists(file):
        size = os.path.getsize(file)
        print(f"   ✓ {file} exists ({size} bytes)")
    else:
        print(f"   ✗ {file} NOT found")

# Test 4: Try running predict.py directly
print("\n4. Testing predict.py directly...")
try:
    result = subprocess.run(
        [sys.executable, "predict.py"],
        input=json.dumps(test_data),
        capture_output=True,
        text=True,
        timeout=10
    )
    print(f"   Exit code: {result.returncode}")
    if result.stdout:
        print(f"   Stdout: {result.stdout}")
    if result.stderr:
        print(f"   Stderr: {result.stderr}")
    
    if result.returncode == 0:
        try:
            output = json.loads(result.stdout.strip())
            print(f"   ✓ SUCCESS: Prediction = {output}")
        except json.JSONDecodeError as e:
            print(f"   ✗ Could not parse output as JSON: {e}")
    else:
        print(f"   ✗ predict.py exited with error code {result.returncode}")
except subprocess.TimeoutExpired:
    print(f"   ✗ predict.py timed out")
except Exception as e:
    print(f"   ✗ Error running predict.py: {e}")

print("\n" + "=" * 50)
print("Testing complete!")
