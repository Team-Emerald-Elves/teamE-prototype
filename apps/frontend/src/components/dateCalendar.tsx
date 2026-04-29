"use client";

import * as React from "react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import type { DateAndTimeProps } from "./types/dateCalendar.d.ts";

export default function DateAndTime(props: DateAndTimeProps) {
    const [open, setOpen] = React.useState(false);

    const safeDate =
        props.date && !isNaN(props.date.getTime())
            ? props.date
            : new Date();

    const getTime = (date: Date) =>
        date.toTimeString().slice(0, 5); // HH:MM

    return (
        <FieldGroup className="max-w-xs flex flex-row gap-2" id={props.id}>
            {/* DATE */}
            <Field>

                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className="w-50 justify-between bg-background font-normal"
                        >
                            {format(safeDate, "PPP")}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={safeDate}
                            defaultMonth={safeDate}
                            onSelect={(date) => {
                                if (!date) return;

                                const updated = new Date(date);

                                if (props.disableTime) {
                                    // 🔑 force midnight if time disabled
                                    updated.setHours(0, 0, 0, 0);
                                } else {
                                    // preserve existing time
                                    updated.setHours(
                                        safeDate.getHours(),
                                        safeDate.getMinutes(),
                                        0,
                                        0
                                    );
                                }

                                props.onDateChange(updated);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </Field>

            {/* TIME */}
            {!props.disableTime && (
                <Field className="w-32">

                    <Input
                        type="time"
                        value={getTime(safeDate)}
                        onChange={(e) => {
                            const value = e.target.value;
                            if (!value.includes(":")) return;

                            const [h, m] = value.split(":").map(Number);
                            if (Number.isNaN(h) || Number.isNaN(m)) return;

                            const updated = new Date(safeDate);
                            updated.setHours(h, m, 0, 0);

                            props.onDateChange(updated);
                        }}
                        className="appearance-none bg-background"
                    />
                </Field>
            )}
        </FieldGroup>
    );
}