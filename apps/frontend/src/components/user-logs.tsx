import {
    Table,
    TableBody,
    TableCell,
    TableRow,
} from "@/components/ui/log-table.tsx";

import { Info } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { useEffect, useState } from "react";
import { getToken } from "@clerk/react";

import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

type Notification = {
    createdAt: string;
    creatorId?: string;
    employeeId?: string;
    id: string;
    public: boolean;
    targetRoles: string[];
    title: string;
    profileIcon?: string;
};

// const activity: ActivityLog[] = [
//     { user: "Jane Doe",   time: "1:56PM", action: "updated", item: "doc.png",    date: "April 6, 2026" },
//     { user: "John Smith", time: "3:20PM", action: "created", item: "report.pdf", date: "April 6, 2026" },
//     { user: "Jane Doe",   time: "9:10AM", action: "deleted", item: "old.docx",   date: "April 7, 2026" },
//     { user: "Luke Emia",   time: "11:39AM", action: "approved", item: "insurancethings.pdf",   date: "April 7, 2026" },
//     { user: "John Smith", time: "3:39PM", action: "commented on", item: "report.pdf", date: "April 7, 2026" },
//     { user: "William Dingleberry",   time: "2:20AM", action: "logged in", date: "April 7, 2026" },
// ]

function groupByDate(notifications: Notification[]) {
    return notifications.reduce(
        (groups, n) => {
            if (!n.creatorId) return groups;

            const key = new Date(n.createdAt).toLocaleDateString("en-US");
            if (!groups[key]) groups[key] = [];
            groups[key].push(n);
            return groups;
        },
        {} as Record<string, Notification[]>,
    );
}

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

export function UserLogs() {
    const [grouped, setGrouped] = useState<Record<string, Notification[]>>({});

    useEffect(() => {
        async function fetchNotifs() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/notifs/get-notifications`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data: Notification[] = await res.json();
            setGrouped(groupByDate(data));
        }

        fetchNotifs();
    }, []);
    return (
        <>
            <Card className="flex flex-col relative ring-0">
                <CardHeader className="flex items-center gap-1 space-y-0 border-0 py-1 sm:flex-row bg-(--card)">
                    <div className="grid flex-1 gap-1">
                        <CardTitle className="text-2xl text-(--card-title)">
                            User Activity
                        </CardTitle>
                        <CardDescription className="text-(--foreground)">
                            Track recent actions performed by users, including
                            creations, edits, logins, and more.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent className="p-0 overflow-hidden flex-1 min-h-0">
                    <ScrollArea className="h-full">
                        {Object.entries(grouped).map(([date, logs]) => (
                            <div key={date}>
                                <p className="text-center text-xs font-semibold text-gray-500 pb-0">
                                    {formatDateLabel(date)}
                                </p>
                                <Table className="w-full">
                                    <TableBody>
                                        {logs.map((n) => (
                                            <TableRow key={n.id}>
                                                <TableCell className="py-2 text-sm">
                                                    <div className="flex items-center w-full">
                                                        <div className="flex items-center gap-1 flex-1 min-w-0">
                                                            <img
                                                                className="size-10 rounded-full shrink-0"
                                                                src={
                                                                    n.profileIcon
                                                                }
                                                            />
                                                            <div className="flex-1 min-w-0 pl-5 truncate whitespace-nowrap overflow-hidden">
                                                                <span className="font-semibold">
                                                                    {n.title
                                                                        .split(
                                                                            " ",
                                                                        )
                                                                        .slice(
                                                                            0,
                                                                            2,
                                                                        )
                                                                        .join(
                                                                            " ",
                                                                        )}
                                                                </span>{" "}
                                                                {n.title
                                                                    .split(" ")
                                                                    .slice(2, 3)
                                                                    .join(
                                                                        " ",
                                                                    )}{" "}
                                                                <span className="text-(--secondary) font-semibold">
                                                                    {n.title
                                                                        .split(
                                                                            " ",
                                                                        )
                                                                        .slice(
                                                                            3,
                                                                        )
                                                                        .join(
                                                                            " ",
                                                                        )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center justify-end shrink-0 w-[90px]">
                                                            <div className="text-right whitespace-nowrap">
                                                                {formatTimeLabel(
                                                                    n.createdAt,
                                                                )}
                                                            </div>
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

                {/* Popup Info */}
                <div className="absolute top-3 right-3">
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
                                User Activity
                            </p>
                            <p className="text-xs text-muted-foreground mb-3">
                                A real-time log of all recent actions performed
                                by users in the system.
                            </p>
                            <div className="space-y-1">
                                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">
                                    Actions tracked
                                </p>
                                {[
                                    "Created",
                                    "Updated",
                                    "Deleted",
                                    "Approved",
                                    "Commented on",
                                    "Logged in",
                                ].map((action) => (
                                    <div
                                        key={action}
                                        className="text-xs text-muted-foreground"
                                    >
                                        {action}
                                    </div>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </Card>
        </>
    );
}
