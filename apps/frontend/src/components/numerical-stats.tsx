//for admins only

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from "@/components/ui/card"

import { FileText } from 'lucide-react';
import { UsersRound } from 'lucide-react';
import { UserPen } from 'lucide-react';
import { UserLock } from 'lucide-react';
import { UserSearch } from 'lucide-react';
import { UserCog } from 'lucide-react';
import { UserPlus } from 'lucide-react';
import {useEffect, useState} from "react";
import {getToken} from "@clerk/react";



function StatItem({ icon: Icon, value, label }) {
    return (
        <div className="flex flex-col items-center ">
            <div className="relative flex items-center justify-center size-[50px] min-w-[50px]">
                <div className="absolute inset-0 rounded-full border-4 border-[#c2d2cf] border-b-transparent"></div>
                <Icon size={26} color="#013C5A"/>
            </div>
                <span className="text-xl font-bold">{value}</span>
                <span className="text-s text-gray-500 font-semibold">{label}</span>
        </div>
    )
}

export function NumericalStats() {
    const [docTotal, setDocTotal] = useState(0);
    const [empTotal, setEmpTotal] = useState(0);
    const [undCount, setUndTotal] = useState(0);
    const [busCount, setBusTotal] = useState(0);
    const [busOpCount, setBusOpTotal] = useState(0);
    const [exOpCount, setExOpTotal] = useState(0);
    const [acCount, setAcTotal] = useState(0);
    const [adminCount, setAdminTotal] = useState(0);

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
            setDocTotal(data.docCount);
            setEmpTotal(data.empCount);
            setUndTotal(data.underwriterCount);
            setBusTotal(data.analystCount);
            setBusOpTotal(data.busOpCount);
            setExOpTotal(data.exOpCount);
            setAcTotal(data.acCount);
            setAdminTotal(data.adminCount);

        }
        getStats()
    }, []);
    return (
        <>
            <Card className="w-max-[500px] h-full mb-5 items-center">
                <CardContent className="py-4 px-8 flex flex-row gap-3 items-center h-full">
                    {/* Stats grid */}
                    <div className="flex flex-col gap-7 items center">
                        <StatItem icon={FileText} value={docTotal} label="TOTAL DOCUMENTS" />
                        <StatItem icon={UsersRound} value={empTotal} label="TOTAL EMPLOYEES" />
                    </div>
                </CardContent>
            </Card>
        </>

)


}