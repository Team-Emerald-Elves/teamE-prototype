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
    { role: "Underwriters:", employees: 275, fill: "rgb(118,139,108)" },
    { role: "Business Analyst:", employees: 200, fill: "rgb(231,166,102)" },
    { role: "Actuarial Analyst:", employees: 187, fill: "rgb(194,210,207)" },
    { role: "EXL Operations:", employees: 173, fill: "rgb(41,103,55)" },
    { role: "Business Ops Rating Teams:", employees: 90, fill: "rgb(172,122,69)" },
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
                <CardTitle>Employees At Hanover</CardTitle>
                <CardDescription>An overview of employee breakdown by role.</CardDescription>
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
                            outerRadius={90}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>

        </Card>
    )
}
