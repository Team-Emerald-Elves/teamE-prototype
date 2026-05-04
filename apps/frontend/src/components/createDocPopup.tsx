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
import { Edit03Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import ContentForm from "./contentForm";
import { Button } from "./ui/button";
import { type Document } from "../../../../packages/database/lib/prismadefs.ts";
import SubmitConfirmationPopup from "./submitPopupConfirmation";

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

function DocPopup(props: DocPopupProps): ReactElement {
    const [open, setOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormDataType[]>([]);
    const [forms, setForms] = useState<ReactElement[]>([]);
    const [confirmOpen, setConfirmOpen] = useState<boolean>(false);

    useEffect(() => {
        addForm();
    }, []);


    function addForm() {
        setForms((prev) => prev.concat(<ContentForm type={props.type} />))
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
                    {forms}
                    <DialogFooter>
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
