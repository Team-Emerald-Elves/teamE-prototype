"use client"


import { Pie, PieChart } from "recharts"


import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
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
    { role: "Underwriters:", employees: 275, fill: "rgb(147, 197, 253)" },
    { role: "Business Analyst:", employees: 200, fill: "rgb(253, 186, 116)" },
    { role: "Actuarial Analyst:", employees: 187, fill: "rgb(191, 219, 254)" },
    { role: "EXL Operations:", employees: 173, fill: "rgb(254, 215, 170)" },
    { role: "Business Ops Rating Teams:", employees: 90, fill: "rgb(209, 213, 219)" },
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
                <CardTitle>Employee Breakdown by Role</CardTitle>
                <CardDescription>Employee Breakdown by Role</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-full"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="employees"
                            nameKey="role"
                            stroke="none"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}
