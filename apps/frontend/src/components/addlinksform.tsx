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
import {useEffect, useState} from "react";
import {useAuth} from "@clerk/react";

type Links = {
    id: number
    link_name: string,
    url: string,
    owner: string

}


type editlinksRequest = {
    action: string,
    linkData: Links,

}

type linkProp = {
    id?: number,
    type: string,
    size: boolean,
    url: string,
    description: string,
    owner?: string
    name: string,
    me: any
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

function AddLinksForm(props: linkProp){
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();

    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
        }

        load();
    }, [isSignedIn]);
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
                <DialogTrigger render={<Button variant="outline" className={"px-6 py-3.5 text-lg bg-secondary text-secondary-foreground"} >Add Link</Button>} />
                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-mono font-bold">Add Content</DialogTitle>
                            <Button variant="outline" size="lg" className="bg-primary text-primary-foreground">Clear</Button>
                        </div>
                    </DialogHeader>
                    <FieldGroup>
                        <Field>
                            <Label htmlFor="name" className="text-base">Name</Label>
                            <Input
                                name="link_name"
                                value={link.link_name}
                                onChange={handleChange}
                                disabled={false}
                                className="mt-1"
                            />
                        </Field>
                        <Field>
                            <Label htmlFor="link" className="text-base">URL</Label>
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
                        <DialogClose render={<Button variant="outline" size="lg">Cancel</Button>} />
                        <DialogClose render={
                            <Button type="submit" className=" bg-secondary text-secondary-foreground" size="lg" onClick={async () => {
                                const bodyData: editlinksRequest = {
                                    action: "create",
                                    linkData: {
                                        id: props.id!,
                                        link_name: link.link_name,
                                        url: link.url,
                                        owner: roles.at(0) as string,
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

export default AddLinksForm;