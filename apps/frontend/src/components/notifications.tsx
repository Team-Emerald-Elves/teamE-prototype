import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CircleUserRound, FileText } from "lucide-react"
import {useEffect, useState} from "react";
import {getToken} from "@clerk/react";

//change these stuff as needed
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
// const notifications: Notification[] = [
//     { subject: "Jane Doe",    action: "updated",      item: "doc.png",       time: "1:56PM",  date: "April 6, 2026",  type: "user" },
//     { subject: "John Smith",  action: "created",      item: "report.pdf",    time: "3:20PM",  date: "April 6, 2026",  type: "user" },
//     { subject: "Jane Doe",    action: "deleted",      item: "old.docx",      time: "9:10AM",  date: "April 7, 2026",  type: "user" },
//     { subject: "Luke Emia",   action: "approved",     item: "insurance.pdf", time: "11:39AM", date: "April 7, 2026",  type: "user" },
//     { subject: "John Smith",  action: "commented on", item: "report.pdf",    time: "3:39PM",  date: "April 7, 2026",  type: "user" },
//     { subject: "William D.",  action: "logged in",                           time: "2:20AM",  date: "April 8, 2026",  type: "user" },
//     { subject: "doc.pdf",  action: "expires tomorrow",                           time: "2:20AM",  date: "April 8, 2026",  type: "document" },
// ]


function groupByDate(notifications: Notification[]) {
    return notifications.reduce((groups, n) => {
        const dateKey = new Date(n.createdAt).toISOString().split("T")[0];
        if (!groups[dateKey]) groups[dateKey] = []
        groups[dateKey].push(n)
        return groups
    }, {} as Record<string, Notification[]>)
}

export function NotifScroll() {
    const [notifs, setNotifs] = useState<Notification[]>([]);
    const [grouped, setGrouped] = useState<Record<string,Notification[]>>({});

    useEffect(() => {
        async function getNotifs() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/get-notifications`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (!res.ok) {
                throw new Error("error fetching notifications");
            }
            const data= await res.json();
            console.log(data)
            setNotifs(data);
            const grouped = groupByDate(data)
            setGrouped(grouped);
        }
        getNotifs();
    }, [])

    function formatDateLabel(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
        });
    }

    function formatTimeLabel(dateStr: string) {
        return new Date(dateStr).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
    }

    return (
        <ScrollArea className="h-80 w-90 rounded-md border bg-white shadow-md">
            <div>
                <h4 className="px-3 py-2 text-md font-semibold text-[#12324b]">Notifications</h4>
                {Object.entries(grouped).map(([date, items]) => (
                    <div key={date}>
                        <div className="top-0 z-10 bg-gray-100 px-2 py-2 text-xs font-semibold text-gray-500">
                            {formatDateLabel(date)}
                        </div>
                        {items.map((n, i) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center gap-2 px-2 py-1 rounded-sm">
                                    {n.creatorId
                                        ? <img className="size-8 rounded-full" src={n.profileIcon}/>
                                        : <FileText size={28} strokeWidth={1.5} className="shrink-0 text-gray-400" />
                                    }
                                    <div className="text-xs leading-snug">
                                        {n.creatorId ?
                                                (<>
                                                    <span className="font-semibold text-black">{n.title.split(" ").slice(0, 2).join(" ")}{" "}</span>
                                                    <span className="text-gray-600"> {n.title.split(" ").slice(2, 3).join(" ")}{" "} </span>
                                                    <span className="font-semibold text-[#768b6c]"> {n.title.split(" ").slice(3).join(" ")} </span>
                                                </>)
                                         : (
                                             <>
                                                 <span className="font-semibold text-[#768b6c]"> {n.title.split(" ").slice(0, -3).join(" ")}{" "} </span>
                                                 <span className="text-gray-600"> expiring tomorrow! </span>
                                             </>
                                            )

                                        }

                                        <span className="text-gray-400 whitespace-nowrap">{formatTimeLabel(n.createdAt)}</span>
                                    </div>
                                </div>
                                {i < items.length - 1 && <Separator />}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </ScrollArea>
    )
}