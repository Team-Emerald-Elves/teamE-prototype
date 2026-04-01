
import { Button } from './ui/button.tsx'
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
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Field, FieldContent, FieldGroup, FieldLabel} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import DateAndTime from './date.tsx'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"


// i. Name of hyperlink or document - input
// ii. URL of link - input
// iii. Content owner - selector (list of employees)
// iv. Job Position (Persona) that this hyperlink or document is for. We will begin with
//     two job positions – the underwriter and the business analyst. Personas are
// provided for both positions. Research on the web to find out more concerning
// what an insurance writer is and does. - selector (js underwriter and business analyst for now)
//     v. Last modified date - will just say today
// vi. Expiration date of the link/document - date input??
// vii. Whether it is reference content or workflow content - radio buttons
// viii. Document status – make a guess as to what statuses they might have - selector
type contentFormProps = {
    type: string,
    currentName: string,
    currentURL: string,
    currentContentOwner: string,
    currentRole: string,
    currentExpirationDate: Date | undefined,
    currentExpirationTime: string,
    currentStatus: string,
}
function ContentForm(props: contentFormProps) {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="outline">{props.type} Content</Button>} />
                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{props.type} Content</DialogTitle>
                        <DialogDescription>
                            Fill in the fields below to {props.type.toLowerCase()} content.
                        </DialogDescription>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name">Name of Link or Document</Label>
                            <Input id="name" name="name" placeholder={props.currentName} />
                        </Field>
                        <Field>
                            <Label htmlFor="url">URL</Label>
                            <Input id="url" name="url" placeholder={props.currentURL} />
                        </Field>
                        <Field>
                            <Label htmlFor="contentOwner">Select Content Owner</Label>
                            <Select id="contentOwner">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentContentOwner}/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Employees</SelectLabel>
                                        <SelectItem value="userID1">Bob Tanner</SelectItem>
                                        <SelectItem value="userID2">Aimee Tally</SelectItem>
                                        <SelectItem value="userID3">Dolly Readner</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="role">Select Role Associated with Content</Label>
                            <Select id="role">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentRole} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="Underwriter">Underwriter</SelectItem>
                                        <SelectItem value="BusinessAnalyst">BusinessAnalyst</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field>
                            <Label htmlFor="contentType" >Select Content Type</Label>
                            <RadioGroup className="w-full max-w-48" id="contentType">
                                <RadioGroupItem value="workflow" id="workflow"></RadioGroupItem>
                                <FieldContent>
                                    <FieldLabel htmlFor="workflow">Workflow</FieldLabel>
                                </FieldContent>
                                <RadioGroupItem value="reference" id="reference"></RadioGroupItem>
                                <FieldContent>
                                    <FieldLabel htmlFor="reference">Reference</FieldLabel>
                                </FieldContent>
                            </RadioGroup>
                        </Field>
                        <Field>
                            <Label htmlFor="expiration">Choose Expiration Date</Label>
                            <DateAndTime id="expiration" date={props.currentExpirationDate} time={props.currentExpirationTime}/>
                        </Field>
                        <Field>
                            <Label htmlFor="status">Select Current Status</Label>
                            <Select id="status">
                                <SelectTrigger className="w-full max-w-48">
                                    <SelectValue placeholder={props.currentStatus} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Status</SelectLabel>
                                        <SelectItem value="NotStarted">Not Started</SelectItem>
                                        <SelectItem value="InProgress">In Progress</SelectItem>
                                        <SelectItem value="Needs Review">Needs Review</SelectItem>
                                        <SelectItem value="Done">Done</SelectItem>
                                        <SelectItem value="Expired">Expired</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                    <p>Last Modified: {formattedDate}</p>

                    <DialogFooter>
                        <DialogClose render={<Button variant="outline">Cancel</Button>} />
                        <Button type="submit">Submit</Button>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    )
}
export default ContentForm;