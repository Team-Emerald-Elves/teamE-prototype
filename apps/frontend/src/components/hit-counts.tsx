"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "An interactive area chart"

const chartData = [
    { date: "2024-04-01", documents: 120, reference: 85, workflow: 40 },
    { date: "2024-04-08", documents: 198, reference: 102, workflow: 67 },
    { date: "2024-04-15", documents: 145, reference: 90, workflow: 55 },
    { date: "2024-04-22", documents: 230, reference: 130, workflow: 80 },
    { date: "2024-04-29", documents: 175, reference: 110, workflow: 92 },
    { date: "2024-05-06", documents: 260, reference: 145, workflow: 73 },
    { date: "2024-05-13", documents: 190, reference: 98, workflow: 61 },
    { date: "2024-05-20", documents: 310, reference: 160, workflow: 105 },
    { date: "2024-05-27", documents: 275, reference: 140, workflow: 88 },
    { date: "2024-06-03", documents: 220, reference: 125, workflow: 70 },
    { date: "2024-06-10", documents: 340, reference: 175, workflow: 120 },
    { date: "2024-06-17", documents: 295, reference: 155, workflow: 99 },
    { date: "2024-06-24", documents: 380, reference: 200, workflow: 135 },
]

const chartConfig = {
    documents: {
        label: "Documents",
        color: "#768b6c",
    },
    reference: {
        label: "Reference",
        color: "#e7a666",
    },
    workflow: {
        label: "Workflow",
        color: "#c2d2cf",
    },
} satisfies ChartConfig

export function HitCounts() {
    const [timeRange, setTimeRange] = React.useState("90d")

    const filteredData = chartData.filter((item) => {
        const date = new Date(item.date)
        const referenceDate = new Date("2024-06-30")
        let daysToSubtract = 90
        if (timeRange === "30d") {
            daysToSubtract = 30
        } else if (timeRange === "7d") {
            daysToSubtract = 7
        }
        const startDate = new Date(referenceDate)
        startDate.setDate(startDate.getDate() - daysToSubtract)
        return date >= startDate
    })

    return (
        <Card className="pt-0 w-[60%] h-full">
            <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                <div className="grid flex-1 gap-1">
                    <CardTitle className = "text-lg text-[#12324b]">Document Hit Counts</CardTitle>
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
            <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
                <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[400px] w-full"
                >
                    <AreaChart data={filteredData}>
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
                        <Area dataKey="documents" type="natural" fill="url(#fillDocuments)" stroke="var(--color-documents)" stackId="a" />
                        <Area dataKey="reference"  type="natural" fill="url(#fillReference)"  stroke="var(--color-reference)"  stackId="a" />
                        <Area dataKey="workflow"   type="natural" fill="url(#fillWorkflow)"   stroke="var(--color-workflow)"   stackId="a" />
                        <ChartLegend content={<ChartLegendContent />} />
                    </AreaChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
