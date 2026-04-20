import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogClose,
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Field, FieldContent, FieldGroup, FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DateAndTime from './date.tsx'
import {useEffect, useState} from "react";
import { Switch } from "@/components/ui/switch"

type EventFormProps = {
    open: boolean;
    setOpen: (open: boolean) => void;
    selectedEvent: any;
    setSelectedEvent: (event: any) => void;
};

export default function EventForm({ open, setOpen, selectedEvent, setSelectedEvent }: EventFormProps) {
    const [startDate, setStartDate] = useState(() => new Date());
    const [allDay, setAllDay] = useState(false);
    const [title, setTitle] = useState("");

    const [endDate, setEndDate] = useState(() => {
        const d = new Date();
        d.setHours(d.getHours() + 1);
        return d;
    });

    const getTime = (date: Date) =>
        date.toTimeString().slice(0, 5);

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
            const later = new Date(now);
            later.setHours(now.getHours() + 1);

            setStartDate(now);
            setEndDate(later);
            setAllDay(false);
        }
    }, [selectedEvent]);

    useEffect(() => {
        if (!open) {
            setSelectedEvent(null);
            setTitle("");

            const now = new Date();
            const later = new Date(now);
            later.setHours(now.getHours() + 1);

            setStartDate(now);
            setEndDate(later);
            setAllDay(false);
        }
    }, [open]);

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen);

            if (!isOpen) {
                setSelectedEvent(null);
            }
        }}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {selectedEvent ? "Edit Event" : "Add Event"}
                    </DialogTitle>
                </DialogHeader>

                <form>
                    <Field className="p-1">
                        <FieldLabel htmlFor="eventTitle">Event Title</FieldLabel>
                        <Input
                            placeholder="Event title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </Field>
                    <Field className="p-1">
                        <div className="flex items-center space-x-2">
                            <Label htmlFor="allDay" > All Day </Label>
                            <Switch id="allDay"
                                checked={allDay}
                                onCheckedChange={setAllDay}
                            />
                        </div>
                    </Field>
                    <Field>
                        <Label htmlFor="startDate" >Choose Start Date</Label>
                        <DateAndTime
                            id="startDate"
                            date={startDate}
                            time={getTime(startDate)}
                            disableTime={allDay}
                        />
                    </Field>
                    <Field>
                        <Label htmlFor="endDate" >Choose End Date</Label>
                        <DateAndTime
                            id="endDate"
                            date={endDate}
                            time={getTime(endDate)}
                            disableTime={allDay}
                        />
                    </Field>
                    <Button type="submit">{selectedEvent ? "Save Changes" : "Add"}</Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}