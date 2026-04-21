"use client"


import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
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
    { Status: "Not Started", Count: 186, fill: "rgb(254, 202, 202)" },
    { Status: "In Progress", Count: 305, fill: "rgb(255, 251, 235)" },
    { Status: "Needs Review", Count: 237, fill: "rgb(254, 243, 199)" },
    { Status: "Done", Count: 173, fill: "rgb(167, 243, 208)" },
    { Status: "Expired", Count: 209, fill: "rgb(254, 202, 202)" },
]

const docData = [
    { Doc: "Workflow", Count: 80, fill: "rgb(191, 219, 254)" },
    { Doc: "Reference", Count: 200, fill: "rgb(254, 215, 170)" },
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
                <CardTitle>Document Information</CardTitle>
                <CardDescription>Status and Type</CardDescription>
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
                        <Pie data={statusData}
                             dataKey="Count"
                             nameKey="Status"
                             outerRadius={60} />
                        <Pie
                            data={docData}
                            dataKey="Count"
                            nameKey="Doc"
                            innerRadius={70}
                            outerRadius={90}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
