import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import {getToken, useAuth} from "@clerk/react"

type FullCalendarComponentProps = {
    setOpen: (open: boolean) => void;
    setSelectedEvent: (event: any) => void;
    reload: boolean;
    setReload: (reload: any) => void;
};

export default function FullCalendarComponent({
                                                  setOpen,
                                                  setSelectedEvent, reload
                                              }: FullCalendarComponentProps) {

    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        async function fetchEvents() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/get-events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error fetching events.");
            }

            const data = await res.json();
            console.log(data);
            setEvents(data);
        }

        fetchEvents();
    }, [getToken, reload]);

    return (
        <div className="h-full w-full">
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"

            dateClick={() => setOpen(true)}

            eventClick={(info) => {
                setSelectedEvent(info.event)
                setOpen(true);

            }}
            headerToolbar={
                {
                    start: 'title',
                    center: '',
                    end: 'prev today next'
                }
            }
            dayHeaderClassNames={() => [
                "bg-(--calendar-bg)",
                "text-(--table-titles)",
            ]}

            events={events}
            height="100%"
            contentHeight="auto"
            stickyHeaderDates={true}
        />
        </div>
    );
}