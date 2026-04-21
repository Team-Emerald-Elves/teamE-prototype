"use client"


import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"

export const description = "A pie chart with stacked sections"

const statusData = [
    { Status: "Not Started", Count: 186, fill: "#C4C4C4FF" },
    { Status: "In Progress", Count: 305, fill: "#f8d785" },
    { Status: "Needs Review", Count: 237, fill: "#f8b364" },
    { Status: "Done", Count: 173, fill: "#6db460" },
    { Status: "Expired", Count: 209, fill: "#da716b" },
]

const docData = [
    { Doc: "Workflow", Count: 80, fill: "#a0cbcb" },
    { Doc: "Reference", Count: 200, fill: "#7db0b6" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    count: {
        label: "Count",
    },
    mobile: {
        label: "Count",
    },
    january: {
        label: "January",
        color: "var(--chart-1)",
    },
    february: {
        label: "February",
        color: "var(--chart-2)",
    },
    march: {
        label: "March",
        color: "var(--chart-3)",
    },
    april: {
        label: "April",
        color: "var(--chart-4)",
    },
    may: {
        label: "May",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

export function ChartPieStacked() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Documents by Status and Type</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                >
                    <PieChart className ="pb-2">
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie data={statusData}
                             dataKey="Count"
                             nameKey="Status"
                             strokeWidth={3}
                             stroke="White"
                             outerRadius={60} />
                        <Pie
                            data={docData}
                            dataKey="Count"
                            nameKey="Doc"
                            strokeWidth={3}
                            stroke="White"
                            innerRadius={70}
                            outerRadius={90}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
