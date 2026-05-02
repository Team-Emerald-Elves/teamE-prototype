import { useRef, useState } from "react";
import FullCalendarComponent from "@/components/fullCalendar.tsx";
import AddEventButton from "@/components/addEventButton.tsx";
import EventForm from "@/components/eventForm.tsx";
import PageHeader from "@/components/page-header.tsx";
import EventDetails from "@/components/eventDetailsPopup.tsx";
import RoleLegend from "@/components/roleLegend.tsx";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";

type CalendarView = "dayGridMonth" | "timeGridWeek";

function getCurrentWeekLabel(baseDate: Date) {
    const start = new Date(baseDate);
    start.setDate(baseDate.getDate() - baseDate.getDay());

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

export default function CalendarPage() {
    const [open, setOpen] = useState(false);
    const [openAdd, setOpenAdd] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [reload, setReload] = useState(false);

    const [view, setView] = useState<CalendarView>("dayGridMonth");
    const [legendOpen, setLegendOpen] = useState(false);

    const calendarRef = useRef<any>(null);

    const [date, setDate] = useState<Date>(new Date());

    const handlePrev = () => {
        calendarRef.current?.getApi().prev();
        const newDate = new Date(date);

        if (view === "dayGridMonth") {
            newDate.setMonth(newDate.getMonth() - 1);
        }
        else {
            newDate.setDate(newDate.getDate() - 7);
        }

        setDate(newDate);
    };

    const handleNext = () => {
        calendarRef.current?.getApi().next();
        const newDate = new Date(date);

        if (view === "dayGridMonth") {
            newDate.setMonth(newDate.getMonth() + 1);
        }
        else {
            newDate.setDate(newDate.getDate() + 7);
        }

        setDate(newDate);
    };

    const handleToday = () => {
        calendarRef.current?.getApi().today();
        setDate(new Date());

    };

    return (
        <>
            <div className="flex items-start justify-between">

                <div>
                    <PageHeader
                        title={view === "dayGridMonth" ? `${date.toLocaleString("en-US", {
                            month: "long",
                            year: "numeric",
                        })}` : getCurrentWeekLabel(date)}
                        description="Keep track of important events here."
                    />
                    <div className="flex gap-2 pt-7 px-9">
                        <button
                            onClick={() => {
                                setView("dayGridMonth");

                            }}
                            className={`px-3 py-1 rounded ${
                                view === "dayGridMonth"
                                    ? "bg-[#0b4461] text-white"
                                    : "bg-(--second-button-cal)"
                            }`}
                        >
                            Month
                        </button>

                        <button
                            onClick={() => {
                                setView("timeGridWeek");
                            }}
                            className={`px-3 py-1 rounded ${
                                view === "timeGridWeek"
                                    ? "bg-[#0b4461] text-white"
                                    : "bg-(--second-button-cal)"
                            }`}
                        >
                            Week
                        </button>
                    </div>
                </div>


                <div className="flex items-center pt-40">
                    <RoleLegend />
                </div>



                <div className="flex flex-col items-end gap-2 pt-25 pr-10">
                    <AddEventButton setOpen={setOpenAdd} />

                    <div className="flex items-center gap-2 pt-2">

                        <button
                            onClick={handlePrev}
                            className="px-3 py-1 bg-(--second-button-cal) rounded"
                        >
                            <FontAwesomeIcon icon={faAngleLeft} />
                        </button>

                        <button
                            onClick={handleToday}
                            className="px-3 py-1 bg-(--second-button-cal) rounded"
                        >
                            Today
                        </button>

                        <button
                            onClick={handleNext}
                            className="px-3 py-1 bg-(--second-button-cal) rounded"
                        >

                            <FontAwesomeIcon icon={faAngleRight} />
                        </button>
                    </div>

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

            <div className="px-7 pt-1 h-full ">
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
