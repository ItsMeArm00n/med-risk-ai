"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import {
  Loader2,
  Heart,
  Activity,
  Thermometer,
  Gauge,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Info,
  Brain,
  Stethoscope,
  TrendingUp,
  Clock,
  Plus,
  Microscope,
  Pill,
  Clipboard,
} from "lucide-react"

interface VitalSigns {
  Respiratory_Rate: number
  Oxygen_Saturation: number
  O2_Scale: number
  Systolic_BP: number
  Heart_Rate: number
  Temperature: number
  Consciousness: number
  On_Oxygen: number
}

interface PredictionResult {
  risk_level: "Normal" | "Low" | "Medium" | "High"
}

export default function AssessmentPage() {
  const [formData, setFormData] = useState<VitalSigns>({
    Respiratory_Rate: 0,
    Oxygen_Saturation: 0,
    O2_Scale: -1, // -1 indicates not selected
    Systolic_BP: 0,
    Heart_Rate: 0,
    Temperature: 0,
    Consciousness: -1, // -1 indicates not selected
    On_Oxygen: -1, // -1 indicates not selected
  })

  const [result, setResult] = useState<PredictionResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState(1)

  const consciousnessOptions = [
    { value: 0, label: "Alert (A)", description: "Patient is fully conscious and responsive" },
    { value: 1, label: "Confusion (C)", description: "Patient shows signs of confusion or disorientation" },
    { value: 2, label: "Pain response (P)", description: "Patient responds only to painful stimuli" },
    { value: 3, label: "Unresponsive (U)", description: "Patient does not respond to any stimuli" },
    { value: 4, label: "Verbal (V)", description: "Patient responds to verbal commands" },
  ]

  const handleInputChange = (field: keyof VitalSigns, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      console.log("[v0] Sending assessment data:", formData)
      const response = await fetch("https://ItsMeArm00n-Health-Risk-Predictor.hf.space/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`)
      }

      const data: PredictionResult = await response.json()
      console.log("[v0] Received prediction result:", data)
      setResult(data)
    } catch (err) {
      console.log("[v0] Error occurred:", err)
      setError(err instanceof Error ? err.message : "An error occurred while processing the assessment")
    } finally {
      setLoading(false)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Normal":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "Low":
        return "text-green-300 bg-green-500/10 border-green-500/20"
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/20 animate-pulse-red"
      default:
        return "text-muted-foreground bg-muted/10 border-border"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Normal":
        return <CheckCircle className="h-6 w-6 text-green-400" />
      case "Low":
        return <Info className="h-6 w-6 text-green-300" />
      case "Medium":
        return <AlertTriangle className="h-6 w-6 text-yellow-400" />
      case "High":
        return <XCircle className="h-6 w-6 text-red-400 animate-pulse" />
      default:
        return <Gauge className="h-6 w-6 text-muted-foreground" />
    }
  }

  const getRiskDescription = (risk: string) => {
    switch (risk) {
      case "Normal":
        return "Patient vitals are within normal parameters. Continue routine monitoring."
      case "Low":
        return "Slight deviation from normal ranges. Monitor patient closely for changes."
      case "Medium":
        return "Moderate risk detected. Consider additional assessment and intervention."
      case "High":
        return "High risk identified. Immediate medical attention and intervention required."
      default:
        return "Assessment pending..."
    }
  }

  const getFormProgress = () => {
    const fieldsForProgress = [
      formData.Respiratory_Rate,
      formData.Oxygen_Saturation,
      formData.Systolic_BP,
      formData.Heart_Rate,
      formData.Temperature,
    ]

    const consciousnessFieldFilled = formData.Consciousness >= 0
    const o2ScaleFilled = formData.O2_Scale >= 0
    const onOxygenFilled = formData.On_Oxygen >= 0

    const filledFields = fieldsForProgress.filter((value) => value > 0).length
    const totalFields = fieldsForProgress.length + 3
    const progressFields =
      filledFields + (consciousnessFieldFilled ? 1 : 0) + (o2ScaleFilled ? 1 : 0) + (onOxygenFilled ? 1 : 0)

    const baseProgress = 7
    const remainingProgress = 100 - baseProgress
    const calculatedProgress = (progressFields / totalFields) * remainingProgress

    return baseProgress + calculatedProgress
  }

  const isFormComplete = () => {
    const requiredFields = [
      formData.Respiratory_Rate > 0,
      formData.Oxygen_Saturation > 0,
      formData.Systolic_BP > 0,
      formData.Heart_Rate > 0,
      formData.Temperature > 0,
      formData.Consciousness >= 0,
      formData.O2_Scale >= 0,
      formData.On_Oxygen >= 0,
    ]

    return requiredFields.every((field) => field === true)
  }

  return (
    <div className="min-h-screen bg-background relative">
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 opacity-0 animate-fade-in-down fill-mode-forwards">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4 opacity-0 animate-fade-in-left animation-delay-200 fill-mode-forwards">
              <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Home</span>
              </Link>
            </div>
            <div className="flex items-center space-x-2 opacity-0 animate-fade-in-right animation-delay-300 fill-mode-forwards">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Heart className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <span className="text-xl font-bold font-manrope">MedRisk AI</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 left-16 opacity-0 animate-float animation-delay-500 fill-mode-forwards">
          <div className="p-2 bg-primary/5 rounded-full backdrop-blur-sm">
            <Plus className="h-5 w-5" />
          </div>
        </div>
        <div className="absolute top-64 right-24 opacity-0 animate-float-delayed animation-delay-700 fill-mode-forwards">
          <div className="p-3 bg-secondary/5 rounded-full backdrop-blur-sm">
            <Activity className="h-6 w-6 text-secondary/25 animate-heartbeat" />
          </div>
        </div>
        <div className="absolute bottom-48 left-32 opacity-0 animate-float-slow animation-delay-900 fill-mode-forwards">
          <div className="p-2 bg-primary/5 rounded-full backdrop-blur-sm">
            <Heart className="h-5 w-5 text-primary/20 animate-heartbeat" />
          </div>
        </div>
        <div className="absolute bottom-32 right-16 opacity-0 animate-float animation-delay-1100 fill-mode-forwards">
          <div className="p-3 bg-secondary/5 rounded-full backdrop-blur-sm">
            <Stethoscope className="h-6 w-6 text-secondary/30" />
          </div>
        </div>
        <div className="absolute top-96 left-1/4 opacity-0 animate-float-delayed animation-delay-1300 fill-mode-forwards">
          <div className="p-2 bg-primary/5 rounded-full backdrop-blur-sm">
            <Thermometer className="h-5 w-5 text-primary/25" />
          </div>
        </div>
        <div className="absolute bottom-64 right-1/3 opacity-0 animate-float-slow animation-delay-1500 fill-mode-forwards">
          <div className="p-3 bg-secondary/5 rounded-full backdrop-blur-sm">
            <Microscope className="h-6 w-6 text-secondary/20" />
          </div>
        </div>
        <div className="absolute top-48 right-1/4 opacity-0 animate-float animation-delay-1700 fill-mode-forwards">
          <div className="p-2 bg-primary/5 rounded-full backdrop-blur-sm">
            <Pill className="h-5 w-5 text-primary/30" />
          </div>
        </div>
        <div className="absolute top-80 right-20 opacity-0 animate-float-slow animation-delay-2100 fill-mode-forwards">
          <div className="p-2 bg-primary/5 rounded-full backdrop-blur-sm">
            <Clipboard className="h-5 w-5 text-primary/20" />
          </div>
        </div>
        <div className="absolute top-1/2 left-1/5 opacity-0 animate-float animation-delay-2300 fill-mode-forwards">
          <div className="p-2 bg-primary/5 rounded-full backdrop-blur-sm">
            <Heart className="h-4 w-4 text-primary/15 animate-heartbeat" />
          </div>
        </div>
        <div className="absolute top-1/3 right-1/5 opacity-0 animate-float-delayed animation-delay-2500 fill-mode-forwards">
          <div className="p-3 bg-secondary/5 rounded-full backdrop-blur-sm">
            <Activity className="h-6 w-6 text-secondary/20 animate-heartbeat" />
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-b from-primary/5 to-background py-12 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6 opacity-0 animate-fade-in-up animation-delay-400 fill-mode-forwards">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold font-manrope mb-4 opacity-0 animate-fade-in-up animation-delay-500 fill-mode-forwards">
            Health Risk Assessment
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty opacity-0 animate-fade-in-up animation-delay-600 fill-mode-forwards">
            Enter patient vital signs for AI-powered risk analysis and clinical decision support
          </p>

          {/* Progress Bar */}
          <div className="mt-8 max-w-md mx-auto opacity-0 animate-fade-in-up animation-delay-700 fill-mode-forwards">
            <div className="flex justify-between text-sm text-muted-foreground mb-2">
              <span>Form Progress</span>
              <span>{Math.round(getFormProgress())}%</span>
            </div>
            <Progress value={getFormProgress()} className="h-2" />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-border bg-card opacity-0 animate-fade-in-left animation-delay-800 fill-mode-forwards">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Stethoscope className="h-5 w-5 text-primary" />
                  </div>
                  Patient Vital Signs Assessment
                </CardTitle>
                <CardDescription>
                  Complete all fields for accurate risk prediction. All measurements should reflect current patient
                  status.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Respiratory Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Activity className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold font-manrope">Respiratory Assessment</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="respiratory-rate" className="text-sm font-medium">
                          Respiratory Rate
                          <span className="text-muted-foreground ml-1">(breaths/min)</span>
                        </Label>
                        <Input
                          id="respiratory-rate"
                          type="number"
                          min="0"
                          max="60"
                          placeholder="e.g., 16"
                          value={formData.Respiratory_Rate || ""}
                          onChange={(e) => handleInputChange("Respiratory_Rate", Number(e.target.value))}
                          className="bg-input border-border focus:border-primary"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Normal range: 12-20 breaths/min</p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="oxygen-saturation" className="text-sm font-medium">
                          Oxygen Saturation
                          <span className="text-muted-foreground ml-1">(%)</span>
                        </Label>
                        <Input
                          id="oxygen-saturation"
                          type="number"
                          min="0"
                          max="100"
                          placeholder="e.g., 98"
                          value={formData.Oxygen_Saturation || ""}
                          onChange={(e) => handleInputChange("Oxygen_Saturation", Number(e.target.value))}
                          className="bg-input border-border focus:border-primary"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Normal range: 95-100%</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="o2-scale" className="text-sm font-medium">
                          O2 Scale Assessment
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("O2_Scale", Number(value))}
                          value={formData.O2_Scale >= 0 ? formData.O2_Scale.toString() : ""}
                        >
                          <SelectTrigger className="bg-input border-border focus:border-primary">
                            <SelectValue placeholder="Select O2 scale" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Yes</SelectItem>
                            <SelectItem value="2">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="on-oxygen" className="text-sm font-medium">
                          Patient on Oxygen
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("On_Oxygen", Number(value))}
                          value={formData.On_Oxygen >= 0 ? formData.On_Oxygen.toString() : ""}
                        >
                          <SelectTrigger className="bg-input border-border focus:border-primary">
                            <SelectValue placeholder="Select oxygen status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Yes</SelectItem>
                            <SelectItem value="0">No</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Cardiovascular Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Heart className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold font-manrope">Cardiovascular Assessment</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="systolic-bp" className="text-sm font-medium">
                          Systolic Blood Pressure
                          <span className="text-muted-foreground ml-1">(mmHg)</span>
                        </Label>
                        <Input
                          id="systolic-bp"
                          type="number"
                          min="0"
                          max="300"
                          placeholder="e.g., 120"
                          value={formData.Systolic_BP || ""}
                          onChange={(e) => handleInputChange("Systolic_BP", Number(e.target.value))}
                          className="bg-input border-border focus:border-primary"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Normal range: 90-140 mmHg</p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="heart-rate" className="text-sm font-medium">
                          Heart Rate
                          <span className="text-muted-foreground ml-1">(bpm)</span>
                        </Label>
                        <Input
                          id="heart-rate"
                          type="number"
                          min="0"
                          max="300"
                          placeholder="e.g., 72"
                          value={formData.Heart_Rate || ""}
                          onChange={(e) => handleInputChange("Heart_Rate", Number(e.target.value))}
                          className="bg-input border-border focus:border-primary"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Normal range: 60-100 bpm</p>
                      </div>
                    </div>
                  </div>

                  {/* Neurological Section */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 pb-2 border-b border-border">
                      <Brain className="h-5 w-5 text-primary" />
                      <h3 className="text-lg font-semibold font-manrope">Neurological Assessment</h3>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label htmlFor="temperature" className="text-sm font-medium">
                          Body Temperature
                          <span className="text-muted-foreground ml-1">(°C)</span>
                        </Label>
                        <Input
                          id="temperature"
                          type="number"
                          step="0.1"
                          min="30"
                          max="45"
                          placeholder="e.g., 37.0"
                          value={formData.Temperature || ""}
                          onChange={(e) => handleInputChange("Temperature", Number(e.target.value))}
                          className="bg-input border-border focus:border-primary"
                          required
                        />
                        <p className="text-xs text-muted-foreground">Normal range: 36.1-37.2°C</p>
                      </div>

                      <div className="space-y-3">
                        <Label htmlFor="consciousness" className="text-sm font-medium">
                          Consciousness Level (AVPU Scale)
                        </Label>
                        <Select
                          onValueChange={(value) => handleInputChange("Consciousness", Number(value))}
                          value={formData.Consciousness >= 0 ? formData.Consciousness.toString() : ""}
                        >
                          <SelectTrigger className="bg-input border-border focus:border-primary">
                            <SelectValue placeholder="Select consciousness level" />
                          </SelectTrigger>
                          <SelectContent>
                            {consciousnessOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value.toString()}>
                                <div className="flex flex-col">
                                  <span className="font-medium">{option.label}</span>
                                  <span className="text-xs text-muted-foreground">{option.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-lg py-6 group"
                    disabled={loading || !isFormComplete()}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analyzing Patient Data...
                      </>
                    ) : (
                      <>
                        <Gauge className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                        Generate Risk Assessment
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Results & Info Section */}
          <div className="space-y-6">
            {/* Error Display */}
            {error && (
              <Alert
                variant="destructive"
                className="border-red-500/20 bg-red-500/10 opacity-0 animate-fade-in-right animation-delay-900 fill-mode-forwards"
              >
                <XCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">{error}</AlertDescription>
              </Alert>
            )}

            {/* Information Card */}
            <Card className="shadow-xl border-border bg-card opacity-0 animate-fade-in-right animation-delay-1100 fill-mode-forwards">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Assessment Guidelines
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <h4 className="font-semibold text-sm">Risk Level Interpretation:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-green-500/10">
                      <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      <div>
                        <span className="font-medium text-green-400">Normal/Low:</span>
                        <span className="text-muted-foreground ml-2">Stable condition, routine monitoring</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-yellow-500/10">
                      <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                      <div>
                        <span className="font-medium text-yellow-400">Medium:</span>
                        <span className="text-muted-foreground ml-2">Enhanced monitoring required</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-2 rounded-lg bg-red-500/10">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <div>
                        <span className="font-medium text-red-400">High:</span>
                        <span className="text-muted-foreground ml-2">Immediate medical intervention</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <h4 className="font-semibold text-sm mb-2">Clinical Notes:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    <li>• Ensure all measurements are current and accurate</li>
                    <li>• Consider patient history and comorbidities</li>
                    <li>• Use clinical judgment alongside AI predictions</li>
                    <li>• Document all findings in patient records</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {result && (
              <Card className="shadow-xl border-border bg-card opacity-0 animate-fade-in-right animation-delay-1000 fill-mode-forwards">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    Risk Assessment Result
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className={`p-6 rounded-xl border-2 ${getRiskColor(result.risk_level)}`}>
                    <div className="flex items-center justify-between mb-4">
                      {getRiskIcon(result.risk_level)}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Just now</span>
                      </div>
                    </div>
                    <div className={`text-3xl font-bold mb-2 ${result.risk_level === "High" ? "animate-pulse" : ""}`}>
                      {result.risk_level} Risk
                    </div>
                    <p className="text-sm opacity-90 mb-4">{getRiskDescription(result.risk_level)}</p>

                    {result.risk_level === "High" && (
                      <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mt-4 animate-pulse">
                        <div className="flex items-center gap-2 text-red-400 font-medium text-sm">
                          <AlertTriangle className="h-4 w-4" />
                          Immediate Action Required
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-8 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground mb-2">
            <strong>Medical Disclaimer:</strong> This AI assessment tool is for clinical decision support only. Always
            use professional medical judgment and follow institutional protocols.
          </p>
          <p className="text-xs text-muted-foreground">MedRisk AI v2.0 - Built for healthcare excellence</p>
        </div>
      </footer>
    </div>
  )
}
