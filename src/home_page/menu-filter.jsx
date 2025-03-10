import { useState, useContext } from "react"
import { cn } from "@/lib/utils"
import TabsContext from '@/context/tabs';


export default function SmallRadioSelector() {
  const { activeChartFilterTab, setActiveChartFilterTab } = useContext(TabsContext);

  const options = [
    { id: 0, name: "hour", label: "Hour", percentage: "0%" },
    { id: 1, name: "day", label: "Day", percentage: "25%" },
    { id: 2, name: "week", label: "Week", percentage: "50%" },
    { id: 3, name: "month", label: "Month", percentage: "75%" },
    { id: 4, name: "year", label: "Year", percentage: "100%" },
  ]

  return (
    <div className="flex items-center space-x-2">
      {options.map((option) => (
        <button
          key={option.id}
          type="button"
          onClick={() => setActiveChartFilterTab(option)}
          className={cn(
            "relative size-20 flex flex-col items-center justify-center rounded-md text-xs border border-blue-600 cursor-pointer",
            activeChartFilterTab.id === option.id ? "border-blue-700 bg-blue-600/10" : "border-border hover:border-primary/50",
          )}
        >
          <span className="font-medium md:text-lg text-[11px] leading-none">{option.label}</span>
          <span className="text-[10px] mt-1 text-muted-foreground">{option.percentage}</span>
          <input
            type="radio"
            name="radio-group"
            id={option.id}
            value={option.id}
            checked={activeChartFilterTab.id === option.id}
            onChange={() => setActiveChartFilterTab(option)}
            className="sr-only"
          />
        </button>
      ))}
    </div>
  )
}

