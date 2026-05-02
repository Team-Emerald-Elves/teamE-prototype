import { Button } from "./ui/button.tsx";
import { useEffect, useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Field,
    FieldContent,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DateAndTime from "./date.tsx";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import SubmitConfirmationPopup from "@/components/submitPopupConfirmation.tsx";
import { useAuth } from "@clerk/react";
import { Edit03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import FileUpload from "./fileUpload.tsx";
import qmgr from "@/lib/querymgr.ts";
import type { Employee } from "@/../../packages/database/lib/prismadefs.ts";

type contentFormProps = {
    type: string;
    currentName: string;
    currentURL: string;
    currentContentOwner: string;
    currentRole: string;
    currentExpirationDate: Date;
    currentExpirationTime: string;
    currentStatus: string;
    currentID: number;
    size: boolean;
    lock: string;
    refresh?: (any: any) => void;
    roles: string[];
};

type FormDataType = {
    name: string;
    url: string;
    contentOwner: string;
    role: string;
    document_type: string;
    expirationDate: Date | undefined;
    expirationTime: string;
    document_status: string;
    id: number;
    filePayload?: string;
    fileName?: string;
};

function ContentForm(props: contentFormProps) {
    const { getToken } = useAuth();
    const now = new Date();
    const formattedDate = now.toLocaleString();
    const ROLE_LABELS: Record<string, string> = {
        administrator: "Administrator",
        businessanalyst: "BusinessAnalyst",
        underwriter: "UnderWriter",
        businessoperator: "BusinessOperator",
        exceloperator: "ExcelOperator",
        actuarialanalyst: "ActuarialAnalyst",
    };
    const currentRole = ROLE_LABELS[props.roles.at(0) as string];
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [isFilled, setIsFilled] = useState<boolean>(false);
    console.log()

    const [formData, setFormData] = useState<FormDataType>({
        name: props.currentName ?? "",
        url: props.currentURL ?? "",
        contentOwner: "5c129c4b-658f-47c1-9afb-e28734f66e46",
        role: props.currentRole === "Select Role" ? props.currentRole : ROLE_LABELS[props.currentRole],
        document_type: "",
        expirationDate: props.currentExpirationDate ?? "",
        expirationTime: props.currentExpirationTime ?? "",
        document_status: props.currentStatus ?? "",
        id: props.currentID,
    });

    useEffect(() => {
        if (
            formData.name &&
            formData.url &&
            formData.contentOwner &&
            formData.role &&
            formData.document_type &&
            formData.document_status &&
            formData.expirationDate &&
            formData.expirationTime
        ) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [formData]);

    const toBase64 = (file: File): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
                resolve((reader.result as string).split(",")[1]); // strip data URL prefix
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
                setFormData((prev) => ({
                    ...prev,
                    filePayload: data,
                    fileName: files[0].name,
                }));
            },
            (err) => {
                console.error(err);
            },
        );
    };

    useEffect(() => {
        qmgr.wait(async () => {
            qmgr.getEmployees(async (res) => {
                if (!res.success) {
                    console.error(res.error);
                }
                setEmployees(res.data!);
            });
        });
    }, []);

    const [sessionToken, setSessionToken] = useState("");

    useEffect(() => {
        getToken().then((t) => setSessionToken(t ?? ""));
    }, [getToken]);

    const isAdmin = props.roles.some((role) =>
        role.toLowerCase().includes("administrator"),
    );
    //console.log(isAdmin);
    // useEffect(() => {
    //     if(!isAdmin && props.roles.length >0 ){
    //         props.roles.some(role => setFormData(prev => ({...prev, role: role})))
    //
    //     }
    // }, [isAdmin]);
    if (!sessionToken) return;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <form>
                {props.size ? (
                    <DialogTrigger
                        render={
                            <Button
                                variant="outline"
                                className="px-5 py-3.5 text-md bg-[#5f935a] text-secondary-foreground"
                            >
                                <HugeiconsIcon icon={PlusSignIcon} />{" "}
                                {props.type}
                            </Button>
                        }
                    />
                ) : (
                    <DialogTrigger
                        render={
                            <Button
                                variant="outline"
                                size="icon"
                                className="px-4 py-3 text-base bg-gray-300 text-black"
                            >
                                <HugeiconsIcon icon={Edit03Icon} size={20} />
                            </Button>
                        }
                    />
                )}

                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-sans font-bold">
                                {props.type} Content
                            </DialogTitle>
                        </div>
                    </DialogHeader>
                    <FieldGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label
                                    htmlFor="name"
                                    className="text-xs font-bold"
                                >
                                    Name of Link or Document
                                </Label>
                                <Input
                                    id="name"
                                    name="name"
                                    placeholder="Name..."
                                    value={formData.name}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                />
                            </Field>
                            <Field>
                                <Label
                                    htmlFor="url"
                                    className="text-xs font-bold"
                                >
                                    URL
                                </Label>
                                <Input
                                    id="url"
                                    name="url"
                                    placeholder="https://www.example.com"
                                    value={formData.url}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            url: e.target.value,
                                        }))
                                    }
                                />
                            </Field>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <Field>
                                <Label
                                    htmlFor="contentOwner"
                                    className="text-xs font-bold"
                                >
                                    Select Content Owner
                                </Label>
                                <Select
                                    value={
                                        employees.find(
                                            (u) =>
                                                u.id === formData.contentOwner,
                                        )
                                            ? employees.find(
                                                  (u) =>
                                                      u.id ===
                                                      formData.contentOwner,
                                              )!.first_name +
                                              " " +
                                              employees.find(
                                                  (u) =>
                                                      u.id ===
                                                      formData.contentOwner,
                                              )!.last_name
                                            : "Select"
                                    }
                                    onValueChange={(value) => {
                                        setFormData((prev) => ({
                                            ...prev,
                                            contentOwner: value!,
                                        }));
                                        console.log(
                                            "content owner: " +
                                                formData.contentOwner,
                                        );
                                        console.log("value: " + value);
                                    }}
                                >
                                    <SelectTrigger className="w-full max-w-48">
                                        <SelectValue placeholder="5c129c4b-658f-47c1-9afb-e28734f66e46" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Employees</SelectLabel>
                                            {employees.map((emp) => (
                                                <SelectItem
                                                    key={emp.id}
                                                    value={String(emp.id)}
                                                >
                                                    {emp.first_name}{" "}
                                                    {emp.last_name}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </Field>


                                <Field>
                                    <Label
                                        htmlFor="role"
                                        className="text-xs font-bold"
                                    >
                                        Select Role For Content
                                    </Label>
                                    <Select
                                        value={props.currentRole === "Select Role" ? "Select Role" : ROLE_LABELS[props.currentRole]}
                                        onValueChange={(value) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                role: value!,
                                            }))
                                        }
                                        disabled={!isAdmin}
                                    >
                                        <SelectTrigger className="w-full max-w-48">
                                            <SelectValue
                                                placeholder={props.currentRole === "Select Role" ? "Select Role" : ROLE_LABELS[props.currentRole]}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectGroup>
                                                <SelectLabel>Roles</SelectLabel>
                                                <SelectItem value="UnderWriter">
                                                    Underwriter
                                                </SelectItem>
                                                <SelectItem value="BusinessAnalyst">
                                                    BusinessAnalyst
                                                </SelectItem>
                                                <SelectItem value="BusinessOperator">
                                                    BusinessOperator
                                                </SelectItem>
                                                <SelectItem value="ActuarialAnalyst">
                                                    ActuarialAnalyst
                                                </SelectItem>
                                                <SelectItem value="ExcelOperator">
                                                    ExcelOperator
                                                </SelectItem>
                                            </SelectGroup>
                                        </SelectContent>
                                    </Select>
                                </Field>

                        </div>
                        <Field>
                            <Label
                                htmlFor="contentType"
                                className="text-xs font-bold"
                            >
                                Select Content Type
                            </Label>
                            <RadioGroup
                                className="w-full max-w-48 flex items-center gap-7"
                                id="contentType"
                                value={formData.document_type}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        document_type: value,
                                    }))
                                }
                            >
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem
                                        value="workflow"
                                        id="workflow"
                                    ></RadioGroupItem>
                                    <FieldContent>
                                        <FieldLabel htmlFor="workflow">
                                            Workflow
                                        </FieldLabel>
                                    </FieldContent>
                                </div>
                                <div className="flex items-center gap-3">
                                    <RadioGroupItem
                                        value="reference"
                                        id="reference"
                                    ></RadioGroupItem>
                                    <FieldContent>
                                        <FieldLabel htmlFor="reference">
                                            Reference
                                        </FieldLabel>
                                    </FieldContent>
                                </div>
                            </RadioGroup>
                        </Field>
                        <Field>
                            <Label
                                htmlFor="expiration"
                                className="text-xs font-bold"
                            >
                                Choose Expiration Date
                            </Label>
                            <DateAndTime
                                id="expiration"
                                date={formData.expirationDate}
                                time={formData.expirationTime}
                                setDate={(date) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        expirationDate: date,
                                    }))
                                }
                                setTime={(time) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        expirationTime: time,
                                    }))
                                }
                            />
                        </Field>
                        <Field>
                            <Label
                                htmlFor="status"
                                className="text-xs font-bold"
                            >
                                Select Current Status
                            </Label>
                            <Select
                                value={formData.document_status
                                    .split("_")
                                    .map(
                                        (w) =>
                                            w.charAt(0).toUpperCase() +
                                            w.slice(1),
                                    )
                                    .join(" ")}
                                onValueChange={(value) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        document_status: value!,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue
                                        placeholder={props.currentStatus}
                                    />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="not_started">
                                            Not Started
                                        </SelectItem>
                                        <SelectItem value="in_progress">
                                            In Progress
                                        </SelectItem>
                                        <SelectItem value="needs_review">
                                            Needs Review
                                        </SelectItem>
                                        <SelectItem value="done">
                                            Done
                                        </SelectItem>
                                        <SelectItem value="expired">
                                            Expired
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <FileUpload
                        dnd={true}
                        show={true}
                        onUpload={uploadHandler}
                    />

                    <p>Last Modified: {formattedDate}</p>
                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button variant="outline" size="lg">
                                    Cancel
                                </Button>
                            }
                        />
                        <SubmitConfirmationPopup
                            formData={formData}
                            type={props.type}
                            refresh={props.refresh!}
                            open={setOpen}
                            disabled={!isFilled}
                        />
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}
export default ContentForm;
