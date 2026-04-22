import { Button } from './ui/button.tsx'
import {useEffect, useState} from "react";
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
import {useAuth, useUser} from '@clerk/react'
import {Edit03Icon, PlusSignIcon} from "@hugeicons/core-free-icons";
import {HugeiconsIcon} from "@hugeicons/react";
import FileUpload from "./fileUpload.tsx";

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
    size: boolean,
    lock: string,
    refresh?: () => void,
}

type Employee = {
    id: string;
    first_name: string
    last_name: string
    username: string
    email?: string
    roles?: string[]
};

type FormDataType = {
    name: string
    url: string
    contentOwner: string
    role: string
    document_type: string
    expirationDate: Date | undefined
    expirationTime: string
    document_status: string
    id: number
    filePayload?: string
    fileName?: string
};


async function getEmployees(sessionToken: string) {

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/employee`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({})
    });

    if (!res.ok) {
        throw new Error("Failed to fetch employees");
    }
    const data = await res.json();

    return data;
}


function ContentForm(props: contentFormProps) {

    const [roles, setRoles] = useState<string[]>([]);
    const {user} = useUser()
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
            setRoles((data.roles as string[]))
            console.log("Full response data:", data);

        }

        load();
    }, [getToken,isSignedIn]);





    const now = new Date();
    const formattedDate = now.toLocaleString();

    const [employees, setEmployees] = useState<Employee[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormDataType>({
        name: props.currentName ?? "",
        url: props.currentURL ?? "",
        contentOwner: props.currentContentOwner ?? "",
        role: props.currentRole ?? "",
        document_type: "",
        expirationDate: undefined,
        expirationTime: props.currentExpirationTime ?? "",
        document_status: props.currentStatus ?? "",
        id: props.currentID,
    });

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve((reader.result as string).split(",")[1]); // strip data URL prefix
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });

    const uploadHandler = (files: File[]) => {
        if (!files || files.length < 1) {
            console.error("Invalid file input");
            return;
        }
        toBase64(files[0]).then(
            (data) => {
                setFormData((prev => ({...prev, filePayload: data, fileName: files[0].name})));
            }, (err) => {
                console.error(err);
            }
        )
    }

    useEffect(() => {

        getToken().then( token => {
            console.log(token);
        getEmployees(token as string)
            .then(setEmployees)
            .catch(console.error)
        })
    }, []);

    const [sessionToken, setSessionToken] = useState("")

    useEffect(() => {
        getToken().then(t => setSessionToken(t ?? ""))
    }, [getToken])

    const isAdmin = roles.some(role =>
        role.toLowerCase().startsWith("admin")
    );
    //console.log(isAdmin);
    useEffect(() => {
        if(!isAdmin && roles.length >0 ){
            roles.some(role => setFormData(prev => ({...prev, role: role})))

        }
    }, [isAdmin,roles]);
    useEffect(() => {
        console.log("Current roles:", roles);
    }, [roles]);
    if (!sessionToken ) return;



    return (
        <Dialog open={open} onOpenChange={setOpen} >
            <form>

                {props.size ?
                    <DialogTrigger render={<Button variant="outline" className= "px-5 py-3.5 text-md bg-[#5f935a] text-secondary-foreground" ><HugeiconsIcon icon={PlusSignIcon} /> {props.type}</Button>} />
                    :
                    <DialogTrigger render={<Button variant="outline" size="icon" className="px-4 py-3 text-base bg-gray-300 text-black" ><HugeiconsIcon icon={Edit03Icon} size={20} /></Button>} />
                }


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
                                    onValueChange={(value) =>{ setFormData(prev => ({...prev, contentOwner: value!}))}}
                                >
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder={props.currentContentOwner}/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Employees</SelectLabel>
                                            {employees.map((emp) => (
                                                <SelectItem key={emp.id} value={String(emp.id)}>
                                                    {emp.first_name} {emp.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>

                            {isAdmin ? (
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
                            ): null}
                        </div>
                        <Field>
                            <Label htmlFor="contentType" className="text-xs font-bold">Select Content Type</Label>
                            <RadioGroup
                                className="w-full max-w-48 flex items-center gap-7"
                                id="contentType"
                                value={formData.document_type}
                                onValueChange={(value) => setFormData(prev => ({...prev, document_type: value}))}
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
                                value={formData.document_status}
                                onValueChange={(value) => setFormData(prev => ({...prev, document_status: value!}))}
                            >
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentStatus} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="not_started">Not Started</SelectItem>
                                        <SelectItem value="in_progress">In Progress</SelectItem>
                                        <SelectItem value="needs_review">Needs Review</SelectItem>
                                        <SelectItem value="done">Done</SelectItem>
                                        <SelectItem value="expired">Expired</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <FileUpload dnd={true} show={true} onUpload={uploadHandler}/>

                    <p>Last Modified: {formattedDate}</p>

                    <DialogFooter>
                        <Button variant="outline" size="lg" className=" relative bg-primary text-primary-foreground">Clear</Button>
                        <DialogClose render={<Button variant="outline" size="lg">Cancel</Button>} />
                        <SubmitConfirmationPopup formData={formData} type={props.type} refresh={props.refresh} open={setOpen} />
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    )
}
export default ContentForm;