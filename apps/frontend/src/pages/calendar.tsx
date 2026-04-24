import FullCalendarComponent from "@/components/fullCalendar.tsx";
import AddEventButton from "@/components/addEventButton.tsx";
import EventForm from "@/components/eventForm.tsx";
import PageHeader from "@/components/page-header.tsx";
import {useState} from "react";

export default function CalendarPage() {
    const [open, setOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [reload, setReload] = useState(false);

    return (
        <>
            <PageHeader title="Calendar" description="Keep track of important events here."></PageHeader>
            <EventForm open={open}
                       setOpen={setOpen}
                       selectedEvent={selectedEvent}
                       setSelectedEvent={setSelectedEvent} setReload={setReload}/>

            <div className="pr-7 pl-7 pt-2 flex flex-col h-screen overflow-scroll" >
                <div className="mb-2 ml-2">
                    <AddEventButton setOpen={setOpen} />
                </div>
                <div className=" p-5 w-full bg-white rounded-xl shadow-sm border flex-1 ">
                    <FullCalendarComponent setOpen={setOpen} setSelectedEvent={setSelectedEvent} reload={reload} setReload={setReload}/>
                </div>
            </div>

        </>
    );
}