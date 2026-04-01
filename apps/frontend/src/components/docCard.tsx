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

type documentCardProps = {
    name: string
}

function DocumentCard(props: documentCardProps) {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    return (
            <Card className= "m-4 h-40 w-60 bg-background rounded-x1 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer p-3" >

                <div className="flex items p-1">

                        <div className="flex flex-col">
                            <div className="w-50 h-15 bg-gray-300 rounded-md" />

                            <div className="text-lg font-semibold text-primary">
                                {props.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                <p>Last Modified: {formattedDate}</p>
                            </div>

                        <div className="flex justify-end">
                            <ContactForm
                                type="Edit"
                                currentName="Document Name"
                                currentURL="www.something.com"
                                currentContentOwner="Bobby Tanner"
                                currentRole="Business Analyst"
                                currentExpirationDate={new Date()}
                                currentExpirationTime="07:30:00"
                                currentStatus="In Progress"
                                size={false}
                            />

                    </div>

                </div>


               </div>


            </Card>
    )
}

export default DocumentCard;