import React, { useState, useRef } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"
import { usePyodidePredictor } from "@/hooks/use-pyodide-predictor"

export default function PredictSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const { predict, isReady } = usePyodidePredictor()

  const handlePredict = async () => {
    setModalOpen(false)
    setModalMessage("")

    if (!isReady) {
      setModalMessage("Model is still loading. Please wait...")
      setModalOpen(true)
      return
    }

    // Timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 10000)
    )

    // Call prediction
    const apiPromise = predict({})

    try {
      await Promise.race([apiPromise, timeoutPromise])
      // Success: do nothing
    } catch (err: any) {
      if (err.message === "timeout") {
        setModalMessage("Prediction is taking too long.")
      } else {
        setModalMessage(`Prediction failed: ${err.message}`)
      }
      setModalOpen(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handlePredict}>Predict</Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="API Warning">
        {modalMessage}
      </Modal>
    </div>
  )
}
