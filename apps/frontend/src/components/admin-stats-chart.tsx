//for admins only

"use client";

import { Pie, PieChart } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart";

export const description = "A pie chart with a legend";

const chartData = [
    { browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
    { browser: "safari", visitors: 200, fill: "var(--color-safari)" },
    { browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
    { browser: "edge", visitors: 173, fill: "var(--color-edge)" },
    { browser: "other", visitors: 90, fill: "var(--color-other)" },
];

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
} satisfies ChartConfig;

export function ChartPieLegend() {
    return (
        <Card className="flex flex-col w-[75%]">
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-[350px]"
                >
                    <PieChart>
                        <Pie data={chartData} dataKey="visitors" />
                        <ChartLegend
                            layout="vertical"
                            align="right"
                            verticalAlign="middle"
                            content={
                                <ChartLegendContent
                                    nameKey="browser"
                                    className="flex flex-col items-start gap-2 text-base [&>*]:text-base"
                                />
                            }
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}
