import * as React from "react";
import { Filter, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const timeRanges = [
  { value: "day", label: "Day" },
  { value: "week", label: "Week" },
  { value: "month", label: "Month" },
  { value: "year", label: "Year" },
];

export function FloatingTimeSelect() {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState("week");

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[100px] justify-between shadow-md"
          >
            <Filter className="mr-2 h-4 w-4" />
            {timeRanges.find((t) => t.value === value)?.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100px] p-0">
          {timeRanges.map((timeRange) => (
            <div
              key={timeRange.value}
              className="flex items-center cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                setValue(timeRange.value);
                setOpen(false);
              }}
            >
              {timeRange.label}
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  value === timeRange.value ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
