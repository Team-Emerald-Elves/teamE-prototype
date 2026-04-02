import '../app.css'

import { Button } from './ui/button.tsx'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {Field, FieldGroup} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


function EmployeeForm() {
    return (
            <form>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="fname" className="">First Name:</Label>
                            <Input id="fname" name="fname" placeholder="First Name" />
                        </Field>
                        <Field>
                            <Label htmlFor="lname">Last Name:</Label>
                            <Input id="lname" name="lname" placeholder="Last Name" />
                        </Field>
                        <Field>
                            <Label htmlFor="user">Username</Label>
                            <Input id="user" name="user" placeholder="Username" />
                        </Field>
                        <Field>
                            <Label htmlFor="employeeId">Employee ID:</Label>
                            <Input id="employeeId" name="employeeId" placeholder="Employee ID" />
                        </Field>
                        <Field>
                            <Label htmlFor="email">Email: </Label>
                            <Input id="email" name="email" placeholder="Email" />
                        </Field>
                        <Field>
                            <Label htmlFor="contentOwner">Select Roles:</Label>
                            <Select id="contentOwner">
                                <SelectTrigger>
                                    <SelectValue placeholder=""/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="Business Analyst">Business Analyst</SelectItem>
                                        <SelectItem value="Underwriter">Underwriter</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>
                <br></br>
                <Button type="submit">Submit</Button>
            </form>

    )
}
export default EmployeeForm;
