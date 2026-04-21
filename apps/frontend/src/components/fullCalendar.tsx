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

    const [events, setEvents] = useState<any[]>([]);
    const [empID, setEmpID] = useState("");
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);

    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const data = await res.json();
            setMe(data);
            setEmpID(data.id);
            console.log("Full response data:", data);

        }

        load();
    }, [getToken,isSignedIn]);

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
    }, [getToken]);

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"

            dateClick={() => setOpen(true)}

            eventClick={(info) => {
                const eventEmpId = info.event.extendedProps.lock;
                console.log(eventEmpId);
                console.log(empID)
                if (eventEmpId === empID) {
                    setSelectedEvent(info.event)
                    setOpen(true);
                }
            }}
            dayHeaderClassNames={() => [
                "bg-[#ecf4f9]",
                "text-[#0b4461]",
            ]}

            events={events}
            contentHeight="auto"
            stickyHeaderDates={true}
        />
    );
}