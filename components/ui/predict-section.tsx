import React, { useState, useRef } from "react"
import { Modal } from "@/components/ui/Modal"
import { Button } from "@/components/ui/button"

export default function PredictSection() {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMessage, setModalMessage] = useState("")

  const handlePredict = async () => {
    setModalOpen(false)
    setModalMessage("")

    // Timeout promise
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("timeout")), 10000)
    )

    // Call Next.js API route
    const apiPromise = fetch("/api/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({}),
    })
      .then(async (res) => {
        const data = await res.json()
        if (!res.ok) {
          throw new Error(data.error || `HTTP ${res.status}`)
        }
        if (!data || !data.risk_level) throw new Error("No risk_level in response")
        return data
      })

    try {
      await Promise.race([apiPromise, timeoutPromise])
      // Success: do nothing
    } catch (err: any) {
      if (err.message === "timeout") {
        setModalMessage("Prediction is taking too long. Make sure Python is installed.")
      } else {
        setModalMessage("Failed to get prediction. Make sure Python is installed: pip install -r requirements.txt")
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
