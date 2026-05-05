import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateAndTime from "./dateCalendar.tsx";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { getToken } from "@clerk/react";

type EventFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedEvent: any;
    setSelectedEvent: (event: any) => void;
    setReload: (reload: any) => void;
};

type AddEventRequest = {
    title: string;
    start_date: string;
    end_date: string;
    all_day: boolean;
};

type EditEventRequest = AddEventRequest & {
    id: number;
};

export default function EventForm({
    open,
    setOpen,
    selectedEvent,
    setSelectedEvent,
    setReload,
}: EventFormProps) {
    const [startDate, setStartDate] = useState(() => new Date());
    const [allDay, setAllDay] = useState(false);
    const [title, setTitle] = useState("");

    const [endDate, setEndDate] = useState(() => new Date());

    async function handleSubmit(event: any) {
        event.preventDefault();

        const token = await getToken();
        const isEdit = !!selectedEvent;

        const basePayload = {
            title,
            start_date: startDate.toISOString(),
            end_date: endDate.toISOString(),
            all_day: allDay,
        };

        const payload = isEdit
            ? ({
                  id: selectedEvent.id,
                  ...basePayload,
              } as EditEventRequest)
            : (basePayload as AddEventRequest);

        const res = await fetch(
            isEdit
                ? `${import.meta.env.VITE_BACKEND_URL}/update-event`
                : `${import.meta.env.VITE_BACKEND_URL}/add-event`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            },
        );

        if (!res.ok) {
            console.error("Failed to save event");
            return;
        }

        setOpen(false);
        setSelectedEvent(null);
        setReload((prev: any) => !prev);
    }

    async function deleteEvent() {
        if (!selectedEvent?.id) {
            console.error("No event selected for deletion");
            return;
        }

        try {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/delete-event`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: selectedEvent.id,
                    }),
                },
            );

            if (!res.ok) {
                console.error("Failed to delete event");
                return;
            }

            // reset UI state

            setOpen(false);
            setSelectedEvent(null);
            setReload((prev: any) => !prev);
        } catch (err) {
            console.error("Delete error:", err);
        }
    }

    useEffect(() => {
        setEndDate((prev) => {
            const updated = new Date(startDate);
            updated.setHours(
                prev.getHours(),
                prev.getMinutes(),
                0,
                0,
            );
            return updated;
        });
    }, [
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate(),
    ]);

    useEffect(() => {
        if (selectedEvent) {
            setTitle(selectedEvent.title);

            const start = new Date(selectedEvent.start);
            const end = selectedEvent.end
                ? new Date(selectedEvent.end)
                : new Date(start);

            setStartDate(start);
            setEndDate(end);
            setAllDay(selectedEvent.allDay);
        } else {
            // reset for "Add"
            setTitle("");
            const now = new Date();

            setStartDate(now);
            setEndDate(new Date(now));
            setAllDay(false);
        }
    }, [selectedEvent]);

    useEffect(() => {
        if (!open) {
            setSelectedEvent(null);
            setTitle("");

            const now = new Date();

            setStartDate(now);
            setEndDate(new Date(now));
            setAllDay(false);
        }
    }, [open]);

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                setOpen(isOpen);

                if (!isOpen) {
                    setSelectedEvent(null);
                }
            }}
        >
            <DialogContent className="lg:max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl text-primary font-mono font-bold">
                        {selectedEvent ? "Edit Event" : "Add Event"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={async (e) => handleSubmit(e)}>
                    <Field className="p-1">
                        <FieldLabel
                            className="w-24 text-right text-sm font-bold"
                            htmlFor="eventTitle"
                        >
                            Event Title:
                        </FieldLabel>
                        <Input
                            placeholder="Event title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Field>
                    <Field className="mt-2">
                        <Label
                            htmlFor="startDate"
                            className="w-24 text-right text-xs font-bold"
                        >
                            Choose Start Date
                        </Label>
                        <div className="grid grid-cols-2">
                            <DateAndTime
                                id="startDate"
                                date={startDate}
                                disableTime={allDay}
                                onDateChange={setStartDate}
                            />
                            <Field className="p-1 ml-24">
                                <div className="flex items-center space-x-2">
                                    <Label
                                        htmlFor="allDay"
                                        className="text-right text-xs font-bold"
                                    >
                                        {" "}
                                        All Day:{" "}
                                    </Label>
                                    <Switch
                                        id="allDay"
                                        checked={allDay}
                                        onCheckedChange={setAllDay}
                                    />
                                </div>
                            </Field>
                        </div>
                    </Field>
                    {!allDay && (
                        <Field className="mt-2">
                            <Label
                                htmlFor="endTime"
                                className="w-24 text-right text-xs font-bold"
                            >
                                End Time
                            </Label>
                            <div className="flex">
                                <Input
                                    id="endTime"
                                    type="time"
                                    value={endDate
                                        .toTimeString()
                                        .slice(0, 5)}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (!value.includes(":")) return;
                                        const [h, m] = value
                                            .split(":")
                                            .map(Number);
                                        if (
                                            Number.isNaN(h) ||
                                            Number.isNaN(m)
                                        )
                                            return;
                                        const updated = new Date(startDate);
                                        updated.setHours(h, m, 0, 0);
                                        setEndDate(updated);
                                    }}
                                    className="w-32 h-9 appearance-none bg-background text-sm"
                                />
                            </div>
                        </Field>
                    )}
                    <Button className="mt-5" type="submit">
                        {selectedEvent ? "Save Changes" : "Add"}
                    </Button>
                    {selectedEvent && (
                        <Button
                            onClick={async () => {
                                await deleteEvent();
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </form>
            </DialogContent>
        </Dialog>
    );
}
