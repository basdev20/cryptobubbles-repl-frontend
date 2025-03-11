import * as React from "react";
import { useContext } from "react";
import { Filter, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TabsContext from '@/context/tabs';

const timeRanges = [
  { id: 0, label: "Day", name: "minute" },
  { id: 1, label: "Week", name: "day" },
  { id: 2, label: "Month", name: "week" },
  { id: 3, label: "Year", name: "month" },
];

export function FloatingTimeSelect() {
  const { activeFilterTab, setActiveFilterTab } = useContext(TabsContext);
  const [open, setOpen] = React.useState(false);

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
            {timeRanges.find((t) => t.name === activeFilterTab.name)?.label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[100px] p-0">
          {timeRanges.map((timeRange) => (
            <div
              key={timeRange.id}
              className="flex items-center cursor-pointer px-3 py-2 hover:bg-gray-100"
              onClick={() => {
                setActiveFilterTab(timeRange);
                setOpen(false);
              }}
            >
              {timeRange.label}
              <Check
                className={cn(
                  "ml-auto h-4 w-4",
                  activeFilterTab.name === timeRange.name ? "opacity-100" : "opacity-0"
                )}
              />
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
