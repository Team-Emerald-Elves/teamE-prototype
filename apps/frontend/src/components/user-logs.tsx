import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/log-table.tsx"

import { CircleUserRound, Dot} from 'lucide-react';



import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


type ActivityLog = {
    user: string
    avatar: React.ReactNode
    time: string
    action: string
    item?: string
    date: string
}

const activity: ActivityLog[] = [
    { user: "Jane Doe",   time: "1:56PM", action: "updated", item: "doc.png",    date: "April 6, 2026" },
    { user: "John Smith", time: "3:20PM", action: "created", item: "report.pdf", date: "April 6, 2026" },
    { user: "Jane Doe",   time: "9:10AM", action: "deleted", item: "old.docx",   date: "April 7, 2026" },
    { user: "Luke Emia",   time: "11:39AM", action: "approved", item: "insurancethings.pdf",   date: "April 7, 2026" },
    { user: "John Smith", time: "3:39PM", action: "commented on", item: "report.pdf", date: "April 7, 2026" },
    { user: "William Dingleberry",   time: "2:20AM", action: "logged in", date: "April 7, 2026" },
]

function groupByDate(logs: ActivityLog[]) {
    return logs.reduce((groups, log) => {
        if (!groups[log.date]) groups[log.date] = []
        groups[log.date].push(log)
        return groups
    }, {} as Record<string, ActivityLog[]>)
}


export function UserLogs(){
    const grouped = groupByDate(activity)
    return (
        <>
            <Card className= "w-[40%] h-full">
                <CardHeader className="flex items-center gap-2 space-y-0 border-b py-2 sm:flex-row bg-white">
                    <div className="grid flex-1 gap-1">
                        <CardTitle className="text-lg text-[#12324b]">User Activity</CardTitle>
                        <CardDescription>
                            Track actions performed by users, including creations, edits, logins, and more.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {Object.entries(grouped).map(([date, logs]) => (
                        <div key={date}>
                            <p className="text-center text-xs font-semibold text-gray-500 py-1">
                                {date}
                            </p>
                            <Table>
                                <TableBody>
                                    {logs.map((log, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="font-medium flex align-middle items-center text-sm">
                                                <div className="flex gap-1 items-center font-normal">
                                                    {log.avatar ?? <CircleUserRound size={40} strokeWidth={1.5} />}
                                                    <div className="pl-5 font-semibold">{log.user}</div>
                                                    <span>{log.action}</span>
                                                    <span className="text-[#768b6c] font-semibold">{log.item}</span>
                                                    <div className="flex items-center">
                                                        <div className="px-2"><Dot color="#a6a6a6" /></div>
                                                        {log.time}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                </CardContent>

            </Card>
        </>
    )
}