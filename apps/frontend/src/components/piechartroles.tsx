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
import {useEffect, useState} from "react";
import {getToken} from "@clerk/react";

export const description = "A pie chart with no separator"


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
    const [chartData, setChartData] = useState([
        { role: "Underwriters:", employees: 0, fill: "#d2eafc"},
        { role: "Business Analyst:", employees: 0, fill: "#b4dcfa" },
        { role: "Actuarial Analyst:", employees: 0, fill: "#96cdf7" },
        { role: "EXL Operations:", employees: 0, fill: "#87c6f6" },
        { role: "Business Ops Rating Teams:", employees: 0, fill: "#69b8f4" },
    ]);

    useEffect(() => {
        async function getStats() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/statistics`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            const data = await res.json();
            setChartData([
                { role: "Underwriters", employees: data.underwriterCount, fill: "#d2eafc" },
                { role: "Business Analyst", employees: data.analystCount, fill: "#b4dcfa" },
                { role: "Actuarial Analyst", employees: data.acCount, fill: "#96cdf7" },
                { role: "EXL Operations", employees: data.exOpCount, fill: "#87c6f6" },
                { role: "Business Ops Rating Teams", employees: data.busOpCount, fill: "#69b8f4" },
                { role: "Admin", employees: data.adminCount, fill: "#4aa3f0" },
            ]);

        }
        getStats()
    }, []);

    return (
        <Card className="flex flex-col h-full">
            <CardHeader className="items-center pb-0">
                <CardTitle>Employees by Role</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="w-full h-50"
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
