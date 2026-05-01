import { useRef, useState } from "react";
import FullCalendarComponent from "@/components/fullCalendar.tsx";
import AddEventButton from "@/components/addEventButton.tsx";
import EventForm from "@/components/eventForm.tsx";
import PageHeader from "@/components/page-header.tsx";
import EventDetails from "@/components/eventDetailsPopup.tsx";
import RoleLegend from "@/components/roleLegend.tsx";

type CalendarView = "dayGridMonth" | "timeGridWeek";

export default function CalendarPage() {
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [reload, setReload] = useState(false);

    const [view, setView] = useState<CalendarView>("dayGridMonth");
    const [legendOpen, setLegendOpen] = useState(false);

    const calendarRef = useRef<any>(null);

    const [date, setDate] = useState<string>(new Date().toLocaleString("en-US", {
        month: "long",
        year: "numeric",
    }))

    // navigation handlers
    const handlePrev = () => {
        calendarRef.current?.getApi().prev();
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() - 1);

        setDate(
            newDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
            })
        );
    };

    const handleNext = () => {
        calendarRef.current?.getApi().next();
        const newDate = new Date(date);
        newDate.setMonth(newDate.getMonth() + 1);

        setDate(
            newDate.toLocaleString("en-US", {
                month: "long",
                year: "numeric",
            })
        );
    };

    const handleToday = () => {
        calendarRef.current?.getApi().today();
        setDate(new Date().toLocaleString("en-US", {
            month: "long",
            year: "numeric",
        }))
    };

    return (
        <>
            <div className="flex items-start justify-between">

                <div>
                    <PageHeader
                        title={`${date}`}
                        description="Keep track of important events here."
                    />
                    <div className="flex gap-2 pt-3 px-9">
                        <button
                            onClick={() => {
                                setView("dayGridMonth");
                                setDate(
                                    new Date().toLocaleString("en-US", {
                                        month: "long",
                                        year: "numeric",
                                    })
                                );
                            }}
                            className={`px-3 py-1 rounded ${
                                view === "dayGridMonth"
                                    ? "bg-[#0b4461] text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            Month
                        </button>

                        <button
                            onClick={() => {
                                setView("timeGridWeek");

                                const start = new Date(date);
                                const end = new Date(date);

                                const day = start.getDay();
                                const diff = (day === 0 ? -6 : 1) - day;

                                start.setDate(start.getDate() + diff);
                                end.setDate(start.getDate() + 6);

                                const startStr = start.toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                });

                                const endStr = end.toLocaleDateString("en-US", {
                                    month: "long",
                                    day: "numeric",
                                });

                                setDate(`${startStr} – ${endStr}, ${start.getFullYear()}`);
                            }}
                            className={`px-3 py-1 rounded ${
                                view === "timeGridWeek"
                                    ? "bg-[#0b4461] text-white"
                                    : "bg-gray-200"
                            }`}
                        >
                            Week
                        </button>
                    </div>
                </div>


                <div className="flex flex-col items-end gap-2 pt-25 pr-10">


                    <div className="flex items-center gap-2">

                        <button
                            onClick={handlePrev}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            Prev
                        </button>

                        <button
                            onClick={handleToday}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            Today
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-3 py-1 bg-gray-200 rounded"
                        >
                            Next
                        </button>
                    </div>
                    <AddEventButton setOpen={setOpenAdd} />
                </div>
            </div>

                         <EventDetails
                                openEvent={open}
                                selectedEvent={selectedEvent}
                                setReload={setReload}
                                setSelectedEvent={setSelectedEvent}
                                setOpenEvent={setOpen}
                            />
            <EventForm
                open={openAdd}
                setOpen={setOpenAdd}
                selectedEvent={selectedEvent}
                setSelectedEvent={setSelectedEvent}
                setReload={setReload}
            />


            <div className="px-7 pt-1 h-full">
                <FullCalendarComponent
                    calendarRef={calendarRef}
                    setOpen={setOpen}
                    setOpenAdd={setOpenAdd}
                    setSelectedEvent={setSelectedEvent}
                    reload={reload}
                    setReload={setReload}
                    view={view}
                />
            </div>
        </>
    );
}