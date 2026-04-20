import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react"

type FullCalendarComponentProps = {
    setOpen: (open: boolean) => void;
    setSelectedEvent: (event: any) => void;
};

export default function FullCalendarComponent({
                                                  setOpen,
                                                  setSelectedEvent,
                                              }: FullCalendarComponentProps) {

    const { getToken } = useAuth();
    const [events, setEvents] = useState<any[]>([]);

    useEffect(() => {
        async function fetchEvents() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.BACKEND_URL}/get-events`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error fetching events.");
            }

            const data = await res.json();
            setEvents(data);
        }

        fetchEvents();
    }, [getToken]);

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"

            dateClick={() => setOpen(true)}

            eventClick={(info) => {
                setSelectedEvent(info.event);
                setOpen(true);
            }}

            events={events}
            height="100%"
            stickyHeaderDates={true}
        />
    );
}