import { useState, useEffect } from "react";



type EmployeeStats = {
    employee: string;
    role: string;
    loginAttempts: number;
};

type SimpleStats = {
    docTotal: number;
    empTotal: number;
}

const MOCK_STATS: EmployeeStats[] = [
    { employee: "Alice Chen", role: "Admin", loginAttempts: 42 },
    { employee: "Ben Torres", role: "Developer", loginAttempts: 31 },
    { employee: "Clara Liu", role: "Analyst", loginAttempts: 18 },
    { employee: "David Park", role: "Manager", loginAttempts: 27 },
];




export default function StatisticsPage() {
    const [docTotal, setDocTotal] = useState(0);
    const [empTotal, setEmpTotal] = useState(0);
    useEffect(() => {
        async function getStats() {
            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/statistics`,

            )
            const data = await res.json();
            setDocTotal(data.docCount);
            setEmpTotal(data.empCount);

        }
        getStats()
    }, []);

    return(
        <>
            <h1> {docTotal}</h1>
            <h1> {empTotal}</h1>
        </>
    )
}


