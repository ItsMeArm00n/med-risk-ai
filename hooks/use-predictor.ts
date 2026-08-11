"use client"

import { useState, useCallback } from "react"

interface PredictionResult {
  risk_level: string
  error?: string
}

/**
 * Predicts risk level by calling the server-side Python API (/api/predict).
 * The model, scaler, and encoder live on the server (Vercel Python Function),
 * so no browser-side ML runtime is needed.
 */
export function usePredictor() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const predict = useCallback(async (features: object = {}): Promise<PredictionResult> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(features),
      })

      const data = await response.json()

      if (!response.ok) {
        const message = data.error ?? `Prediction failed (HTTP ${response.status})`
        setError(message)
        return { risk_level: "", error: message }
      }

      if (data.risk_level) {
        return { risk_level: data.risk_level }
      }

      const message = data.error ?? "Unexpected response from prediction API"
      setError(message)
      return { risk_level: "", error: message }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Network error during prediction"
      setError(message)
      return { risk_level: "", error: message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { predict, isLoading, error }
}
