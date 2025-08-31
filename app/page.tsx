"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Heart,
  Activity,
  Shield,
  ShieldCheck,
  Code,
  Zap,
  Users,
  TrendingUp,
  ArrowRight,
  Stethoscope,
  Brain,
  Clock,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react"

const demoVitals = [
  {
    "Heart Rate": 140,
    "Oxygen Saturation": 89,
    "On Oxygen": "Yes",
    Assessment: "High Risk — Patient shows signs of respiratory distress and tachycardia.",
    "Risk Level": "High",
  },
  {
    "Heart Rate": 92,
    "Oxygen Saturation": 96,
    "On Oxygen": "No",
    Assessment: "Medium Risk — Vitals are stable but monitoring is advised.",
    "Risk Level": "Medium",
  },
  {
    "Heart Rate": 151,
    "Oxygen Saturation": 92,
    "On Oxygen": "Yes",
    Assessment: "High Risk — Elevated heart rate and low oxygen saturation suggest acute stress.",
    "Risk Level": "High",
  },
  {
    "Heart Rate": 97,
    "Oxygen Saturation": 91,
    "On Oxygen": "No",
    Assessment: "Low Risk — Slightly low saturation but overall vitals are within safe range.",
    "Risk Level": "Low",
  },
]

export default function HomePage() {
  const [currentVitalIndex, setCurrentVitalIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVitalIndex((prev) => (prev + 1) % demoVitals.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const currentVital = demoVitals[currentVitalIndex]

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-400 bg-green-500/10 border-green-500/20"
      case "Medium":
        return "text-yellow-400 bg-yellow-500/10 border-yellow-500/20"
      case "High":
        return "text-red-400 bg-red-500/10 border-red-500/20"
      default:
        return "text-green-500 bg-green-500/10 border-green-500/20"
    }
  }

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "Low":
        return <CheckCircle className="h-5 w-5 text-green-400" />
      case "Medium":
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />
      case "High":
        return <XCircle className="h-5 w-5 text-red-400 animate-pulse" />
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />
    }
  }

  const getOxygenStatusColor = (onOxygen: string) => {
    return onOxygen === "Yes" ? "text-red-400" : "text-green-400"
  }

  const getOxygenStatusDotColor = (onOxygen: string) => {
    return onOxygen === "Yes" ? "bg-red-400" : "bg-green-400"
  }

  return (
    <div className="min-h-screen bg-background relative">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50 opacity-0 animate-fade-in-down fill-mode-forwards">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2 opacity-0 animate-fade-in-left animation-delay-200 fill-mode-forwards">
              <div className="p-2 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors duration-300">
                <Heart className="h-6 w-6 text-primary animate-pulse" />
              </div>
              <span className="text-xl font-bold font-manrope">MedRisk AI</span>
            </div>
            <div className="flex items-center space-x-4 opacity-0 animate-fade-in-right animation-delay-300 fill-mode-forwards">
              <Link href="/assessment">
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-primary/25"
                >
                  Start Assessment
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5 animate-gradient-x"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 opacity-0 animate-fade-in-left animation-delay-400 fill-mode-forwards">
              <div className="space-y-4">
                <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium opacity-0 animate-fade-in-up animation-delay-600 fill-mode-forwards hover:bg-primary/20 transition-colors cursor-pointer">
                  <Zap className="h-4 w-4 animate-pulse" />
                  <span>AI-Powered Risk Assessment</span>
                </div>
                <h1 className="text-5xl lg:text-6xl font-bold font-manrope text-balance leading-tight opacity-0 animate-fade-in-up animation-delay-800 fill-mode-forwards">
                  Advanced Health Risk
                  <span className="text-primary block opacity-0 animate-fade-in-right animation-delay-1000 fill-mode-forwards">
                    Prediction Platform
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground text-pretty max-w-2xl opacity-0 animate-fade-in-up animation-delay-1200 fill-mode-forwards">
                  Harness the power of machine learning to explore how patient vital signs relate to health risk levels. 
                  This demo offers an interactive, data-driven experience designed for students, developers, and curious 
                  minds interested in clinical modeling and AI in healthcare.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animation-delay-1400 fill-mode-forwards">
                <Link href="/assessment">
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 group hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                  >
                    Check Risk Level
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border opacity-0 animate-fade-in-up animation-delay-1600 fill-mode-forwards">
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    95.5%
                  </div>
                  <div className="text-sm text-muted-foreground">Accuracy Rate</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    On Github
                  </div>
                  <div className="text-sm text-muted-foreground">Open Source</div>
                </div>
                <div className="text-center group cursor-pointer">
                  <div className="text-2xl font-bold text-primary group-hover:scale-110 transition-transform duration-300">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">Available</div>
                </div>
              </div>
            </div>

            <div className="relative opacity-0 animate-fade-in-right animation-delay-800 fill-mode-forwards">
              <div className="relative bg-card border border-border rounded-2xl p-8 shadow-2xl hover:shadow-3xl transition-all duration-500 group animate-float-slow">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold font-manrope">Patient Vitals</h3>
                    <div
                      className={`flex items-center space-x-2 text-sm ${getOxygenStatusColor(currentVital["On Oxygen"])}`}
                    >
                      <div
                        className={`w-2 h-2 ${getOxygenStatusDotColor(currentVital["On Oxygen"])} rounded-full animate-pulse`}
                      ></div>
                      <span>{currentVital["On Oxygen"] === "Yes" ? "On Oxygen" : "Not on Oxygen"}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-4 hover:bg-background/70 transition-all duration-500 group/card">
                      <div className="flex items-center space-x-2 mb-2">
                        <Heart className="h-4 w-4 text-primary animate-heartbeat" />
                        <span className="text-sm text-muted-foreground">Heart Rate</span>
                      </div>
                      <div className="text-2xl font-bold transition-all duration-500 animate-slide-in-right">
                        {currentVital["Heart Rate"]} BPM
                      </div>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4 hover:bg-background/70 transition-all duration-500 group/card">
                      <div className="flex items-center space-x-2 mb-2">
                        <Activity className="h-4 w-4 text-primary animate-pulse" />
                        <span className="text-sm text-muted-foreground">O2 Sat</span>
                      </div>
                      <div className="text-2xl font-bold transition-all duration-500 animate-slide-in-left">
                        {currentVital["Oxygen Saturation"]}%
                      </div>
                    </div>
                  </div>

                  <div
                    className={`border rounded-lg p-4 transition-all duration-500 animate-slide-in-up ${getRiskColor(currentVital["Risk Level"])} ${currentVital["Risk Level"] === "High" ? "animate-pulse-red" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Risk Assessment</span>
                      {getRiskIcon(currentVital["Risk Level"])}
                    </div>
                    <div
                      className={`text-2xl font-bold mt-2 transition-all duration-500 ${currentVital["Risk Level"] === "High" ? "animate-pulse" : ""}`}
                    >
                      {currentVital["Risk Level"]} Risk
                    </div>
                    <div className="text-sm opacity-90 mt-1 transition-all duration-500">{currentVital.Assessment}</div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 bg-primary/10 backdrop-blur-sm rounded-full p-3 opacity-0 animate-bounce animate-fade-in animation-delay-2600 fill-mode-forwards hover:animate-pulse transition-all duration-300 cursor-pointer">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <div className="absolute -bottom-4 -left-4 bg-secondary/10 backdrop-blur-sm rounded-full p-3 opacity-0 animate-pulse animate-fade-in animation-delay-2800 fill-mode-forwards hover:animate-bounce transition-all duration-300 cursor-pointer">
                <Stethoscope className="h-6 w-6 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 opacity-0 animate-fade-in-up fill-mode-forwards">
            <h2 className="text-4xl font-bold font-manrope mb-4">Why Choose MedRisk AI?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty">
              MedRisk AI blends machine learning with clinical data modeling to deliver fast, data-driven health risk assessments. Built for researchers, developers, and learners exploring AI in healthcare.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-200 fill-mode-forwards">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Brain className="h-6 w-6 text-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="font-manrope">AI-Powered Analysis</CardTitle>
                <CardDescription>
                  Machine learning algorithms trained on curated clinical datasets for simulated risk prediction.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-400 fill-mode-forwards">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Clock className="h-6 w-6 text-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="font-manrope">Real-Time Results</CardTitle>
                <CardDescription>
                  Get instant assessments within seconds of entering patient vitals and data.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-600 fill-mode-forwards">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Stethoscope className="h-6 w-6 text-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="font-manrope">Clinical Accuracy</CardTitle>
                <CardDescription>
                  chieves up to 95.55% accuracy in internal tests using benchmark datasets.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-800 fill-mode-forwards">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Users className="h-6 w-6 text-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="font-manrope">Multi-User Support</CardTitle>
                <CardDescription>
                  Role-based access and collaborative features for teams and classrooms.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-1000 fill-mode-forwards">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <ShieldCheck className="h-6 w-6 text-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="font-manrope">Privacy-Friendly</CardTitle>
                <CardDescription>
                  No patient data stored. All assessments run locally or in secure environments.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border bg-card hover:bg-card/80 transition-all duration-300 group hover:scale-105 hover:shadow-xl opacity-0 animate-fade-in-up animation-delay-1200 fill-mode-forwards">
              <CardHeader>
                <div className="p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <Code className="h-6 w-6 text-primary group-hover:animate-pulse" />
                </div>
                <CardTitle className="font-manrope">Open Source</CardTitle>
                <CardDescription>
                  Fully transparent codebase available for review, customization, and learning.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-primary/10 rounded-3xl p-12 border border-border hover:border-primary/30 transition-all duration-500 opacity-0 animate-fade-in-up fill-mode-forwards group">
            <h2 className="text-4xl font-bold font-manrope mb-4 group-hover:text-primary transition-colors duration-300">
              Reimagine Health Risk Assessment
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
              MedRisk AI brings speed, transparency, and innovation to predictive modeling.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/assessment">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-lg px-8 py-6 group/btn hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-primary/25"
                >
                  Start Risk Assessment
                  <ArrowRight className="ml-2 h-5 w-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-border py-12 animate-fade-in-up">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors duration-300">
                  <Heart className="h-5 w-5 text-primary group-hover:animate-pulse" />
                </div>
                <span className="text-lg font-bold font-manrope">MedRisk AI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Advanced AI-powered health risk assessment platform for healthcare professionals.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="/assessment"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Risk Assessment
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Analytics
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Reports
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-foreground transition-colors duration-200 hover:translate-x-1 inline-block"
                  >
                    HIPAA Compliance
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Medical Disclaimer:</strong> This tool is for educational and research purposes only. Always
              consult qualified healthcare professionals for medical decisions.
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              © 2025 MedRisk AI. Advancing healthcare insights through open-source machine learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
