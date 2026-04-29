import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const MANUAL_TABS: ManualTab[] = [
    {
        label: "Dashboard",
        steps: [
            { title: "Favorites", description: "Your <strong>favorites</strong> tab is the first thing you will see. Here you can choose between <strong>documents</strong> and <strong>links</strong>." },
            { title: "Dashboard", description: "Next is your <strong>dashboard</strong>, here you can see <strong>statistics, user activity,</strong> and this week's <strong>calendar</strong>." },
            { title: "Statistics", description: "<strong>Statistics</strong> consist of- number of documents and employees, breakdown of employees and of documents, as well as document hit count." },
            { title: "User Activity", description: "<strong>User activity</strong> tracks recent actions performed by users, including creations, edits, deletes, and more. It's linked to <strong>Notifications</strong> so can always stay up to date. You also get notified when documents are about to expire." },
            { title: "Calendar", description: "You have <strong>calendar</strong> to help you keep track of all documents and their due dates, as well as company events and meetings." },
        ],
    },
    {
        label: "Documents",
        steps: [
            { title: "View/Filter", description: "You can see all documents and relating information on this page. You can also <strong>filter</strong> based on document type, role, file type, tags, status, if files are owned by you." },
            { title: "Tabs", description: "You can easily view documents for different roles, by selecting that roles <strong>tab</strong>." },
            { title: "Create Document", description: "To <strong>Create</strong> a document, click the button and fill out all relating fields. You can also upload files!" },
            { title: "Check In/Out", description: "In order to <strong>edit</strong> and <strong>delete</strong> documents, you must first <strong>checkin</strong>. After you're done, you <strong>checkout</strong> to allow others to do the same." },

        ],
    },
    {
        label: "Links",
        steps: [
            { title: "View/Filter", description: "Similarly to documents, you can see all links and relating information on this page. You can <strong>filter</strong> based on tags" },
            { title: "Tabs", description: "You can easily view links for different roles, by selecting that roles <strong>tab</strong>." },
            { title: "Tags", description: "You can easily add <strong>tags</strong> to links by clicking the plus button." },
            { title: "Create Link", description: "To <strong>create</strong> a link, click on the button and fill out all relating fields." },
            { title: "Check In/Out", description: "In order to <strong>edit</strong> and <strong>delete</strong> links, you must first <strong>checkin</strong>. After you're done, you <strong>checkout</strong> to allow others to do the same." }
        ],
    },
    {
        label: "Calendar",
        steps: [
            { title: "Create Event", description: "To <strong>create events</strong>, click the button and fill out all relating fields." },
            { title: "Due dates", description: "All documents have <strong>due dates</strong>. They appear in the calendar on the day they are due, and are color coded based on employee role." },
            { title: "Details", description: "You can view <strong>details</strong> of the document by clicking, and show all document and event info. It also has a due date indicator if the due date it approaching or far away." },
        ],
    },
    {
        label: "User Management",
        steps: [
            { title: "View/Filter", description:"As an admin, you can see all employees and their related information. You can <strong>filter</strong> based on role."},
            { title: "Create Employees", description:"To <strong>create</strong> an employee, click on the button and fill out all relating fields."},
            { title: "Edit/Delete", description:"To <strong>edit</strong> an employee, click the button and change relating fields. To <strong>delete</strong>, click on the delete button"}
        ]
    }
]

type ManualStep = {
    title: string
    description: string
}

type ManualTab = {
    label: string
    steps: ManualStep[]
}

type ManualPopupProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ManualPopup({ open, onOpenChange }: ManualPopupProps) {
    const [activeTab, setActiveTab] = useState(0)

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent style={{ maxWidth: "1100px", width: "90vw", maxHeight: "650px", minHeight: "650px"}} className="flex flex-col p-0 gap-0">

                {/* Header + Tabs */}
                <DialogHeader className="px-7 pt-6 pb-0 border-b border-border">
                    <DialogTitle className="text-xl mb-1">User Manual</DialogTitle>
                    <p className="text-sm text-muted-foreground mb-3">
                        Follow the steps below to get started.
                    </p>

                    {/* Tab bar */}
                    <div className="flex gap-1">
                        {MANUAL_TABS.map((tab, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveTab(i)}
                                className={[
                                    "px-4 py-2 text-sm rounded-t-md border-b-2 transition-colors",
                                    activeTab === i
                                        ? "border-primary text-primary font-semibold"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted",
                                ].join(" ")}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </DialogHeader>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto px-7 py-6">
                    {MANUAL_TABS[activeTab].steps.map((step, i) => (
                        <div key={i} className="flex gap-4 mb-7">
                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold mt-0.5">
                                {i + 1}
                            </div>
                            <div>
                                <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: step.description }} />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <DialogFooter className="px-7 py-4 border-t border-border">
                    <DialogClose>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default ManualPopup