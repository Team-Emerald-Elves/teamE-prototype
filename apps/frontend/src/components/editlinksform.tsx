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
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {useState} from "react";
import {HugeiconsIcon} from "@hugeicons/react";
import {Edit03Icon, PlusSignIcon} from "@hugeicons/core-free-icons";

type Links ={
    id: number,
    link_name: string,
    url: string,
    owner: string
}


type editlinksRequest = {
    action: string,
    linkData: Links

}

type linkProp = {
    id?: number,
    type?: string,
    size?: boolean,
    description?: string,
    url: string,
    owner?: string,
    name: string
}

async function updateLinks(body: editlinksRequest) {
    console.log(body)
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Failed to update link (status ${res.status}): ${errorText}`);
    }
    return res.json();
}
function EditLinksForm(props: linkProp){
    const [link, setLink] = useState({
        link_name: props.name,
        url: props.url,
        owner: props.owner,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink({
            ...link,
            [e.target.name]: e.target.value,
        });
    };
    return (
        <Dialog>
            <form>
                <DialogTrigger render={<Button variant="outline" size="icon" className="px-4 py-3 text-base bg-gray-300 text-black" ><HugeiconsIcon icon={Edit03Icon} size={20} /></Button>} />
                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-mono font-bold">Edit Content</DialogTitle>
                            <Button variant="outline" size="lg" className="bg-primary text-primary-foreground">Clear</Button>
                        </div>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="link_name" className="text-base">Name</Label>
                            <Input
                                name="link_name"
                                value={link.link_name}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="url" className="text-base">URL</Label>
                            <Input
                                name="url"
                                value={link.url}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
                        </Field>
                    </FieldGroup>
                    <DialogFooter>
                        <DialogClose render={<Button variant="secondary">Cancel</Button>} />
                        <DialogClose render={
                            <Button type="submit" className=" bg-secondary text-secondary-foreground" size="lg" onClick={async () => {
                                const bodyData: editlinksRequest = {
                                    action: "edit",
                                    linkData: {
                                        id: props.id!,
                                        link_name: link.link_name,
                                        url: link.url,
                                        owner: props.owner!,
                                    }

                                };
                                try {
                                    await updateLinks(bodyData);
                                    console.log("link updated successfully");
                                } catch (err) {
                                    console.error(err);
                                    console.log("Failed to update links");
                                }
                            }}>
                                Submit
                            </Button> }/>
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>

    )
}

export default EditLinksForm;
