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



            <EventForm open={open}
                       setOpen={setOpen}
                       selectedEvent={selectedEvent}
                       setSelectedEvent={setSelectedEvent}/>
            <div className="pr-7 pl-7 pt-2" >
                <div className=" p-5 h-[800px] w-full bg-white rounded-xl shadow-sm border">
                    <div className="pl-315 pb-3">
                        <AddEventButton setOpen={setOpen} />
                    </div>

                    <FullCalendarComponent setOpen={setOpen} setSelectedEvent={setSelectedEvent} />
                </div>
            </div>

        </>
    );
}