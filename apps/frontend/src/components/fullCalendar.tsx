import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useRef, useState } from "react";
import { getToken } from "@clerk/react";

type CalendarView = "dayGridMonth" | "timeGridWeek";

type FullCalendarComponentProps = {
    setOpen: (open: boolean) => void;
    setOpenAdd: (open: boolean) => void;
    setSelectedEvent: (event: any) => void;
    reload: boolean;
    setReload: (reload: any) => void;
    view: CalendarView;
    calendarRef: React.RefObject<any>;
};

export default function FullCalendarComponent({
                                                  setOpen,
                                                  setOpenAdd,
                                                  setSelectedEvent,
                                                  reload,
                                                  view,
                                                  calendarRef,
                                              }: FullCalendarComponentProps) {
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
            setEvents(data);
        }

        fetchEvents();
    }, [reload]);

    useEffect(() => {
        const api = calendarRef.current?.getApi();
        if (api) api.changeView(view);
    }, [view]);

    return (
        <div className="h-full w-full">
            <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView={view}
                events={events}
                height="100%"
                contentHeight="auto"
                navLinks={true}
                navLinkDayClick={() => setOpenAdd(true)}
                eventClick={(info) => {


                    setSelectedEvent(info.event);
                    setOpen(true);
                    document.querySelectorAll(".fc-popover").forEach(el => el.remove());
                }}

                dayHeaderClassNames={() => [
                    "bg-[#0b4461]",
                    "text-white",
                ]}


                headerToolbar={
                {
                    start: '',
                    center: '',
                    end: '',
                }
            }

                eventClassNames={() => ["cursor-pointer"]}

                eventDidMount={(info) => {
                    info.el.title = info.event.title;
                }}

                dayMaxEvents={4}
                slotMinTime="08:00:00"
                slotMaxTime="20:00:00"
            />
        </div>
    );
}
