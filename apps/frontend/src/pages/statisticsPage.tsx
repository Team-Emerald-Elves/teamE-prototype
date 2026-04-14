import { useState, useEffect } from "react";

type EmployeeStats = {
    employee: string;
    role: string;
    loginAttempts: number;
};

const MOCK_STATS: EmployeeStats[] = [
    { employee: "Alice Chen", role: "Admin", loginAttempts: 42 },
    { employee: "Ben Torres", role: "Developer", loginAttempts: 31 },
    { employee: "Clara Liu", role: "Analyst", loginAttempts: 18 },
    { employee: "David Park", role: "Manager", loginAttempts: 27 },
];

export default function StatisticsPage() {
    const [stats, setStats] = useState<EmployeeStats[]>([]);

    useEffect(() => {
        setStats(MOCK_STATS);

        //fetch("http://localhost:3000/statistics")
            //.then((res) => res.json())
            //.then((data) => setStats(data));
    }, []);

    return (
        <div>
            <h1>Employee Statistics</h1>
            <table>
                <thead>
                <tr>
                    <th>Employee</th>
                    <th>Role</th>
                    <th>Login Attempts</th>
                </tr>
                </thead>
                <tbody>
                {stats.map((row) => (
                    <tr key={row.employee}>
                        <td>{row.employee}</td>
                        <td>{row.role}</td>
                        <td>{row.loginAttempts}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}