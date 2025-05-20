"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calculator } from "lucide-react"

interface MathPuzzleProps {
  onVerify: (verified: boolean) => void
}

export function MathPuzzle({ onVerify }: MathPuzzleProps) {
  const [firstNumber, setFirstNumber] = useState(0)
  const [secondNumber, setSecondNumber] = useState(0)
  const [operation, setOperation] = useState<"+" | "-">("+")
  const [answer, setAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Generate a new math puzzle
  const generatePuzzle = () => {
    // Generate random numbers between 1 and 20
    const num1 = Math.floor(Math.random() * 20) + 1
    const num2 = Math.floor(Math.random() * 20) + 1

    // Randomly choose between addition and subtraction
    // For subtraction, ensure the result is positive by making the first number larger
    const op = Math.random() > 0.5 ? "+" : "-"

    if (op === "-") {
      setFirstNumber(Math.max(num1, num2))
      setSecondNumber(Math.min(num1, num2))
    } else {
      setFirstNumber(num1)
      setSecondNumber(num2)
    }

    setOperation(op)
    setAnswer("")
    setIsCorrect(null)
    onVerify(false)
  }

  // Initialize puzzle on component mount
  useEffect(() => {
    generatePuzzle()
  }, [])

  // Check if the answer is correct
  const checkAnswer = (value: string) => {
    setAnswer(value)

    const userAnswer = Number.parseInt(value, 10)
    if (isNaN(userAnswer)) {
      setIsCorrect(null)
      onVerify(false)
      return
    }

    let correctAnswer: number
    if (operation === "+") {
      correctAnswer = firstNumber + secondNumber
    } else {
      correctAnswer = firstNumber - secondNumber
    }

    const correct = userAnswer === correctAnswer
    setIsCorrect(correct)
    onVerify(correct)
  }

  return (
    <div className="w-full p-4 border rounded-lg bg-secondary/20">
      <div className="flex items-center gap-2 mb-3">
        <Calculator className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">Verify you're human</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-center text-lg font-medium">
          <span>{firstNumber}</span>
          <span className="mx-2">{operation}</span>
          <span>{secondNumber}</span>
          <span className="mx-2">=</span>
          <span>?</span>
        </div>

        <div>
          <Label htmlFor="math-answer" className="sr-only">
            Answer
          </Label>
          <Input
            id="math-answer"
            type="number"
            placeholder="Enter your answer"
            value={answer}
            onChange={(e) => checkAnswer(e.target.value)}
            className={`text-center ${
              isCorrect === true
                ? "border-green-500 focus-visible:ring-green-500"
                : isCorrect === false
                  ? "border-red-500 focus-visible:ring-red-500"
                  : ""
            }`}
          />
        </div>

        {isCorrect === false && (
          <p className="text-xs text-red-500 text-center">That's not correct. Please try again.</p>
        )}

        {isCorrect === true && (
          <p className="text-xs text-green-500 text-center">Correct! You can now submit the form.</p>
        )}
      </div>
    </div>
  )
}
