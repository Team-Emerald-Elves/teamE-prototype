"use client";

import * as React from "react";
import { format } from "date-fns";
//import { ChevronDownIcon } from "mira-react"

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import type { DateAndTimeProps } from "./types/date.d.ts";

export default function DateAndTime(props: DateAndTimeProps) {
    const [open, setOpen] = React.useState(false);

    return (
        <FieldGroup className="max-w-xs flex flex-row" id={props.id}>
            <Field>
                <FieldLabel>Date</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            className="w-50 justify-between"
                        >
                            {props.date
                                ? format(props.date, "PPP")
                                : "Select Date"}
                        </Button>
                    </PopoverTrigger>

                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={props.date}
                            onSelect={(date) => {
                                props.setDate(date);
                                setOpen(false);
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </Field>

            {!props.disableTime && (
                <Field className="w-32">
                    <FieldLabel>Time</FieldLabel>
                    <Input
                        type="time"
                        value={props.time}
                        onChange={(e) => props.setTime(e.target.value)}
                    />
                </Field>
            )}
        </FieldGroup>
    );
}
