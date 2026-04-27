import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { CircleUserRound, FileText } from "lucide-react"

//change these stuff as needed
type Notification = {
    subject?: string //user or document name
    action: string
    item?: string
    time: string
    date: string
    type: "user" | "document"
    read?: boolean
}

const notifications: Notification[] = [
    { subject: "Jane Doe",    action: "updated",      item: "doc.png",       time: "1:56PM",  date: "April 6, 2026",  type: "user" },
    { subject: "John Smith",  action: "created",      item: "report.pdf",    time: "3:20PM",  date: "April 6, 2026",  type: "user" },
    { subject: "Jane Doe",    action: "deleted",      item: "old.docx",      time: "9:10AM",  date: "April 7, 2026",  type: "user" },
    { subject: "Luke Emia",   action: "approved",     item: "insurance.pdf", time: "11:39AM", date: "April 7, 2026",  type: "user" },
    { subject: "John Smith",  action: "commented on", item: "report.pdf",    time: "3:39PM",  date: "April 7, 2026",  type: "user" },
    { subject: "William D.",  action: "logged in",                           time: "2:20AM",  date: "April 8, 2026",  type: "user" },
    { subject: "doc.pdf",  action: "expires tomorrow",                           time: "2:20AM",  date: "April 8, 2026",  type: "document" },
]

function groupByDate(notifications: Notification[]) {
    return notifications.reduce((groups, n) => {
        if (!groups[n.date]) groups[n.date] = []
        groups[n.date].push(n)
        return groups
    }, {} as Record<string, Notification[]>)
}

export function NotifScroll() {
    const grouped = groupByDate(notifications)
    return (
        <ScrollArea className="h-80 w-90 rounded-md border bg-white shadow-md">
            <div>
                <h4 className="px-3 py-2 text-md font-semibold text-[#12324b]">Notifications</h4>
                {Object.entries(grouped).map(([date, items]) => (
                    <div key={date}>
                        <div className="top-0 z-10 bg-gray-100 px-2 py-2 text-xs font-semibold text-gray-500">
                            {date}
                        </div>
                        {items.map((n, i) => (
                            <React.Fragment key={i}>
                                <div className="flex items-center gap-2 px-2 py-1 rounded-sm">
                                    {n.type === "document"
                                        ? <FileText size={28} strokeWidth={1.5} className="shrink-0 text-gray-400" />
                                        : <CircleUserRound size={28} strokeWidth={1.5} className="shrink-0 text-gray-400" />
                                    }
                                    <div className="text-xs leading-snug">
                                        <span className="font-semibold text-black">{n.subject} </span>
                                        <span className="text-gray-600">{n.action} </span>
                                        {n.item && <span className="font-semibold text-[#768b6c]">{n.item} </span>}
                                        <span className="text-gray-400 whitespace-nowrap mx-2">·</span>
                                        <span className="text-gray-400 whitespace-nowrap">{n.time}</span>
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