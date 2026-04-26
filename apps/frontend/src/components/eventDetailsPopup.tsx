import EventForm from "@/components/eventForm.tsx";
import {useEffect, useState} from "react";
import { Button } from "@/components/ui/button"
import {useAuth} from "@clerk/react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import ExpiringBar from "@/components/expiringBar.tsx";

type EventDetailsProps = {
    selectedEvent: any;
    setSelectedEvent: (event: any) => void;
    setReload: (reload: any) => void;
    openEvent: boolean;
    setOpenEvent: (event: any) => void;
}


export default function EventDetails(props: EventDetailsProps) {
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
        }

        load();
    }, [getToken, isSignedIn]);

    const [open, setOpen] = useState(false);

    const ROLE_COLORS: Record<string, string> = {
        "#8b5cf6": "Administrator",     // purple
        "#ef4444": "BusinessAnalyst",   // red
        "#ec4899": "UnderWriter",       // pink
        "#22c55e": "ExcelOperator",     // green
        "#f97316": "BusinessOperator",  // orange
        "#eab308": "ActuarialAnalyst",  // yellow
    };

    let eventEmpId = null;
    let role;
    if (props.selectedEvent) {
        eventEmpId = props.selectedEvent.extendedProps.lock;
        role = ROLE_COLORS[props.selectedEvent.backgroundColor];
    }




    return (
        <>
            <Dialog open={props.openEvent} onOpenChange={(isOpen) => {
                props.setOpenEvent(isOpen);

                if (!isOpen) {
                    props.setSelectedEvent(null);
                }}}>
                <DialogContent className="overflow-visible max-w-3xl">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">{props.selectedEvent?.title}</h3>
                        <ExpiringBar createdAt={props.selectedEvent?.extendedProps.created_at} expiresAt={props.selectedEvent?.start} />
                    </div>
                        <div className="flex items-center gap-x-2">
                        <FontAwesomeIcon icon={faCircle} style={{ color: props.selectedEvent?.backgroundColor }} />
                        <p>{props.selectedEvent && role}</p>
                    </div>

                    {(eventEmpId !== "none") && (<div><p>Checked Out By:</p><p>{props.selectedEvent?.extendedProps.checkedOut}</p></div>)}

                    {(eventEmpId === empID) && (
                        <Button onClick={() => {setOpen(true); props.setOpenEvent(false)}}>Edit Event</Button>)}
                </DialogContent>
                <DialogFooter>

                </DialogFooter>
            </Dialog>


            <EventForm open={open}
                       setOpen={setOpen}
                       selectedEvent={props.selectedEvent}
                       setSelectedEvent={props.setSelectedEvent} setReload={props.setReload}/>
        </>
    )
}