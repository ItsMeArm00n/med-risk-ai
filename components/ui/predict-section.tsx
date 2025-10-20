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

    // API call promise
    const apiPromise = fetch("https://ItsMeArm00n-Health-Risk-Predictor.hf.space/predict")
      .then(async (res) => {
        // Check for valid response (customize this check)
        if (!res.ok) throw new Error("invalid")
        const data = await res.json()
        // Replace this with your required output check
        if (!data || !data.requiredField) throw new Error("invalid")
        return data
      })

    try {
      await Promise.race([apiPromise, timeoutPromise])
      // Success: do nothing
    } catch (err: any) {
      if (err.message === "timeout") {
        setModalMessage("The API is taking too long. It may be asleep. Please restart it using the link in the footer.")
      } else {
        setModalMessage("The API did not return the required output. Please check the API or try again later.")
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
