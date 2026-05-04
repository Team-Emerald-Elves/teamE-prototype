import * as React from "react";
import { useMemo } from "react";
import { FileText, X } from "lucide-react";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import type { Notification as Notifs } from "@repo/database/types";

export type Notification = Omit<Notifs, "createdAt"> & {
    createdAt: string;
    profileIcon?: string;
};

type NotifScrollProps = {
    notifications: Notification[];
    onDismissNotification: (id: string) => void;
};

function groupByDate(notifications: Notification[]) {
    return notifications.reduce(
        (groups, n) => {
            const dateKey = new Date(n.createdAt).toLocaleDateString("en-US");

            if (!groups[dateKey]) {
                groups[dateKey] = [];
            }

            groups[dateKey].push(n);
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

export function NotifScroll({
    notifications,
    onDismissNotification,
}: NotifScrollProps) {
    const grouped = useMemo(() => groupByDate(notifications), [notifications]);

    return (
        <ScrollArea className="h-80 w-90 rounded-md border bg-card shadow-md">
            <div>
                <h4 className="px-3 py-2 text-md font-semibold text-(--table-titles)">
                    Notifications
                </h4>

                {notifications.length === 0 ? (
                    <div className="px-3 py-4 text-xs text-gray-400">
                        No notifications.
                    </div>
                ) : (
                    Object.entries(grouped).map(([date, items]) => (
                        <div key={date}>
                            <div className="top-0 z-10 bg-(--card-header) px-2 py-2 text-xs font-semibold text-gray-500">
                                {formatDateLabel(date)}
                            </div>

                            {items.map((n, i) => (
                                <React.Fragment key={n.id}>
                                    <div className="group flex items-start gap-2 rounded-sm px-2 py-1">
                                        {n.creatorId ? (
                                            <img
                                                className="size-8 rounded-full"
                                                src={n.profileIcon}
                                                alt="Notification creator"
                                            />
                                        ) : (
                                            <FileText
                                                size={28}
                                                strokeWidth={1.5}
                                                className="shrink-0 text-gray-400"
                                            />
                                        )}

                                        <div className="min-w-0 flex-1 text-xs leading-snug">
                                            {n.creatorId ? (
                                                <>
                                                    <span className="font-semibold text-foreground">
                                                        {n.title
                                                            .split(" ")
                                                            .slice(0, 2)
                                                            .join(" ")}{" "}
                                                    </span>
                                                    <span className="text-(--table-text)">
                                                        {n.title
                                                            .split(" ")
                                                            .slice(2, 3)
                                                            .join(" ")}{" "}
                                                    </span>
                                                    <span className="font-semibold text-[#768b6c]">
                                                        {n.title
                                                            .split(" ")
                                                            .slice(3)
                                                            .join(" ")}{" "}
                                                    </span>
                                                </>
                                            ) : (
                                                <>
                                                    <span className="font-semibold text-[#768b6c]">
                                                        {n.title
                                                            .split(" ")
                                                            .slice(0, -3)
                                                            .join(" ")}{" "}
                                                    </span>
                                                    <span className="text-(--table-text)">
                                                        expiring tomorrow!{" "}
                                                    </span>
                                                </>
                                            )}

                                            <span className="whitespace-nowrap text-gray-400">
                                                {formatTimeLabel(n.createdAt)}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="shrink-0 rounded-sm p-1 text-gray-400 opacity-70 hover:bg-muted hover:text-orange-500 group-hover:opacity-100"
                                            aria-label="Dismiss notification"
                                            onClick={() =>
                                                onDismissNotification(n.id)
                                            }
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    {i < items.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </ScrollArea>
    );
}
