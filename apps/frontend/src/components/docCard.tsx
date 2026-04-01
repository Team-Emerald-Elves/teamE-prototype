import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {cn} from "@/lib/utils.ts";

function DocumentCard() {
    return (
        <>
            <Card>
                <CardTitle>Document Name</CardTitle>
                <CardDescription>
                    <p>Document description</p>
                </CardDescription>
            </Card>
        </>
    )
}

export default DocumentCard;