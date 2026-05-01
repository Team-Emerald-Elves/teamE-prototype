"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { Info } from "lucide-react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

// const chartData = [
//     { date: "2024-04-01", documents: 120, reference: 85, workflow: 40 },
//     { date: "2024-04-08", documents: 198, reference: 102, workflow: 67 },
//     { date: "2024-04-15", documents: 145, reference: 90, workflow: 55 },
//     { date: "2024-04-22", documents: 230, reference: 130, workflow: 80 },
//     { date: "2024-04-29", documents: 175, reference: 110, workflow: 92 },
//     { date: "2024-05-06", documents: 260, reference: 145, workflow: 73 },
//     { date: "2024-05-13", documents: 190, reference: 98, workflow: 61 },
//     { date: "2024-05-20", documents: 310, reference: 160, workflow: 105 },
//     { date: "2024-05-27", documents: 275, reference: 140, workflow: 88 },
//     { date: "2024-06-03", documents: 220, reference: 125, workflow: 70 },
//     { date: "2024-06-10", documents: 340, reference: 175, workflow: 120 },
//     { date: "2024-06-17", documents: 295, reference: 155, workflow: 99 },
//     { date: "2024-06-24", documents: 380, reference: 200, workflow: 135 },
// ]

const chartConfig = {
    documents: {
        label: "Documents",
        color: "#768b6c",
    },
    links: {
        label: "Links",
        color: "#4f7cac",
    },
    reference: {
        label: "Reference",
        color: "#e7a666",
    },
    workflow: {
        label: "Workflow",
        color: "#c2d2cf",
    },
} satisfies ChartConfig;

export function HitCounts() {
    const [timeRange, setTimeRange] = React.useState("90d")
     const [chartData, setChartData] = React.useState<any[]>([]);
    //
    // const filteredData = chartData.filter((item) => {
    //     const date = new Date(item.date)
    //     const referenceDate = new Date("2024-06-30")
    //     let daysToSubtract = 90
    //     if (timeRange === "30d") {
    //         daysToSubtract = 30
    //     } else if (timeRange === "7d") {
    //         daysToSubtract = 7
    //     }
    //     const startDate = new Date(referenceDate)
    //     startDate.setDate(startDate.getDate() - daysToSubtract)
    //     return date >= startDate
    // })

    React.useEffect(() => {
        async function fetchData() {

            let daysToSubtract = 90;
            if (timeRange === "30d") daysToSubtract = 30;
            if (timeRange === "7d") daysToSubtract = 7;

            const end = new Date();
            const start = new Date();
            start.setDate(start.getDate() - daysToSubtract-1);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/get-hit-counts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    start,
                    end,
                }),
            });

            const data = await res.json();

            setChartData(data);
        }

        fetchData();
    }, [timeRange]);

    return (
        <Card className="pt-0 h-full flex flex-col relative ring-0">
            <CardHeader className="flex items-center gap-2 space-y-0 border-0 py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle className = "text-2xl text-[#12324b]">Document Hit Counts</CardTitle>
                    <CardDescription>
                        An overview of document hit counts over the selected time.
                    </CardDescription>
                </div>
                <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger
                        className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                        aria-label="Select a value"
                    >
                        <SelectValue placeholder="Last 3 months" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                        <SelectItem value="90d" className="rounded-lg">
                            Last 3 months
                        </SelectItem>
                        <SelectItem value="30d" className="rounded-lg">
                            Last 30 days
                        </SelectItem>
                        <SelectItem value="7d" className="rounded-lg">
                            Last 7 days
                        </SelectItem>
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 sm:px-6 sm:pt-6 shrink-0">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-full w-full"
                >
                    <AreaChart data={chartData}>
                        <defs>
                            <linearGradient id="fillDocuments" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="var(--color-documents)" stopOpacity={0.9} />
                                <stop offset="95%" stopColor="var(--color-documents)" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="fillReference" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="var(--color-reference)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-reference)" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="fillWorkflow" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="var(--color-workflow)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-workflow)" stopOpacity={0.4} />
                            </linearGradient>
                            <linearGradient id="fillLinks" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="var(--color-links)" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="var(--color-links)" stopOpacity={0.4} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="date"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            minTickGap={32}
                            tickFormatter={(value) => {
                                const date = new Date(value)
                                return date.toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                })
                            }}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={
                                <ChartTooltipContent
                                    labelFormatter={(value) => {
                                        return new Date(value).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                        })
                                    }}
                                    indicator="dot"
                                />
                            }
                        />

                        <Area dataKey="reference"  type="natural" fill="url(#fillReference)"  stroke="var(--color-reference)"  stackId="a" />
                        <Area dataKey="workflow"   type="natural" fill="url(#fillWorkflow)"   stroke="var(--color-workflow)"   stackId="a" />
                        <Area dataKey="documents" type="natural" fill="url(#fillDocuments)" stroke="var(--color-documents)" stackId="a" />
                        <Area
                            dataKey="links"
                            type="natural"
                            fill="url(#fillLinks)"
                            stroke="var(--color-links)"
                        />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>

            {/* info popover */}
            <div className="absolute bottom-3 left-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                            <Info className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="w-64">
                        <p className="font-medium text-sm mb-2">Document Hit Counts</p>
                        <p className="text-xs text-muted-foreground mb-3">
                            An overview of document hit counts over the selected time period.
                        </p>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Series</p>
                            {Object.entries(chartConfig).map(([key, value]) => (
                                <div key={key} className="flex justify-between text-xs">
                                    <span className="flex items-center gap-1.5">
                                        <span className="inline-block w-2 h-2 rounded-full" style={{ background: value.color }} />
                                        {value.label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </Card>
    )
}
