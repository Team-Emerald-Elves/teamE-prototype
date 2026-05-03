import { useRef, useState } from "react";
import FullCalendarComponent from "@/components/fullCalendar.tsx";
import AddEventButton from "@/components/addEventButton.tsx";
import EventForm from "@/components/eventForm.tsx";
import PageHeader from "@/components/page-header.tsx";
import EventDetails from "@/components/eventDetailsPopup.tsx";
import RoleLegend from "@/components/roleLegend.tsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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

    const [helpOpen, setHelpOpen] = useState(false);
    const helpSections = [
        {
            title: "Viewing Events",
            body: "All events are displayed on the calendar. Click on any event to view its details.",
        },
        {
            title: "Adding an Event",
            body: "Click the 'Add Event' button in the top right to create a new event.",
        },
        {
            title: "Deleting an Event",
            body: "Click on an event to open its details, then use the delete option to permanently remove it.",
        },
        {
            title: "Month & Week View",
            body: "Use the Month and Week buttons to switch between a monthly overview and a detailed weekly view.",
        },
        {
            title: "Navigating Dates",
            body: "Use the left and right arrows to go to the previous or next month/week. Click 'Today' to jump back to the current date.",
        },
    ];

    const handlePrev = () => {
        calendarRef.current?.getApi().prev();
        const newDate = new Date(date);

        if (view === "dayGridMonth") {
            newDate.setMonth(newDate.getMonth() - 1);
        } else {
            newDate.setDate(newDate.getDate() - 7);
        }

        setDate(newDate);
    };

    const handleNext = () => {
        calendarRef.current?.getApi().next();
        const newDate = new Date(date);

        if (view === "dayGridMonth") {
            newDate.setMonth(newDate.getMonth() + 1);
        } else {
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
            {helpOpen && (
                <div
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                    onClick={() => setHelpOpen(false)} // clicking outside closes it
                >
                    <div
                        className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 flex flex-col gap-5 shadow-xl"
                        onClick={(e) => e.stopPropagation()} // stops click from closing when clicking inside
                    >
                        <h2 className="text-xl font-bold text-gray-900">How to Use Calendar</h2>
                        {helpSections.map((section) => (
                            <div key={section.title}>
                                <p className="font-semibold text-gray-800 mb-1">{section.title}</p>
                                <p className="text-gray-600 text-sm">{section.body}</p>
                            </div>
                        ))}
                        <button
                            onClick={() => setHelpOpen(false)}
                            className="mt-2 text-sm text-gray-400 hover:text-gray-600 transition-colors self-center"
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}

            <div className="flex items-start justify-between">
                <div>
                    <div className="mx-5 pt-6 text-left flex flex-start flex-col pl-5">
                        <h1 className="text-left pb-2">
                            {view === "dayGridMonth"
                                ? `${date.toLocaleString("en-US", { month: "long", year: "numeric" })}`
                                : getCurrentWeekLabel(date)}
                        </h1>
                        <div className="bg-[#F4A258] w-30 h-[3px]" />
                        <div className="flex items-center gap-1 pt-3">
                            <p className="header-subtext-color">Keep track of important events here.</p>

                            <button
                                onClick={() => setHelpOpen(true)}
                                className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-xs font-bold hover:bg-blue-200 transition-colors"
                                title="Help"
                            >
                                ?
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-7 px-9">
                        <button
                            onClick={() => setView("dayGridMonth")}
                            className={`px-3 py-1 rounded ${
                                view === "dayGridMonth"
                                    ? "bg-[#0b4461] text-white"
                                    : "bg-(--second-button-cal)"
                            }`}
                        >
                            Month
                        </button>
                        <button
                            onClick={() => setView("timeGridWeek")}
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
