"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ClipboardCheck } from "lucide-react"

interface SimpleCaptchaProps {
  onVerified: () => void
}

export function SimpleCaptcha({ onVerified }: SimpleCaptchaProps) {
  const [num1, setNum1] = useState(0)
  const [num2, setNum2] = useState(0)
  const [answer, setAnswer] = useState("")
  const [error, setError] = useState(false)

  useEffect(() => {
    // Generate random numbers between 1 and 20
    setNum1(Math.floor(Math.random() * 20) + 1)
    setNum2(Math.floor(Math.random() * 10) + 1)
  }, [])

  const checkAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
    const userAnswer = e.target.value
    setAnswer(userAnswer)

    if (userAnswer === "") {
      setError(false)
      return
    }

    const correctAnswer = num1 + num2

    if (Number.parseInt(userAnswer) === correctAnswer) {
      setError(false)
      onVerified()
    } else {
      setError(true)
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-blue-600" />
        <Label htmlFor="captcha" className="text-sm font-medium">
          Verify you're human
        </Label>
      </div>
      <div className="flex items-center gap-2">
        <div className="text-center font-medium">
          {num1} + {num2} = ?
        </div>
        <Input
          id="captcha"
          type="number"
          placeholder="Enter your answer"
          value={answer}
          onChange={checkAnswer}
          className={error ? "border-red-500" : ""}
        />
      </div>
      {error && <p className="text-xs text-red-500">Incorrect answer, please try again.</p>}
    </div>
  )
}
