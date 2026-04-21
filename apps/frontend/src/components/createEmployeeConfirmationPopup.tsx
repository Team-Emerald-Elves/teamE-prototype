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


type CreateConfirmationPopupProps = {
    onConfirm: () => void
}


export function CreateConfirmationPopup({ onConfirm }: CreateConfirmationPopupProps) {
    return (
        <Dialog>
            <DialogTrigger
                render={
                    <Button className="bg-secondary text-background p-3">
                        Submit
                    </Button>
                }
            />
            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle>Are you sure?</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-muted-foreground">
                    Are you sure you want to create this employee?
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


export default CreateConfirmationPopup