
import { Button } from './ui/button.tsx'
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Field, FieldContent, FieldGroup, FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DateAndTime from './date.tsx'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


type contentFormProps = {
    type: string,
    currentName: string,
    currentURL: string,
    currentContentOwner: string,
    currentRole: string,
    currentExpirationDate: Date | undefined,
    currentExpirationTime: string,
    currentStatus: string,
    size: boolean
}

type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    username: string;
    email?: string;
    roles?: string[];
};

async function getEmployees() {
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`);

    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    const data = await res.json();

    return data;
}

function ContentForm(props: contentFormProps) {
    const now = new Date();
    const formattedDate = now.toLocaleString();

    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        getEmployees()
            .then(setEmployees)
            .catch(console.error);
    }, []);



    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="outline" className={props.size ? "px-6 py-3.5 text-lg bg-secondary text-secondary-foreground": "px-4 py-3 text-base bg-secondary text-secondary-foreground"} >{props.type}</Button>} />
                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-mono font-bold">{props.type} Content</DialogTitle>
                            <Button variant="outline" size="lg" className="bg-primary text-primary-foreground">Clear</Button>
                        </div>

                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name" className="text-base">Name of Link or Document</Label>
                            <Input id="name" name="name" placeholder={props.currentName} />
                        </Field>
                        <Field>
                            <Label htmlFor="url" className="text-base">URL</Label>
                            <Input id="url" name="url" placeholder={props.currentURL} />
                        </Field>
                        <Field>
                            <Label htmlFor="contentOwner" className="text-base">Select Content Owner</Label>
                            <Select id="contentOwner">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentContentOwner}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Employees</SelectLabel>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.first_name} {emp.last_name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="role" className="text-base">Select Role Associated with Content</Label>
                            <Select id="role">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentRole} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="Underwriter">Underwriter</SelectItem>
                                        <SelectItem value="BusinessAnalyst">BusinessAnalyst</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="contentType" className="text-base">Select Content Type</Label>
                            <RadioGroup className="w-full max-w-48 flex items-center gap-7" id="contentType">
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="workflow" id="workflow"></RadioGroupItem>
                                    <FieldContent>
                                        <FieldLabel htmlFor="workflow">Workflow</FieldLabel>
                                    </FieldContent>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem value="reference" id="reference"></RadioGroupItem>
                                    <FieldContent>
                                        <FieldLabel htmlFor="reference">Reference</FieldLabel>
                                    </FieldContent>
                                </div>
                            </RadioGroup>
                        </Field>
                        <Field>
                            <Label htmlFor="expiration" className="text-base">Choose Expiration Date</Label>
                            <DateAndTime id="expiration" date={props.currentExpirationDate} time={props.currentExpirationTime}/>
                        </Field>
                        <Field>
                            <Label htmlFor="status" className="text-base">Select Current Status</Label>
                            <Select id="status">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentStatus} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="NotStarted">Not Started</SelectItem>
                                        <SelectItem value="InProgress">In Progress</SelectItem>
                                        <SelectItem value="Needs Review">Needs Review</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                        <SelectItem value="Expired">Expired</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <p>Last Modified: {formattedDate}</p>

                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" size="lg">Cancel</Button>} />
                        <Button type="submit" className=" bg-secondary text-secondary-foreground" size="lg">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    )
}
export default ContentForm;