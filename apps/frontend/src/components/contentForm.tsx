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
import SubmitConfirmationPopup from "@/components/submitPopupConfirmation.tsx";
import { useAuth } from '@clerk/react'

type contentFormProps = {
    type: string,
    currentName: string,
    currentURL: string,
    currentContentOwner: string,
    currentRole: string,
    currentExpirationDate: string,
    currentExpirationTime: string,
    currentStatus: string,
    currentID: number,
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

type FormDataType = {
    name: string,
    url: string,
    contentOwner: string,
    role: string,
    contentType: string,
    expirationDate: Date | undefined,
    expirationTime: string,
    status: string,
    id: number,
};

async function getEmployees(sessionToken: string) {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`, {
        headers: {
            Authorization: `Bearer ${sessionToken}`,
        }
    });

    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    const data = await res.json();

    return data;
}

function ContentForm(props: contentFormProps) {

    const { getToken } = useAuth();

    const now = new Date();
    const formattedDate = now.toLocaleString();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formData, setFormData] = useState<FormDataType>({
        name: props.currentName ?? "",
        url: props.currentURL ?? "",
        contentOwner: props.currentContentOwner ?? "",
        role: props.currentRole ?? "",
        contentType: "",
        expirationDate: undefined,
        expirationTime: props.currentExpirationTime ?? "",
        status: props.currentStatus ?? "",
        id: props.currentID,
    });

    useEffect(() => {

        getToken().then( token => {
            console.log(token);
        getEmployees(token as string)
            .then(setEmployees)
            .catch(console.error)
        })
    }, []);



    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="outline" className={props.size ? "px-6 py-3.5 text-lg bg-secondary text-secondary-foreground": "px-4 py-3 text-base bg-secondary text-secondary-foreground"} >{props.type}</Button>} />
                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-sans font-bold">{props.type} Content</DialogTitle>

                        </div>

                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label htmlFor="name" className="text-xs font-bold">Name of Link or Document</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder={props.currentName}
                                    value={formData.name}
                                    onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                />
                            </Field>
                            <Field>
                                <Label htmlFor="url" className="text-xs font-bold">URL</Label>
                                <Input
                                    id="url"
                                    name="url"
                                    placeholder={props.currentURL}
                                    value={formData.url}
                                    onChange={(e) => setFormData(prev => ({...prev, url: e.target.value}))}
                                />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">

                            <Field>
                                <Label htmlFor="contentOwner" className="text-xs font-bold">Select Content Owner</Label>
                                <Select
                                    value={formData.contentOwner}
                                    onValueChange={(value) => setFormData(prev => ({...prev, contentOwner: value!}))}
                                >
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
                                <Label htmlFor="role" className="text-xs font-bold">Select Role For Content</Label>
                                <Select
                                    value={formData.role}
                                    onValueChange={(value) => setFormData(prev => ({...prev, role: value!}))}
                                >
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder={props.currentRole}/>
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
                        </div>
                        <Field>
                            <Label htmlFor="contentType" className="text-xs font-bold">Select Content Type</Label>
                            <RadioGroup
                                className="w-full max-w-48 flex items-center gap-7"
                                id="contentType"
                                value={formData.contentType}
                                onValueChange={(value) => setFormData(prev => ({...prev, contentType: value}))}
                            >
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
                            <Label htmlFor="expiration" className="text-xs font-bold">Choose Expiration Date</Label>
                            <DateAndTime
                                id="expiration"
                                date={formData.expirationDate}
                                time={formData.expirationTime}
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="status" className="text-xs font-bold">Select Current Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value) => setFormData(prev => ({...prev, status: value!}))}
                            >
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentStatus}/>
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
                        <Button variant="outline" size="lg" className=" relative bg-primary text-primary-foreground">Clear</Button>
                        <DialogClose render={<Button variant="outline" size="lg">Cancel</Button>} />
                        <SubmitConfirmationPopup formData={formData} type={props.type}/>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    )
}
export default ContentForm;