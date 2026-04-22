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
import {useLinks} from "../pages/links.tsx"
import { useEffect, useState } from "react"
import { useAuth } from "@clerk/react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Edit03Icon } from "@hugeicons/core-free-icons"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select.tsx"

type Links = {
    id: string,
    link_name: string,
    url: string,
    owner: string
}

type editlinksRequest = {
    action: string,
    linkData: Links
}

type linkProp = {
    id?: string,
    url: string,
    owner?: string,
    name: string
}

const ALL_ROLES = ["BusinessAnalyst", "UnderWriter", "Administrator"];

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

function EditLinksForm(props: linkProp) {
    const { getToken, isSignedIn } = useAuth();

    const [roles, setRoles] = useState<string[]>([]);
    const [roleKeys, setRoleKeys] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>(props.owner || "");

    const [link, setLink] = useState({
        link_name: props.name,
        url: props.url,
    });
   const reloadLinks = useLinks();

    useEffect(() => {
        if (!isSignedIn) return;

        async function load() {
            const token = await getToken();

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();

            const rawRoles = data.roles as string[];
            const lowered = rawRoles.map(r => r.toLowerCase());

            setRoles(rawRoles);
            setRoleKeys(lowered);

            const isAdmin = lowered.includes("administrator");

            // default role logic
            if (!isAdmin && rawRoles.length > 0) {
                setSelectedRole(rawRoles[0]);
            }
res

3/19/2026, 8:00:00 PM

Last Edited

4/21/2026, 9:29:08
            if (isAdmin && props.owner) {
                setSelectedRole(props.owner);
            }
        }

        load();
    }, []);

    const isAdmin = roleKeys.includes("administrator");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLink({
            ...link,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <Dialog>
            <form>
                <DialogTrigger
                    render={
                        <Button
                            variant="outline"
                            size="icon"
                            className="px-4 py-3 text-base bg-gray-300 text-black"
                        >
                            <HugeiconsIcon icon={Edit03Icon} size={20} />
                        </Button>
                    }
                />

                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-mono font-bold">
                                Edit Content
                            </DialogTitle>

                            <Button
                                variant="outline"
                                size="lg"
                                className="bg-primary text-primary-foreground"
                                onClick={() => {
                                    setLink({
                                        link_name: "",
                                        url: "",
                                    });
                                    setSelectedRole(
                                        isAdmin ? props.owner || "" : roles[0] || ""
                                    );
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    </DialogHeader>

                    <FieldGroup>
                        <Field>
                            <Label className="text-base">Name</Label>
                            <Input
                                name="link_name"
                                value={link.link_name}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </Field>

                        <Field>
                            <Label className="text-base">URL</Label>
                            <Input
                                name="url"
                                value={link.url}
                                onChange={handleChange}
                                className="mt-1"
                            />
                        </Field>

                        <Field>
                            <Label className="text-xs font-bold">Role:</Label>

                            <Select
                                value={selectedRole}
                                onValueChange={(value) => setSelectedRole(value)}
                                disabled={!isAdmin}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>

                                        {(isAdmin ? ALL_ROLES : roles).map((role) => (
                                            <SelectItem key={role} value={role}>
                                                {role}
                                            </SelectItem>
                                        ))}

                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose
                            render={<Button variant="secondary">Cancel</Button>}
                        />

                        <DialogClose
                            render={
                                <Button
                                    type="submit"
                                    className="bg-secondary text-secondary-foreground"
                                    size="lg"
                                    onClick={async () => {
                                        const finalRole =
                                            isAdmin
                                                ? selectedRole
                                                : roles[0];

                                        const bodyData: editlinksRequest = {
                                            action: "edit",
                                            linkData: {
                                                id: props.id!,
                                                link_name: link.link_name,
                                                url: link.url,
                                                owner: finalRole,
                                            }
                                        };

                                        try {
                                            await updateLinks(bodyData);
                                            console.log("link updated successfully");
                                        } catch (err) {
                                            console.error(err);
                                        }
                                        reloadLinks()
                                    }}
                                >
                                    Submit
                                </Button>
                            }
                        />
                    </DialogFooter>
                </DialogContent>
            </form>
        </Dialog>
    );
}

export default EditLinksForm;