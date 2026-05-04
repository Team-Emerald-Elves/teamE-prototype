import { useEffect, useState, type ReactElement } from "react";
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"
import { Edit03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ContentForm from "./contentForm";
import { Button } from "./ui/button";
import { type Document, type Employee } from "../../../../packages/database/lib/prismadefs.ts";
import SubmitConfirmationPopup from "./submitPopupConfirmation";
import qmgr from "@/lib/querymgr.ts";
import FileUpload from "./fileUpload.tsx";

type DocPopupProps = {
    type: string;
    size: boolean;
    defaults: Partial<Document>;
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

const EMPTY_FORM: FormDataType = {
    name: "",
    url: "",
    contentOwner: "5c129c4b-658f-47c1-9afb-e28734f66e46",
    role: "",
    document_type: "",
    expirationDate: new Date(),
    expirationTime: "10:30",
    document_status: "",
    id: 0,
}


function DocPopup(props: DocPopupProps): ReactElement {
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormDataType[]>([]);
    const [forms, setForms] = useState<ReactElement[]>([]);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);
    const [me, setMe] = useState<Employee>()

    useEffect(() => {
        qmgr.wait(() => {
            qmgr.getMe((res) => {
                if (!res.success) {
                    return;
                }
                setMe(res.data)
            })
        })
    }, [])


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
        files.forEach(async (file: File) => {
            const data = await toBase64(file);
            addFile(file.name, data);
        })
    };

    function updateForm(index: number, data: FormDataType) {
        setFormData((prev) => prev.map((f, i) => i === index ? data : f));
    }

    function addFile(name: string, payload: string) {
        const newForm: FormDataType = {
            id: 0,
            name: name,
            fileName: name,
            filePayload: payload,
            url: "Local upload",
            contentOwner: me?.id ?? "",
            role: (me?.roles[0] ?? "") as string,
            document_type: "Reference",
            expirationDate: new Date(),
            expirationTime: "10:30",
            document_status: "not_started",
            
        }
        setFormData((prev) => [...prev, newForm]);
    }

    function removeForm(index: number) {
        setFormData((prev) => prev.filter((_, i) => i !== index));
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
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
                        asChild
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
                        asChild
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
                    <Accordion defaultValue={["form-0"]}>
                        {formData.map((fd, i) => (
                            <AccordionItem key={i} value={`form-${i}`}>
                                <AccordionTrigger>
                                    {fd.name || `Document ${i + 1}`}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ContentForm
                                        type={props.type}
                                        formData={fd}
                                        onChange={(data) => updateForm(i, data)}
                                        roles={me?.roles ?? []}
                                    />
                                    {formData.length > 1 && (
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="mt-2 text-red-500"
                                            onClick={() => removeForm(i)}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                    <DialogFooter>
                        <FileUpload dnd={true} show={true} onUpload={uploadHandler} />
                        <DialogClose
                            render={
                                <Button variant="outline" size="lg">
                                    Cancel
                                </Button>
                            }
                            asChild
                        />
                        <Button
                            type="button"
                            size="lg"
                            className="bg-secondary text-secondary-foreground"
                            disabled={!open}
                            onClick={() => setConfirmOpen(true)}
                        >
                            Submit
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
            {open && (
                <SubmitConfirmationPopup
                    formData={formData}
                    type={props.type}
                    open={setOpen}
                    confirmOpen={confirmOpen}
                    setConfirmOpen={setConfirmOpen}
                    disabled={!open}
                />
            )}
        </>
    );
}

export default DocPopup;
