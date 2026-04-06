import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import EditLinksForm from "@/components/editlinksform.tsx";
import { Button } from './ui/button.tsx'

type documentCardProps = {
    name: string
    description: string
}

function LinkCard(props: documentCardProps) {
    return (
        <Card className= "m-4 h-20 w-200 bg-background rounded-x1 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer p-4" >

            <div className="flex items p-3">

                <div className="flex flex-row items-center">

                    <div className="text-lg font-semibold font-serif text-primary truncate pr-8">
                        {props.name}
                    </div>
                    <div className="text-xs text-gray-500 pr-100">
                        <p>{props.description}</p>
                    </div>


                    <div className="flex pr-2">
                        <EditLinksForm
                            type="Edit"
                            name="Document Name"
                            link="www.something.com"
                            description="Bobby Tanner"
                            size={false}
                        />
                    </div>
                    <div className="text-base bg-destructive text-secondary-foreground">
                        <Button variant="outline">Delete</Button>
                    </div>

                </div>
            </div>
        </Card>
    )
}

export default LinkCard;