//for admins only

import { Card, CardContent } from "@/components/ui/card";

import { FileText } from "lucide-react";
import { UsersRound } from "lucide-react";
import { Info } from "lucide-react";
import { useEffect, useState } from "react";
import { getToken } from "@clerk/react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

function StatItem({ icon: Icon, value, label }) {
    return (
        <div className="flex flex-col items-center ">
            <div className="relative flex items-center justify-center size-[50px] min-w-[50px]">
                <div className="absolute inset-0 rounded-full border-4 border-[#c2d2cf] border-b-transparent"></div>
                <Icon size={26} color="var(--table-titles)" />
            </div>
            <span className="text-xl font-bold">{value}</span>
            <span className="text-s text-(--stats-label) font-semibold">
                {label}
            </span>
        </div>
    );
}

export function NumericalStats() {
    const [docTotal, setDocTotal] = useState(0);
    const [empTotal, setEmpTotal] = useState(0);
    // const [undCount, setUndTotal] = useState(0);
    // const [busCount, setBusTotal] = useState(0);
    // const [busOpCount, setBusOpTotal] = useState(0);
    // const [exOpCount, setExOpTotal] = useState(0);
    // const [acCount, setAcTotal] = useState(0);
    // const [adminCount, setAdminTotal] = useState(0);

    useEffect(() => {
        async function getStats() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/statistics`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await res.json();
            setDocTotal(data.docCount);
            setEmpTotal(data.empCount);
            // setUndTotal(data.underwriterCount);
            // setBusTotal(data.analystCount);
            // setBusOpTotal(data.busOpCount);
            // setExOpTotal(data.exOpCount);
            // setAcTotal(data.acCount);
            // setAdminTotal(data.adminCount);
        }
        getStats();
    }, []);
    return (
        <>
            <Card className="w-max-[500px] h-full ring-0 items-center relative">
                <CardContent className="py-4 px-8 flex flex-row gap-3 items-center h-full">
                    {/* Stats grid */}
                    <div className="flex flex-col gap-7 items center">
                        <StatItem
                            icon={FileText}
                            value={docTotal}
                            label="TOTAL DOCUMENTS"
                        />
                        <StatItem
                            icon={UsersRound}
                            value={empTotal}
                            label="TOTAL EMPLOYEES"
                        />
                    </div>
                </CardContent>

                {/* Popover Icon */}
                <div className="absolute bottom-3 left-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                size="icon"
                                variant="ghost"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                                <Info className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            side="top"
                            align="start"
                            className="w-64"
                        >
                            <p className="font-medium text-sm mb-2">
                                Summary Stats
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                                A snapshot of total documents and employees in
                                the system.
                            </p>
                            <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Total Documents
                                    </span>
                                    <span className="font-medium">
                                        {docTotal}
                                    </span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Total Employees
                                    </span>
                                    <span className="font-medium">
                                        {empTotal}
                                    </span>
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </Card>
        </>
    );
}
