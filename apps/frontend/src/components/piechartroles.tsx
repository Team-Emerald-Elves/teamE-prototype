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

export const description = "A pie chart with no separator"

const chartData = [
    { role: "Underwriters:", employees: 275, fill: "#d2eafc"},
    { role: "Business Analyst:", employees: 200, fill: "#b4dcfa" },
    { role: "Actuarial Analyst:", employees: 187, fill: "#96cdf7" },
    { role: "EXL Operations:", employees: 173, fill: "#87c6f6" },
    { role: "Business Ops Rating Teams:", employees: 90, fill: "#69b8f4" },
]

const chartConfig = {
    visitors: {
        label: "Visitors",
    },
    chrome: {
        label: "Chrome",
        color: "var(--chart-1)",
    },
    safari: {
        label: "Safari",
        color: "var(--chart-2)",
    },
    firefox: {
        label: "Firefox",
        color: "var(--chart-3)",
    },
    edge: {
        label: "Edge",
        color: "var(--chart-4)",
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

export function ChartPieSeparatorNone() {
    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Employees by Role</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                >
                    <PieChart className ="pb-5">
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="employees"
                            nameKey="role"
                            strokeWidth={3}
                            stroke="White"
                            outerRadius={90}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}
