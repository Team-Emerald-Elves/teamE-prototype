import { Card } from "@/components/ui/card";
import ContentForm from "./contentForm.tsx";
import DeleteConfirmationPopup from "./deletePopupConfirmation.tsx";
import type { documentContent } from "@repo/database/types";

type documentCardProps = {
    document: documentContent;
    name: string;
    type: string;
};

function DocumentCard(props: documentCardProps) {
    const now = new Date();
    const formattedDate = now.toLocaleString();
    return (
        <Card className="m-4 h-45 w-68 bg-background rounded-x1 shadow-xl hover:shadow-2xl transition-all duration-200 cursor-pointer p-4">
            <div className="flex items p-1">
                <div className="flex flex-col min-w-0">
                    <div className="w-50 h-15 bg-gray-300 rounded-md" />

                    <div className="text-lg font-semibold font-serif text-primary truncate w-full">
                        {props.document!.name}
                    </div>
                    <div className="text-xs text-gray-500 font-serif">
                        <p>Last Modified: {formattedDate}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                        <p>{props.type}</p>
                    </div>

                    <div className="flex justify-end">
                        <ContentForm
                            type="Edit"
                            currentName={props.document.name}
                            currentURL={props.document.url as string}
                            currentContentOwner="Bobby Tanner"
                            currentRole="Underwriter"
                            currentExpirationDate={
                                props.document.expiration_date
                            }
                            currentExpirationTime="07:30:00"
                            currentStatus="In Progress"
                            currentID={props.document.id}
                            size={false}
                        />

                        <DeleteConfirmationPopup target={props.document} />
                    </div>
                </div>
            </div>
        </Card>
    );
}

export default DocumentCard;
