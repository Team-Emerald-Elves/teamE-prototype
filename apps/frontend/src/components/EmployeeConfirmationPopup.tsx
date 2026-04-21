import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"


type ConfirmationPopupProps = {
    onConfirm: () => void
    triggerLabel?: string
}


export function ConfirmationPopup({ onConfirm, triggerLabel }: ConfirmationPopupProps) {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button className="bg-secondary text-background p-3">
                        {triggerLabel}
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to continue?
                </p>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline">Cancel</Button>} />
                    <DialogClose
                        render={
                            <Button type="submit" onClick={onConfirm}>
                                Confirm
                            </Button>
                        }
                    />
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}


export default ConfirmationPopup