import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/log-table.tsx"

import { CircleUserRound, Dot, FileText, Info } from 'lucide-react';



import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

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
            <Card className= "w-[40%] h-full relative">
                <CardHeader className="flex items-center gap-2 space-y-0 border-0 py-2 sm:flex-row bg-white">
                    <div className="grid flex-1 gap-1">
                        <CardTitle className="text-2xl text-[#12324b]">User Activity</CardTitle>
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

                {/* Popup Info */}
                <div className="absolute bottom-3 left-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                <Info className="h-4 w-4" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent side="top" align="start" className="w-64">
                            <p className="font-medium text-sm mb-2">User Activity</p>
                            <p className="text-xs text-muted-foreground mb-3">
                                A real-time log of all recent actions performed by users in the system.
                            </p>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Actions tracked</p>
                                {["Created", "Updated", "Deleted", "Approved", "Commented on", "Logged in"].map((action) => (
                                    <div key={action} className="text-xs text-muted-foreground">
                                        {action}
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>

            </Card>
        </>
    )
}