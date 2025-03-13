import { ArrowUp, ArrowDown } from "lucide-react"
import { cn } from "@/lib/utils"



export default function MatrixDisplay() {

    const data = {
        rank: 68,
        rankChange: 10,
        marketCap: 1.2e9, // 1.20B
        volume24h: 20.9e6, // 20.90M
    }

    const formatCurrency = (value) => {
        if (value >= 1e9) {
            return `$${(value / 1e9).toFixed(2)}B`
        } else if (value >= 1e6) {
            return `$${(value / 1e6).toFixed(2)}M`
        }
        return `$${value.toFixed(2)}`
    }

    return (
        <div className=" text-zinc-900 rounded-lg md:p-4 p-0 w-full max-w-2xl">
            <div className="grid grid-cols-3 gap-8">
                <div className="space-y-1">
                    <div className="md:text-sm text-[11px]  text-zinc-400">Rank</div>
                    <div className="flex items-center gap-2 md:text-2xl text-sm font-medium">
                        {data.rank}
                        <span className={cn("flex items-center text-sm", data.rankChange > 0 ? "text-green-500" : "text-red-500")}>
                            {data.rankChange > 0 ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                            {Math.abs(data.rankChange)}
                        </span>
                    </div>
                </div>

                <div className="space-y-1">
                    <div className="md:text-sm text-[11px]  text-zinc-400">Market Cap</div>
                    <div className="md:text-2xl text-sm font-medium">{formatCurrency(data.marketCap)}</div>
                </div>

                <div className="space-y-1">
                    <div className="md:text-sm text-[11px]  text-zinc-400">24h Volume</div>
                    <div className="md:text-2xl text-sm font-medium">{formatCurrency(data.volume24h)}</div>
                </div>
            </div>
        </div>
    )
}

