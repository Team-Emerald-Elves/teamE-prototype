import FullCalendarComponent from "@/components/fullCalendar.tsx";
import AddEventButton from "@/components/addEventButton.tsx";
import EventForm from "@/components/eventForm.tsx";
import {useState} from "react";

export default function CalendarPage() {
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);

    return (
        <>
            <h1>Calendar</h1>

            <AddEventButton setOpen={setOpen} />

            <EventForm open={open}
                       setOpen={setOpen}
                       selectedEvent={selectedEvent}
                       setSelectedEvent={setSelectedEvent}/>
            <div className="h-[800px] w-full p-5">
                <FullCalendarComponent setOpen={setOpen} setSelectedEvent={setSelectedEvent} />
            </div>

        </>
    );
}