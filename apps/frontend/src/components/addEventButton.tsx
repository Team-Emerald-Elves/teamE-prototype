import { Button } from "./ui/button.tsx";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
type AddEventButtonProps = {
    setOpen: (open: boolean) => void;
};

export default function AddEventButton({ setOpen }: AddEventButtonProps) {
    return (
        <Button
            variant="outline"
            className="px-5 py-3.5 text-md bg-[#5f935a] text-secondary-foreground"
            onClick={() => setOpen(true)}
        >
            <HugeiconsIcon icon={PlusSignIcon} /> Add Event
        </Button>
    );
}
