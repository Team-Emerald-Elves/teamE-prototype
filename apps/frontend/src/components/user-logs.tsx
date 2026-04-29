import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/log-table.tsx"

import {Dot} from 'lucide-react';

import { ScrollArea } from "@/components/ui/scroll-area"


import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {useEffect, useState} from "react";
import {getToken} from "@clerk/react";


type Notification = {
    createdAt: string
    creatorId?: string
    employeeId?: string
    id: string
    public: boolean
    targetRoles: string[]
    title: string
    profileIcon?: string
}

// const activity: ActivityLog[] = [
//     { user: "Jane Doe",   time: "1:56PM", action: "updated", item: "doc.png",    date: "April 6, 2026" },
//     { user: "John Smith", time: "3:20PM", action: "created", item: "report.pdf", date: "April 6, 2026" },
//     { user: "Jane Doe",   time: "9:10AM", action: "deleted", item: "old.docx",   date: "April 7, 2026" },
//     { user: "Luke Emia",   time: "11:39AM", action: "approved", item: "insurancethings.pdf",   date: "April 7, 2026" },
//     { user: "John Smith", time: "3:39PM", action: "commented on", item: "report.pdf", date: "April 7, 2026" },
//     { user: "William Dingleberry",   time: "2:20AM", action: "logged in", date: "April 7, 2026" },
// ]

function groupByDate(notifications: Notification[]) {
    return notifications.reduce((groups, n) => {
        if (!n.creatorId) return groups;

        const key = new Date(n.createdAt).toLocaleDateString("en-US");
        if (!groups[key]) groups[key] = []
        groups[key].push(n)
        return groups
    }, {} as Record<string, Notification[]>)
}

function formatDateLabel(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

function formatTimeLabel(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    })
}


export function UserLogs(){
    const [grouped, setGrouped] = useState<Record<string, Notification[]>>({})

    useEffect(() => {
        async function fetchNotifs() {
            const token = await getToken()

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notifs/get-notifications`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const data: Notification[] = await res.json()
            setGrouped(groupByDate(data))
        }

        fetchNotifs()
    }, [])
    return (
        <>
            <Card className= "w-[40%] flex flex-col">
                <CardHeader className="flex items-center gap-2 space-y-0 border-0 py-2 sm:flex-row bg-(--card)">
                    <div className="grid flex-1 gap-1">
                        <CardTitle className="text-2xl text-(--card-title)">User Activity</CardTitle>
                        <CardDescription className="text-(--foreground)">
                            Track recent actions performed by users, including creations, edits, logins, and more.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden flex-1 min-h-0">
                    <ScrollArea className="h-full">
                    {Object.entries(grouped).map(([date, logs]) => (
                        <div key={date}>
                            <p className="text-center text-xs font-semibold text-gray-500 py-1">
                                {formatDateLabel(date)}
                            </p>
                            <Table>
                                <TableBody>
                                    {logs.map((n) => (
                                        <TableRow key={n.id}>
                                            <TableCell className="font-medium flex items-center text-sm">
                                                <div className="flex gap-1 items-center font-normal">
                                                  <img className="size-10 rounded-full" src={n.profileIcon}/>

                                                    <div className="pl-5 font-semibold">{n.title.split(" ").slice(0, 2).join(" ")}{" "}</div>
                                                    <span > {n.title.split(" ").slice(2, 3).join(" ")}{" "} </span>
                                                    <span className="text-[#768b6c] font-semibold"> {n.title.split(" ").slice(3).join(" ")} </span>


                                                    <div className="flex items-center">
                                                        <div className="px-2"><Dot color="#a6a6a6" /></div>
                                                        {formatTimeLabel(n.createdAt)}
                                                    </div>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ))}
                    </ScrollArea>
                </CardContent>
            </Card>
        </>
    )
}
