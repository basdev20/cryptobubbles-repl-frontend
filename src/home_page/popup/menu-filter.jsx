import { useState, useContext } from "react";
import { cn } from "@/lib/utils";
import TabsContext from '@/context/tabs';

export default function MenuFilter() {
  const { activeChartFilterTab, setActiveChartFilterTab } = useContext(TabsContext);

  const options = [
    { id: 0, name: "hour", label: "1H" },
    { id: 1, name: "day", label: "1D" },
    { id: 2, name: "week", label: "1W" },
    { id: 3, name: "month", label: "1M" },
    { id: 4, name: "year", label: "1Y" },
  ];

  return (
    <div className="relative flex items-center space-x-2 bg-gray-200/30 rounded-full p-1 w-72">
      {/* Sliding indicator */}
      <div
        className="absolute top-0 bottom-0 w-[20%] bg-white rounded-full transition-all duration-300"
        style={{
          left: `${(activeChartFilterTab.id / options.length) * 100}%`,
        }}
      />
      {options.map((option) => (
        <div
          key={option.id}
          type="button"
          onClick={() => setActiveChartFilterTab(option)}
          className={cn(
            "relative flex-1 z-10 text-sm font-medium cursor-pointer  text-gray-500 transition-colors center",
            activeChartFilterTab.id === option.id ? "text-black font-bold" : "hover:text-gray-700"
          )}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
}
