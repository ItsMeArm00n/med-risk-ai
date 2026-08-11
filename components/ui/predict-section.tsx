"use client"

import React, { useState } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"
import { usePredictor } from "@/hooks/use-predictor"

export default function PredictSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")
  const { predict, isLoading } = usePredictor()

  const handlePredict = async () => {
    setModalOpen(false)
    setModalMessage("")

    const result = await predict({})

    if (!result.risk_level) {
      setModalMessage(result.error ?? "Prediction failed.")
      setModalOpen(true)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <Button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? "Predicting..." : "Predict"}
      </Button>
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="API Warning">
        {modalMessage}
      </Modal>
    </div>
  )
}
