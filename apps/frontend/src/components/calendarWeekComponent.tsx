import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { useEffect, useState } from "react";

function getCurrentWeekLabel() {
    const now = new Date();

    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());

    const end = new Date(start);
    end.setDate(start.getDate() + 6);

    const formatStart = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
    });

    const formatEnd = new Intl.DateTimeFormat("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });

    return `${formatStart.format(start)} - ${formatEnd.format(end)}`;
}

export default function CalendarWeek() {
    const { getToken } = useAuth();
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        async function fetchEvents() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/get-events`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!res.ok) {
                throw new Error("Error fetching events.");
            }

            const data = await res.json();
            console.log(data);
            setEvents(data);
        }

        fetchEvents();
    }, [getToken]);

    return (
        <div className="max-w-10xl mx-auto px-6 py-6">
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-800">
                        {getCurrentWeekLabel()}
                    </h4>
                    <Link
                        to="/calendar"
                        className="text-sm text-blue-900 hover:underline"
                    >
                        View Full Calendar
                    </Link>
                </div>
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridWeek"
                    headerToolbar={false}
                    dayHeaderClassNames={() => [
                        "bg-[#ecf4f9]",
                        "text-[#0b4461]",
                    ]}
                    contentHeight="auto"
                    events={events}
                />
            </div>
        </div>
    );
}
