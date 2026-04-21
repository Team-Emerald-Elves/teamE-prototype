
"use client"

import * as React from "react"
import { format } from "date-fns"
//import { ChevronDownIcon } from "mira-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

import type { DateAndTimeProps } from './types/date.d.ts'

export default function DateAndTime(props: DateAndTimeProps) {
    const [open, setOpen] = React.useState(false)
    const [date, setDate] = React.useState<Date | undefined>(props.date)

    return (
        <FieldGroup className=" max-w-xs flex flex-row " id={props.id}>
            <Field >
                <FieldLabel htmlFor="date-picker-optional">Date</FieldLabel>
                <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger>
                        <Button
                            variant="outline"
                            id="date-picker-optional"
                            className="w-50 justify-between bg-background font-normal"
                        >
                            {date ? format(date, "PPP") : "Select Date"}
                            {/*<ChevronDownIcon />*/}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            captionLayout="dropdown"
                            defaultMonth={date}
                            onSelect={(date) => {
                                setDate(date)
                                setOpen(false)
                            }}
                        />
                    </PopoverContent>
                </Popover>
            </Field>
            {!props.disableTime && (
            <Field className="w-32">
               <FieldLabel htmlFor="time-picker-optional">Time</FieldLabel>
                <Input
                    type="time"
                    id="time-picker-optional"
                    step="1"
                    defaultValue={props.time}
                    className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                />

            </Field>
            )}
        </FieldGroup>
    )
}
