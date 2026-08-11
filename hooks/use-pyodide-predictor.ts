import { useEffect, useState } from "react"

let pyodide: any = null
let loadingPyodide = false

async function loadPyodide() {
  if (pyodide) return pyodide
  if (loadingPyodide) return null

  loadingPyodide = true

  try {
    // Load Pyodide from CDN
    const script = document.createElement("script")
    script.src = "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
    script.async = true

    await new Promise((resolve, reject) => {
      script.onload = resolve
      script.onerror = reject
      document.head.appendChild(script)
    })

    // Access Pyodide from window
    const PyodideModule = (window as any).loadPyodide
    if (!PyodideModule) {
      throw new Error("Pyodide failed to load from CDN")
    }

    pyodide = await PyodideModule({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.23.4/full/",
    })

    // Install required packages
    console.log("[Pyodide] Loading numpy...")
    await pyodide.loadPackage("numpy")
    
    // Load micropip and install xgboost with specific wheel
    console.log("[Pyodide] Loading micropip...")
    await pyodide.loadPackage("micropip")
    const micropip = pyodide.pyimport("micropip")
    
    console.log("[Pyodide] Installing xgboost...")
    try {
      // Try installing compatible xgboost wheel
      await micropip.install([
        "https://files.pythonhosted.org/packages/f8/cc/184d10ca3a1d1f7a65fb2f2b3ddbd5301f0c01eeea5c7e77076a2078e0a5/xgboost-1.7.6.post2-py3-none-manylinux_2_17_x86_64.manylinux2014_x86_64.whl",
      ])
    } catch (wheelError: any) {
      console.warn("[Pyodide] Wheel install failed, trying micropip:", wheelError.message)
      try {
        await micropip.install("xgboost==1.7.6")
      } catch (pipError: any) {
        console.warn("[Pyodide] XGBoost install failed:", pipError.message)
        // Continue anyway - will fail at predict time if model can't load
      }
    }

    // Load prediction function
    await pyodide.runPythonAsync(`
import pickle
import json
import numpy as np
import base64
from io import BytesIO

def predict_risk(model_b64, scaler_b64, encoder_b64, features_json):
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
        
        return json.dumps({"risk_level": str(risk_label)})
    except Exception as e:
        return json.dumps({"error": str(e)})
`)

    loadingPyodide = false
    return pyodide
  } catch (error) {
    console.error("Failed to load Pyodide:", error)
    loadingPyodide = false
    throw error
  }
}

export function usePyodidePredictor() {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [modelData, setModelData] = useState<{
    modelBase64: string
    scalerBase64: string
    encoderBase64: string
  } | null>(null)

  useEffect(() => {
    const initialize = async () => {
      try {
        // Load Pyodide
        await loadPyodide()

        // Fetch model files from API
        const response = await fetch("/api/predict", { method: "POST", body: "{}" })
        const data = await response.json()

        if (data.error) {
          setError(data.error)
          return
        }

        setModelData({
          modelBase64: data.modelBase64,
          scalerBase64: data.scalerBase64,
          encoderBase64: data.encoderBase64,
        })

        setIsReady(true)
      } catch (err: any) {
        setError(err.message)
        console.error("Failed to initialize predictor:", err)
      }
    }

    initialize()
  }, [])

  const predict = async (features: any) => {
    try {
      if (!isReady || !modelData || !pyodide) {
        throw new Error("Predictor not ready. Please wait...")
      }

      const result = await pyodide.runPythonAsync(`
predict_risk("${modelData.modelBase64}", "${modelData.scalerBase64}", "${modelData.encoderBase64}", '${JSON.stringify(features)}')
`)

      return JSON.parse(result)
    } catch (err: any) {
      console.error("Prediction error:", err)
      return { error: err.message }
    }
  }

  return { predict, isReady, error }
}
