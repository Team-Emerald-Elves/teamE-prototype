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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/react";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon } from "@hugeicons/core-free-icons";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select.tsx";
import type { Links as linksData } from '@repo/database'
import type { Employee } from '../../../../packages/database/lib/prismadefs.ts'
import qmgr from '@/lib/querymgr.ts'

type linksDataExt = linksData & {
    type?: string,
    reload?: (any: any) => any
}


type editlinksRequest = {
    action: string;
    linkData: linksDataExt;
};

function AddLinksForm(props: linksDataExt) {
    const { getToken, isSignedIn } = useAuth();
    let token: string =  ""
    getToken().then((tkn) => {
        token = tkn!;
    }, (err) => {
        console.error("Add links error (token):", err)
    })

    const [roles, setRoles] = useState<string[]>([]); // display values
    const [roleKeys, setRoleKeys] = useState<string[]>([]); // lowercase logic values
    const [selectedRole, setSelectedRole] = useState<string>("");
    const [isFilled, setIsFilled] = useState<boolean>(false);
    const [me, setMe] = useState<Employee | undefined>(undefined);

    const [link, setLink] = useState<linksDataExt>(props);

    async function createNotif(link: linksData, action: string) {
        const token = await getToken();

        qmgr.wait( async () => {
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    public: true,
                    targetRoles: [link.owner, "Administrator"],
                    title: `${me!.first_name} ${me!.last_name} ${action} ${link.link_name.substring(0, 12) + (link.link_name.length >= 12 ? '...' : '')}`,
                })
            })

            if (!res.ok) {
                throw new Error("failed to create view notification")
            }
            console.log(await res.json());
        })
    }

    const ALL_ROLES = ["BusinessAnalyst", "UnderWriter", "Administrator", "BusinessOperator", "ExcelOperator", "ActuarialAnalyst"];

    async function updateLinks(body: editlinksRequest, token: string | null) {
        console.log(body)

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(`Failed to update link (status ${res.status}): ${errorText}`);
        }
        const newLink = await res.json();
        createNotif(newLink, "created");

        props.reload!((prev: any) => !prev)
        return newLink;
    }

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
            qmgr.getMe((res) => {
                if (!res.success) {
                    return;
                }
                setMe(res.data!)
                const rawRoles = res.data!.roles as string[];
                const lowered = rawRoles.map(r => r.toLowerCase());

                setRoles(rawRoles);
                setRoleKeys(lowered);

                const isAdmin = lowered.includes("administrator");


                if (!isAdmin && rawRoles.length > 0) {
                    setSelectedRole(rawRoles[0]);
                }
            })
        })
    }, [isSignedIn]);

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
                            className="px-5 py-3.5 text-md bg-[#5f935a] text-secondary-foreground"
                        >
                            <HugeiconsIcon icon={PlusSignIcon} /> {props.type}
                        </Button>
                    }
                />

                <DialogContent className="lg:max-w-lg">
                    <DialogHeader>
                        <div className="flex items-center justify-between p-2">
                            <DialogTitle className="text-2xl text-primary font-mono font-bold">
                                Add Content
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
                                placeholder="Name..."
                            />
                        </Field>

                        <Field>
                            <Label className="text-base">URL</Label>
                            <Input
                                name="url"
                                value={link.url}
                                onChange={handleChange}
                                className="mt-1"
                                placeholder="https://www.example.com"
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
                        <Button
                            variant="outline"
                            size="lg"
                            className="bg-primary text-primary-foreground"
                            onClick={() => {
                                setLink((prev: linksDataExt) => { return {
                                    ...prev,
                                    link_name: "",
                                    url: "",
                                    owner: "",
                                }});

                                setSelectedRole(isAdmin ? "" : roles[0] || "");
                            }}
                        >
                            Clear
                        </Button>
                        <DialogClose
                            render={
                                <Button
                                    type="submit"
                                    disabled={!isFilled}
                                    className=" bg-secondary text-secondary-foreground"
                                    size="lg"
                                    onClick={async () => {
                                        const finalRole = isAdmin
                                            ? selectedRole
                                            : roles[0];
                                        const bodyData: editlinksRequest = {
                                            action: "create",
                                            linkData: {
                                                id: props.id!,
                                                link_name: link.link_name,
                                                url: link.url,
                                                owner: finalRole,
                                                meta_tags: link.meta_tags,
                                                created_at: link.created_at,
                                                updated_at: link.updated_at,
                                                lock: link.lock
                                            },
                                        };
                                        try {
                                            await updateLinks(
                                                bodyData,
                                                token,
                                            );
                                            console.log(
                                                "link updated successfully",
                                            );
                                        } catch (err) {
                                            console.error(err);
                                            console.log(
                                                "Failed to update links",
                                            );
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

export default AddLinksForm;
