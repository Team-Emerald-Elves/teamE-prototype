import { Button } from './ui/button.tsx'
type AddEventButtonProps = {
    setOpen: (open: boolean) => void;
};

export default function AddEventButton({ setOpen }: AddEventButtonProps) {
    return (
        <Button onClick={() => setOpen(true)}>
            Add Event
        </Button>
    );
}