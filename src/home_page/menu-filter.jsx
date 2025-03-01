import { useState } from "react"
import { cn } from "@/lib/utils"

export default function SmallRadioSelector() {
  const [selectedOption, setSelectedOption] = useState("option1")

  const options = [
    { id: "option1", label: "Hour", percentage: "25%" },
    { id: "option2", label: "Day", percentage: "50%" },
    { id: "option3", label: "Week", percentage: "75%" },
    { id: "option4", label: "Month", percentage: "100%" },
    { id: "option5", label: "Year", percentage: "100%" },
  ]

  return (
    <div className="flex items-center space-x-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setSelectedOption(option.id)}
          className={cn(
            "relative size-20 flex flex-col items-center justify-center rounded-md text-xs border border-blue-600 cursor-pointer",
            selectedOption === option.id ? "border-blue-700 bg-blue-600/10" : "border-border hover:border-primary/50",
          )}
        >
          <span className="font-medium md:text-lg text-[11px] leading-none">{option.label}</span>
          <span className="text-[10px] mt-1 text-muted-foreground">{option.percentage}</span>
          <input
            type="radio"
            name="radio-group"
            id={option.id}
            value={option.id}
            checked={selectedOption === option.id}
            onChange={() => setSelectedOption(option.id)}
            className="sr-only"
          />
        </button>
      ))}
    </div>
  )
}

