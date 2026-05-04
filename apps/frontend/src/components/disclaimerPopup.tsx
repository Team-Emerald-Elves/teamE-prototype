import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

function DisclaimerPopup() {
    const [open, setOpen] = useState(true);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-m">
                <DialogHeader>
                    <DialogTitle className="text-xl">Disclaimer</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center items-center ">
                    <img
                        src="/warning-icon.png"
                        alt="Warning Icon"
                        className="w-2/3 rounded-md"
                        draggable={false}
                    />
                </div>
                <div className="flex justify-center text-center">
                    <p className="text-sm text-muted-foreground">
                        This website has been created for WPI’s CS 3733 Software
                        Engineering as a class project and is not in use by
                        Hanover Insurance.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => setOpen(false)}>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
export default DisclaimerPopup;
