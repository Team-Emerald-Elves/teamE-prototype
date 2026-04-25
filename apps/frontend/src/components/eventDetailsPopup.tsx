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

type EventDetailsProps = {
    selectedEvent: any;
    setSelectedEvent: (event: any) => void;
    setReload: (reload: any) => void;
    openEvent: boolean;
    setOpenEvent: (event: any) => void;
}

function lightenColor(hex: string, percent: number): string {
    // remove #
    const cleanHex = hex.replace("#", "");

    const num = parseInt(cleanHex, 16);

    let r = (num >> 16) & 255;
    let g = (num >> 8) & 255;
    let b = num & 255;

    r = Math.round(r + (255 - r) * percent);
    g = Math.round(g + (255 - g) * percent);
    b = Math.round(b + (255 - b) * percent);

    return `#${(1 << 24 | (r << 16) | (g << 8) | b)
        .toString(16)
        .slice(1)}`;
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

    const bgColor = props.selectedEvent?.backgroundColor
        ? lightenColor(props.selectedEvent.backgroundColor, 0.6)
        : "#ffffff";



    return (
        <>
            <Dialog open={props.openEvent} onOpenChange={(isOpen) => {
                props.setOpenEvent(isOpen);

                if (!isOpen) {
                    props.setSelectedEvent(null);
                }}}>
                <DialogContent style={{ backgroundColor: bgColor }}>
                    <h3 className="text-xl font-bold">{props.selectedEvent?.title}</h3>

                    <p>Expiring: {props.selectedEvent?.start?.toLocaleString()}</p>
                    <p>Role: {props.selectedEvent && role}</p>
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