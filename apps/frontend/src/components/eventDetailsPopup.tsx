import EventForm from "@/components/eventForm.tsx";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import ExpiringBar from "@/components/expiringBar.tsx";

type EventDetailsProps = {
    selectedEvent: any;
    setSelectedEvent: (event: any) => void;
    setReload: (reload: any) => void;
    openEvent: boolean;
    setOpenEvent: (event: any) => void;
};

export default function EventDetails(props: EventDetailsProps) {
    const [empID, setEmpID] = useState("");
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/tests/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );
            const data = await res.json();
            setMe(data);
            setEmpID(data.id);
        }

        load();
    }, [getToken, isSignedIn]);

    const [open, setOpen] = useState(false);

    const ROLE_COLORS: Record<string, string> = {
        "#6D28D9": "Administrator",
        "#93C5FD": "BusinessAnalyst",
        "#F9A8D4": "UnderWriter",
        "#2DD4BF": "ExcelOperator",
        "#C4B5FD": "BusinessOperator",
        "#F0ABFC": "ActuarialAnalyst",
    };

    let eventEmpId = null;
    let role;
    if (props.selectedEvent) {
        eventEmpId = props.selectedEvent.extendedProps.lock;
        role = ROLE_COLORS[props.selectedEvent.backgroundColor];
        console.log(props.selectedEvent.extendedProps.contentOwner);
    }

    return (
        <>
            <Dialog
                open={props.openEvent}
                onOpenChange={(isOpen) => {
                    props.setOpenEvent(isOpen);

                    if (!isOpen) {
                        props.setSelectedEvent(null);
                    }
                }}
            >
                <DialogContent className="overflow-visible max-w-3xl">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-xl font-bold">
                            {props.selectedEvent?.title}
                        </h3>
                        {props.selectedEvent?.extendedProps.doc_id !== -1 ? (
                            <ExpiringBar
                                createdAt={
                                    props.selectedEvent?.extendedProps
                                        .created_at
                                }
                                expiresAt={props.selectedEvent?.start}
                            />
                        ) : (
                            <div>
                                <p>
                                    Start Date:{" "}
                                    {props.selectedEvent?.start.toLocaleString()}
                                </p>{" "}
                                <p>
                                    {" "}
                                    End Date:{" "}
                                    {props.selectedEvent?.end.toLocaleString()}
                                </p>
                            </div>
                        )}
                    </div>
                    {props.selectedEvent?.extendedProps.doc_id !== -1 ? (
                        <div className="flex items-center gap-x-2">
                            <FontAwesomeIcon
                                icon={faCircle}
                                style={{
                                    color: props.selectedEvent?.backgroundColor,
                                }}
                            />
                            <p>{props.selectedEvent && role}</p>
                        </div>
                    ) : null}

                    {props.selectedEvent?.extendedProps.doc_id !== -1 ? (
                        <div>
                            <p>
                                Owned By:{" "}
                                {props.selectedEvent?.extendedProps
                                    ?.contentOwner
                                    ? props.selectedEvent?.extendedProps
                                          ?.contentOwner
                                    : "Unknown"}
                            </p>
                        </div>
                    ) : null}

                    {eventEmpId !== "none" &&
                        props.selectedEvent?.extendedProps.doc_id !== -1 && (
                            <p>
                                Checked Out By:{" "}
                                {props.selectedEvent?.extendedProps.checkedOut}
                            </p>
                        )}

                    {(eventEmpId === empID ||
                        props.selectedEvent?.extendedProps.doc_id === -1) && (
                        <Button
                            onClick={() => {
                                setOpen(true);
                                props.setOpenEvent(false);
                            }}
                        >
                            Edit Event
                        </Button>
                    )}
                </DialogContent>
                <DialogFooter></DialogFooter>
            </Dialog>

            <EventForm
                open={open}
                setOpen={setOpen}
                selectedEvent={props.selectedEvent}
                setSelectedEvent={props.setSelectedEvent}
                setReload={props.setReload}
            />
        </>
    );
}
