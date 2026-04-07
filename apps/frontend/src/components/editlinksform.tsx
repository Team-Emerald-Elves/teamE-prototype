import { Button } from './ui/button.tsx'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Field, FieldGroup} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type addlinksformProps ={
    type: string,
    name: string,
    link: string,
    description: string,
    size: boolean

}
function AddLinksForm(props: addlinksformProps){
    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="outline" className={props.size ? "px-6 py-3.5 text-lg bg-secondary text-secondary-foreground": "px-4 py-3 text-base bg-secondary text-secondary-foreground"} >{props.type}</Button>} />
                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-mono font-bold">{props.type} Content</DialogTitle>
                            <Button variant="outline" size="lg" className="bg-primary text-primary-foreground">Clear</Button>
                        </div>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name" className="text-base">Name</Label>
                            <Input id="name" name="name" placeholder={props.name} />
                        </Field>
                        <Field>
                            <Label htmlFor="link" className="text-base">URL</Label>
                            <Input id="link" name="link" placeholder={props.link} />
                        </Field>
                        <Field>
                            <Label htmlFor="description" className="text-base">Description</Label>
                            <Input id="description" name="description" placeholder={props.description} />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="outline" size="lg">Cancel</Button>} />
                        <Button type="submit" className=" bg-secondary text-secondary-foreground" size="lg">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    )
}

export default AddLinksForm;