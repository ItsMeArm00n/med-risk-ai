import { useEffect, useState } from "react"

let pyodide: any = null
let modelLoaded = false

export async function initializePyodide() {
  if (pyodide) return pyodide

  try {
    // Load Pyodide
    const PyodideModule = await import("pyodide")
    pyodide = await PyodideModule.loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
    })

    // Install required packages
    await pyodide.loadPackage("numpy")
    await pyodide.loadPackage("scikit-learn")

    // Load Python code for prediction
    await pyodide.runPythonAsync(`
import pickle
import json
import numpy as np
from io import BytesIO
import base64

async def load_and_predict(model_b64, scaler_b64, encoder_b64, features_json):
    """Load models from base64 and make prediction"""
    try:
        # Decode base64
        model_data = base64.b64decode(model_b64)
        scaler_data = base64.b64decode(scaler_b64)
        encoder_data = base64.b64decode(encoder_b64)
        
        # Load models from bytes
        model = pickle.loads(model_data)
        scaler = pickle.loads(scaler_data)
        target_encoder = pickle.loads(encoder_data)
        
        # Parse features
        features = json.loads(features_json)
        features_array = np.array([[
            float(features.get("Respiratory_Rate", 0)),
            float(features.get("Oxygen_Saturation", 0)),
            int(features.get("O2_Scale", -1)),
            float(features.get("Systolic_BP", 0)),
            float(features.get("Heart_Rate", 0)),
            float(features.get("Temperature", 0)),
            int(features.get("Consciousness", -1)),
            int(features.get("On_Oxygen", -1)),
        ]])
        
        # Scale and predict
        scaled_features = scaler.transform(features_array)
        prediction = model.predict(scaled_features)[0]
        risk_label = target_encoder.inverse_transform([prediction])[0]
        
        return json.dumps({"risk_level": risk_label})
    except Exception as e:
        return json.dumps({"error": str(e)})
`)

    modelLoaded = true
    return pyodide
  } catch (error) {
    console.error("Failed to initialize Pyodide:", error)
    throw error
  }
}

export async function predictWithPyodide(
  modelBase64: string,
  scalerBase64: string,
  encoderBase64: string,
  features: any
): Promise<{ risk_level: string; error?: string }> {
  try {
    if (!pyodide) {
      await initializePyodide()
    }

    const result = await pyodide.runPythonAsync(`
await load_and_predict("${modelBase64}", "${scalerBase64}", "${encoderBase64}", '${JSON.stringify(features)}')
`)

    return JSON.parse(result)
  } catch (error: any) {
    console.error("Prediction error:", error)
    return { risk_level: "", error: error.message }
  }
}
