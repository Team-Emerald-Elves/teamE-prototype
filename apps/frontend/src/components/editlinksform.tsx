import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit03Icon } from 'hugeicons-react';

type editlinksformProps ={
    type: string,
    name: string,
    link: string,
    description: string,
    size: boolean

}

export function Editlinksform(props: editlinksformProps) {
    return (
        <Dialog>
            <form>
                <DialogTrigger asChild>
                    <Button variant = "outline" size = "icon">
                        <Edit03Icon size={20} />
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Edit Link</DialogTitle>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name-1">Name</Label>
                            <Input id="name-1" name="name" defaultValue={props.name} />
                        </Field>
                        <Field>
                            <Label htmlFor="URL">URL</Label>
                            <Input id="URL" name="URL" defaultValue={props.link} />
                        </Field>
                        <Field>
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" defaultValue={props.description} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" className=" bg-secondary text-secondary-foreground">Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    )
}

export default Editlinksform
