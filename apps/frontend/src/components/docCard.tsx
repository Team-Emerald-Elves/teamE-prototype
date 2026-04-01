import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import ContactForm from './contentForm.tsx'
import {cn} from "@/lib/utils.ts";

function DocumentCard() {
    return (
        <>
            <Card>
                <CardTitle>Document Name</CardTitle>
                <CardDescription>
                    <p>Document description</p>
                </CardDescription>
                <CardFooter>
                    <ContactForm
                        type="Edit"
                        currentName="Document Name"
                        currentURL="www.something.com"
                        currentContentOwner="Bobby Tanner"
                        currentRole="Business Analyst"
                        currentExpirationDate={new Date()}
                        currentExpirationTime="07:30:00"
                        currentStatus="In Progress"
                        />
                </CardFooter>
            </Card>
        </>
    )
}

export default DocumentCard;