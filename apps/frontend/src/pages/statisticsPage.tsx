import { useState, useEffect } from "react";
import { FileText } from 'lucide-react';
import { UsersRound } from 'lucide-react';
import { UserPen } from 'lucide-react';
import { UserLock } from 'lucide-react';
import PageHeader from "../components/page-header.tsx"




export default function StatisticsPage() {
    const [docTotal, setDocTotal] = useState(0);
    const [empTotal, setEmpTotal] = useState(0);
    const [undCount, setUndTotal] = useState(0);
    const [busCount, setBusTotal] = useState(0);
    useEffect(() => {
        async function getStats() {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/statistics`,

            )
            const data = await res.json();
            setDocTotal(data.docCount);
            setEmpTotal(data.empCount);
            setUndTotal(data.underwriterCount);
            setBusTotal(data.analystCount);
        }
        getStats()
    }, []);

    return(
        <>
            <PageHeader title="Reports & Statistics" description="View data on documents and employees."/>
            <div className="flex mt-10 justify-center h-screen">
                <div className="flex flex-col items-center justify-center rounded-xl shadow-sm w-[80%] h-50 bg-white p-6">
                    <div className="flex align-middle items-center justify-between flex-row gap-10">
                        <div className= "flex flex-row items-center">
                            <FileText size={60} color="#013C5A"/>
                            <div className="flex text-left flex-col pl-5">
                                <h1> {docTotal}</h1>
                                <p>Total Documents</p>
                            </div>
                        </div>
                        <div className= "flex flex-row gap-0 items-center">
                            <UsersRound size={60} color="#013C5A"/>
                            <div className="flex text-left flex-col pl-5 gap-1">
                                <h1> {empTotal}</h1>
                                <p>Total Employees</p>
                            </div>
                        </div>
                        <div className= "flex flex-row gap-0 items-center">
                            <UserPen size={60} color="#013C5A"/>
                            <div className="flex text-left flex-col pl-5 gap-1">
                                <h1> {undCount}</h1>
                                <p>Total Underwriters</p>
                            </div>
                        </div>
                        <div className= "flex flex-row gap-0 items-center">
                            <UserLock size={60} color="#013C5A"/>
                            <div className="flex text-left flex-col pl-5 gap-1">
                                <h1> {busCount}</h1>
                                <p>Total Business Analysts</p>
                            </div>
                        </div>


                    </div>
                </div>
            </div>

        </>
    )
}

