import { Button } from "./ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import {getToken, useAuth} from "@clerk/react"
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
import qmgr from '@/lib/querymgr.ts'
import type { Links as linksData } from '@repo/database/types'

type editlinksRequest = {
    action: string,
    linkData: Partial<linksData>
}

type linkProp = linksData & {
    reload: (any: any) => void;
};
async function createNotif(link: linksData, action: string) {
    const token = await getToken();

    qmgr.wait(() => {
        qmgr.getMe( async (res1) => {
            if (!res1.success) {
                throw new Error("Unable to get me");
            }

            const me = res1.data!;
            console.log(me);

    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                public: true,
                targetRoles: [link.owner, "Administrator"],
                title: `${me.first_name} ${me.last_name} ${action} ${link.link_name.substring(0, 12) + (link.link_name.length >= 12 ? "..." : "")}`,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("failed to create view notification");
    }
    console.log(await res.json());
    })})
}

const ALL_ROLES = [
    "BusinessAnalyst",
    "UnderWriter",
    "Administrator",
    "BusinessOperator",
    "ExcelOperator",
    "ActuarialAnalyst",
];

async function updateLinks(body: editlinksRequest, reload: (any: any) => void) {
    console.log(body);
    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(
            `Failed to update link (status ${res.status}): ${errorText}`,
        );
    }

    const newLink = await res.json();
    createNotif(newLink, "updated");

    reload((prev: any) => !prev);
    return newLink;
}

function EditLinksForm(props: linkProp) {
    const { isSignedIn } = useAuth();

    const [roles, setRoles] = useState<string[]>([]);
    const [roleKeys, setRoleKeys] = useState<string[]>([]);
    const [selectedRole, setSelectedRole] = useState<string>(props.owner || "");
    const [isFilled, setIsFilled] = useState<boolean>(false);

    const [link, setLink] = useState({
        ...props
    });

    useEffect(() => {
        if (link.link_name && link.url) {
            setIsFilled(true);
        } else {
            setIsFilled(false);
        }
    }, [link]);

    useEffect(() => {
        if (!isSignedIn) return;

        qmgr.wait(() => {
            qmgr.getMe( async (res) => {
                if (!res.success) {
                    throw new Error("Unable to get me");
                }
                const rawRoles = res.data?.roles!;
                const lowered = rawRoles.map(r => r.toLowerCase());

                setRoles(rawRoles);
                setRoleKeys(lowered);

                const isAdmin = lowered.includes("administrator");

                // default role logic
                if (!isAdmin && rawRoles.length > 0) {
                    setSelectedRole(rawRoles[0]);
                }

                if (isAdmin && props.owner) {
                    setSelectedRole(props.owner);
                }
            })
        })
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
                                onValueChange={(value) =>
                                    setSelectedRole(value as string)
                                }
                                disabled={!isAdmin}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>

                                        {(isAdmin ? ALL_ROLES : roles).map(
                                            (role) => (
                                                <SelectItem
                                                    key={role}
                                                    value={role}
                                                >
                                                    {role}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </Field>
                    </FieldGroup>

                    <DialogFooter>
                        <DialogClose
                            render={
                                <Button variant="outline" size="lg">
                                    Cancel
                                </Button>
                            }
                        />
                        <DialogClose
                            render={
                                <Button
                                    type="submit"
                                    className="bg-secondary text-secondary-foreground"
                                    size="lg"
                                    disabled={!isFilled}
                                    onClick={async () => {
                                        const finalRole = isAdmin
                                            ? selectedRole
                                            : roles[0];

                                        const bodyData: editlinksRequest = {
                                            action: "edit",
                                            linkData: {
                                                id: props.id!,
                                                link_name: link.link_name,
                                                url: link.url,
                                                owner: finalRole,
                                            },
                                        };

                                        try {
                                            await updateLinks(
                                                bodyData,
                                                props.reload,
                                            );
                                            console.log(
                                                "link updated successfully",
                                            );
                                        } catch (err) {
                                            console.error(err);
                                        }
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
