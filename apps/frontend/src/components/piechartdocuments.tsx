"use client";

import { Pie, PieChart } from "recharts";
import { Info } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { getToken } from "@clerk/react";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

export const description = "A pie chart with stacked sections";

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
} satisfies ChartConfig;

export function ChartPieStacked() {
    const [statusData, setStatusData] = useState([
        { Status: "Not Started", Count: 0, fill: "#C4C4C4FF" },
        { Status: "In Progress", Count: 0, fill: "#f8d785" },
        { Status: "Needs Review", Count: 0, fill: "#f8b364" },
        { Status: "Done", Count: 0, fill: "#6db460" },
        { Status: "Expired", Count: 0, fill: "#da716b" },
    ]);

    const [docData, setDocData] = useState([
        { Doc: "Workflow", Count: 0, fill: "#a0cbcb" },
        { Doc: "Reference", Count: 0, fill: "#7db0b6" },
    ]);

    useEffect(() => {
        async function getStats() {
            try {
                const token = await getToken();

                const res = await fetch(
                    `${import.meta.env.VITE_BACKEND_URL}/statistics`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                );

                if (!res.ok) {
                    throw new Error("Error fetching statistics.");
                }

                const data = await res.json();
                console.log(data);

                setStatusData([
                    {
                        Status: "Not Started",
                        Count: data.statusCounts.not_started,
                        fill: "#C4C4C4FF",
                    },
                    {
                        Status: "In Progress",
                        Count: data.statusCounts.in_progress,
                        fill: "#f8d785",
                    },
                    {
                        Status: "Needs Review",
                        Count: data.statusCounts.needs_review,
                        fill: "#f8b364",
                    },
                    {
                        Status: "Done",
                        Count: data.statusCounts.done,
                        fill: "#6db460",
                    },
                    {
                        Status: "Expired",
                        Count: data.statusCounts.expired,
                        fill: "#da716b",
                    },
                ]);

                setDocData([
                    {
                        Doc: "Workflow",
                        Count: data.typeCounts.workflow,
                        fill: "#a0cbcb",
                    },
                    {
                        Doc: "Reference",
                        Count: data.typeCounts.reference,
                        fill: "#7db0b6",
                    },
                ]);
            } catch (err) {
                console.error("Failed to fetch stats:", err);
            }
        }

        getStats();
    }, []);

    return (
        <Card className="flex flex-col h-full relative ring-0 py-0">
            <CardHeader className="items-center pb-0">
                <CardTitle>Documents by Status and Type</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex items-center justify-center pb-0">
                <ChartContainer config={chartConfig} className="w-full h-50">
                    <PieChart className="pb-2">
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={statusData}
                            dataKey="Count"
                            nameKey="Status"
                            strokeWidth={2}
                            stroke="none"
                            outerRadius={60}
                        />
                        <Pie
                            data={docData}
                            dataKey="Count"
                            nameKey="Doc"
                            strokeWidth={2}
                            stroke="none"
                            innerRadius={70}
                            outerRadius={90}
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>

            {/* info popover */}
            <div className="absolute bottom-3 left-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            style={{
                                backgroundColor: 'var(--icon-bg)',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--icon-hover)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--icon-bg)'}
                        >
                            <Info className="h-4 w-4" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="start" className="w-64">
                        <p className="font-medium text-sm mb-2">
                            Documents by Status and Type
                        </p>
                        <p className="text-xs text-muted-foreground mb-3">
                            Distribution of all documents grouped by status and
                            type.
                        </p>
                        <div className="space-y-1">
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                Status
                            </p>
                            {statusData.map((s) => (
                                <div
                                    key={s.Status}
                                    className="flex justify-between text-xs"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="inline-block w-2 h-2 rounded-full"
                                            style={{ background: s.fill }}
                                        />
                                        {s.Status}
                                    </span>
                                    <span className="font-medium">
                                        {s.Count}
                                    </span>
                                </div>
                            ))}
                            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mt-2 mb-1">
                                Type
                            </p>
                            {docData.map((d) => (
                                <div
                                    key={d.Doc}
                                    className="flex justify-between text-xs"
                                >
                                    <span className="flex items-center gap-1.5">
                                        <span
                                            className="inline-block w-2 h-2 rounded-full"
                                            style={{ background: d.fill }}
                                        />
                                        {d.Doc}
                                    </span>
                                    <span className="font-medium">
                                        {d.Count}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </PopoverContent>
                </Popover>
            </div>
        </Card>
    );
}
