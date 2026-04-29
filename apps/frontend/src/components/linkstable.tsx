"use client";

import * as React from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "./ui/button.tsx";

import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getPaginationRowModel,
    getFilteredRowModel,
    useReactTable,
    type SortingState,
    getSortedRowModel,
} from "@tanstack/react-table";

import { Lock, LockOpen, Search } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import { useEffect, useState } from "react";
import { getToken, useAuth, useUser } from "@clerk/react";
import FavoriteStar from "@/components/favoriteStar.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon, X } from "@hugeicons/core-free-icons";
import AddLinksForm from "@/components/addlinksform.tsx";
import Editlinksform from "@/components/editlinksform.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Info } from "lucide-react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";

type Links = {
    id: string;
    link_name: string;
    url: string;
    owner: string;
    favorite: boolean;
    lock: string;
    lock_name: string;
    created_at: string;
    updated_at: string;
    meta_tags: string[];
};

type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    lock: boolean;
    expiration_date: string;
    mime_type: string;
    document_type: string;
    assigned_role: string;
    content_owner: string;
    document_status: string;
    favorite: boolean;
};

async function setLinkLock(
    sessionToken: string | null,
    linkID: string,
    status: boolean,
    setReload: (any) => void,
): Promise<string> {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/checkin-checkout-links/update-link-lock`,
        {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json",
            },
            method: "PUT",
            body: JSON.stringify({
                id: linkID,
                status: status,
            }),
        },
    );
    if (!res.ok) {
        throw new Error("Failed to fetch link.");
    }
    const data = await res.json();
    setReload((prev) => !prev);

    return String(data);
}

interface LinkProps<TData extends Links, TValue> {
    columns: ColumnDef<TData, TValue>[];
}

export default function LinksTable<TData extends Links, TValue>({
    columns,
}: LinkProps<TData, TValue>) {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const [me, setMe] = useState(null);
    const [links, setLinks] = useState<Links[]>([]);
    const [token, setToken] = useState<string>();
    const [empID, setEmpID] = useState("");
    const [roleFilters, setRoleFilters] = useState([
        {
            key: "owner",
            value: "ActuarialAnalyst",
            id: "Actuarial Analyst",
            state: false,
        },
        {
            key: "owner",
            value: "Administrator",
            id: "Administrator",
            state: false,
        },
        {
            key: "owner",
            value: "BusinessAnalyst",
            id: "Business Analyst",
            state: false,
        },
        {
            key: "owner",
            value: "BusinessOperator",
            id: "Business Operator",
            state: false,
        },
        {
            key: "owner",
            value: "ExcelOperator",
            id: "Excel Operator",
            state: false,
        },
        { key: "owner", value: "UnderWriter", id: "Underwriter", state: false },
    ]);
    const [filters, setFilters] = useState<
        { key: string; value: string; id: string; state: boolean }[]
    >([]);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [reload, setReload] = useState<boolean>(false);
    const [isTagOpen, setIsTagOpen] = useState(false);

    async function getLinks() {
        const token = await getToken();
        const payload: Record<string, string[]> = {};

        const tags = filters.filter((item) => item.key === "meta_tags");

        const role = filters.filter((item) => item.key === "owner");

        if (role.length > 0) {
            payload["owner"] = role.map((d) => d.value);
        }
        if (tags.length > 0) {
            payload["meta_tags"] = tags.map((t) => t.value);
        }

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw new Error("Failed to fetch links");
        }
        const data = await res.json();
        return data;
    }

    useEffect(() => {
        getLinks()
            .then((data) => {
                if (links.length === 0) {
                    setTagFilters(getTagFilters(data));
                }
                setLinks(data);
            })
            .catch(console.error);
    }, [filters, reload]);

    useEffect(() => {
        if (!isSignedIn) {
            setMe(null);
            return;
        }

        async function load() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/tests/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const data = await res.json();
            setMe(data);
            setToken(token as string);
            setEmpID(data.id);
            setRoles(data.roles as string[]);
        }
        load();
    }, []);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data: links,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            columnFilters,
        },
    });
    const toggleFavorite = async (
        link: Document | Links,
        nextValue: boolean,
    ) => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/update-favorite-link`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: link.id,
                        favorite: nextValue,
                    }),
                },
            );

            if (!res.ok) {
                throw new Error("Failed to update favorite");
            }

            setLinks((prev) =>
                prev.map((l) =>
                    l.id === link.id ? { ...l, favorite: nextValue } : l,
                ),
            );
        } catch (err) {
            console.error(err);
        }
    };
    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        option: { key: string; value: string; id: string; state: boolean },
    ) => {
        const { id, checked } = e.target;

        if (checked) {
            setFilters((filter) => [...filter, option]);
            console.log(filters);
        } else {
            setFilters((filter) =>
                filter.filter((item) => item.id !== option.id),
            );
            console.log(filters);
        }

        setRoleFilters((rlFilters) =>
            rlFilters.map((filter) =>
                filter.id === id ? { ...filter, state: !filter.state } : filter,
            ),
        );

        setTagFilters((tgFilters) =>
            tgFilters.map((filter) =>
                filter.id === id ? { ...filter, state: !filter.state } : filter,
            ),
        );
    };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tagFilters, setTagFilters] = useState<FilterItem[]>([]);

    type FilterItem = {
        key: string;
        value: string;
        id: string;
        state: boolean;
    };

    function getTagFilters(links: Links[]): FilterItem[] {
        const uniqueTags = Array.from(
            new Set(links.flatMap((link) => link.meta_tags ?? [])),
        );

        return uniqueTags.map((tag) => {
            return {
                key: "meta_tags",
                value: tag,
                id: tag,
                state: false,
            };
        });
    }
    const [tab, setTab] = useState(roles[0]);

    useEffect(() => {
        if (tab === "administrator") {
            table.getColumn("owner")?.setFilterValue(undefined);
        } else {
            table.getColumn("owner")?.setFilterValue(tab);
        }
    }, [tab, table]);
    console.log(roles[0]);
    console.log(tab);

    if (roles.includes("Administrator")) {
        return (
            <>
                <Tabs value={tab} onValueChange={setTab}>
                    <div className="max-w-10xl mx-auto w-full px-10 py-10">
                        <div className="bg-white rounded-xl shadow-sm border p-4 relative overflow-visible">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-4">
                                    <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                        <InputGroupInput
                                            placeholder="Search"
                                            value={
                                                (table
                                                    .getColumn("link_name")
                                                    ?.getFilterValue() as string) ??
                                                ""
                                            }
                                            onChange={(event) =>
                                                table
                                                    .getColumn("link_name")
                                                    ?.setFilterValue(
                                                        event.target.value,
                                                    )
                                            }
                                            className="w-full"
                                        />
                                        <InputGroupAddon>
                                            <Search />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <div className="relative inline-block text-left">
                                        {tab === "All" ? (
                                            <button
                                                onClick={() =>
                                                    setIsDropdownOpen(
                                                        (prev) => !prev,
                                                    )
                                                }
                                                className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
                                            >
                                                <div className="pr-1">
                                                    <HugeiconsIcon
                                                        icon={
                                                            SlidersHorizontalIcon
                                                        }
                                                    />
                                                </div>
                                                Filter Tags
                                            </button>
                                        ) : null}

                                        {isDropdownOpen && (
                                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                                <div className="py-2">
                                                    {/* TAGS */}
                                                    <div className="px-2 mt-2">
                                                        {/*{isTagOpen && (*/}
                                                        <div className="ml-2 mt-1 flex flex-col gap-1 max-h-40 overflow-y-auto">
                                                            {tagFilters.map(
                                                                (option) => (
                                                                    <label
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        className="flex justify-between items-center text-sm"
                                                                    >
                                                                        {
                                                                            option.id
                                                                        }
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={filters.some(
                                                                                (
                                                                                    f,
                                                                                ) =>
                                                                                    f.id ===
                                                                                    option.id,
                                                                            )}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                handleCheckbox(
                                                                                    e,
                                                                                    option,
                                                                                )
                                                                            }
                                                                        />
                                                                    </label>
                                                                ),
                                                            )}
                                                        </div>
                                                        {/*)}*/}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end ml-auto">
                                        <AddLinksForm
                                            type="Add Link"
                                            name=""
                                            url=""
                                            size={true}
                                            reload={setReload}
                                        />
                                    </div>
                                </div>
                                <div className="flex ">
                                    <TabsList>
                                        <TabsTrigger value="administrator">
                                            All
                                        </TabsTrigger>
                                        <TabsTrigger value="ActuarialAnalyst">
                                            Actuarial Analyst
                                        </TabsTrigger>
                                        <TabsTrigger value="BusinessAnalyst">
                                            Business Analyst
                                        </TabsTrigger>
                                        <TabsTrigger value="BusinessOperator">
                                            Business Operator
                                        </TabsTrigger>
                                        <TabsTrigger value="ExcelOperator">
                                            Excel Operator
                                        </TabsTrigger>
                                        <TabsTrigger value="Underwriter">
                                            Under Writer
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                            <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
                                {filters.map((option) => (
                                    <div
                                        key={option.id}
                                        className=" flex rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 "
                                    >
                                        <p className=" px-2 py-1 text-gray-800 rounded-md text-xs ">
                                            {" "}
                                            {option.id}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setFilters((filter) =>
                                                    filter.filter(
                                                        (filterId) =>
                                                            filterId !== option,
                                                    ),
                                                );

                                                setRoleFilters((rlFilters) =>
                                                    rlFilters.map((filter) =>
                                                        filter.id === option.id
                                                            ? {
                                                                  ...filter,
                                                                  state: !filter.state,
                                                              }
                                                            : filter,
                                                    ),
                                                );
                                                setTagFilters((tgFilters) =>
                                                    tgFilters.map((filter) =>
                                                        filter.id === option.id
                                                            ? {
                                                                  ...filter,
                                                                  state: !filter.state,
                                                              }
                                                            : filter,
                                                    ),
                                                );
                                            }}
                                            className="text-black pr-2"
                                        >
                                            <div className="ml-1">
                                                <HugeiconsIcon
                                                    size={16}
                                                    icon={X}
                                                />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Table className="border rounded-lg overflow-hidden">
                                <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                <TableHead className=" text-[#0b4461] text-center">
                                                    {" "}
                                                    Favorite{" "}
                                                </TableHead>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                className=" text-[#0b4461] text-center"
                                                                key={header.id}
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext(),
                                                                      )}
                                                            </TableHead>
                                                        );
                                                    },
                                                )}
                                                <TableHead className="text-[#0b4461] text-center">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => {
                                        const link = row.original;
                                        console.log(link);

                                        return link.lock === "none" ||
                                            link.lock === empID ? (
                                            <TableRow key={row.id}>
                                                <FavoriteStar
                                                    doc={link}
                                                    onToggleOn={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            false,
                                                        )
                                                    }
                                                    onToggleOff={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            true,
                                                        )
                                                    }
                                                />

                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="px-5 py-0.5 text-left whitespace-normal"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                {link.lock === "none" ? (
                                                    <TableCell>
                                                        <div className="flex items-center gap-1 justify-end">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                onClick={async () => {
                                                                    const token =
                                                                        await getToken();
                                                                    await setLinkLock(
                                                                        token,
                                                                        link.id,
                                                                        true,
                                                                        setReload,
                                                                    );
                                                                }}
                                                            >
                                                                <Lock />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                ) : link.lock === empID ? (
                                                    <TableCell className="px-1 py-0.5 text-center">
                                                        <div className="flex gap-2 justify-end">
                                                            <Editlinksform
                                                                id={link.id}
                                                                name={
                                                                    link.link_name
                                                                }
                                                                url={link.url}
                                                                owner={roles.at(
                                                                    0,
                                                                )}
                                                                reload={
                                                                    setReload
                                                                }
                                                            />
                                                            <Button
                                                                variant="destructive"
                                                                size="icon"
                                                            >
                                                                <DeletePopupConfirmationLinks
                                                                    link={link}
                                                                    reload={
                                                                        setReload
                                                                    }
                                                                />
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                onClick={async () => {
                                                                    const token =
                                                                        await getToken();
                                                                    await setLinkLock(
                                                                        token,
                                                                        link.id,
                                                                        false,
                                                                        setReload,
                                                                    );
                                                                }}
                                                            >
                                                                <LockOpen />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell>
                                                        <p>{link.lock_name}</p>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ) : (
                                            <TableRow
                                                key={row.id}
                                                className="bg-[#e6e8e8]"
                                            >
                                                <FavoriteStar
                                                    doc={link}
                                                    onToggleOn={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            false,
                                                        )
                                                    }
                                                    onToggleOff={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            true,
                                                        )
                                                    }
                                                />
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="px-5 py-0.5 text-left whitespace-normal"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                <TableCell>
                                                    <div className="flex flex-col text-right">
                                                        <p className="text-xs">
                                                            Checked out by:
                                                        </p>
                                                        <p className="text-sm font-medium">
                                                            {link.lock_name}
                                                        </p>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.previousPage()}
                                    disabled={!table.getCanPreviousPage()}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => table.nextPage()}
                                    disabled={!table.getCanNextPage()}
                                >
                                    Next
                                </Button>
                            </div>

                            <div className="absolute bottom-3 left-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        >
                                            <Info className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="top"
                                        align="start"
                                        className="w-72"
                                    >
                                        <p className="font-medium text-sm mb-2">
                                            Links
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Manage and organize all your links
                                            in one place.
                                        </p>
                                        <div className="space-y-2 mb-3">
                                            <p className="text-xs font-medium text-foreground">
                                                Stats
                                            </p>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Total links
                                                </span>
                                                <span className="font-medium">
                                                    {links.length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-foreground">
                                                Features
                                            </p>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                <li>
                                                    ⭐ Favorite links for quick
                                                    access
                                                </li>
                                                <li>
                                                    🔍 Search and filter by tag
                                                    or role
                                                </li>
                                                <li>
                                                    ✏️ Edit link name and URL
                                                </li>
                                                <li>
                                                    🗑️ Delete links you no
                                                    longer need
                                                </li>
                                                <li>
                                                    🔒 Lock links to prevent
                                                    edits
                                                </li>
                                                <li>
                                                    📋 Sort by any column header
                                                </li>
                                            </ul>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                    </div>
                </Tabs>
            </>
        );
    } else {
        return (
            <>
                <Tabs value={tab} onValueChange={setTab}>
                    <div className="max-w-10xl mx-auto w-full px-10 py-10">
                        <div className="bg-white rounded-xl shadow-sm border p-4 relative overflow-visible">
                            <div className="flex flex-col">
                                <div className="flex items-center mb-4">
                                    <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                        <InputGroupInput
                                            placeholder="Search"
                                            value={
                                                (table
                                                    .getColumn("link_name")
                                                    ?.getFilterValue() as string) ??
                                                ""
                                            }
                                            onChange={(event) =>
                                                table
                                                    .getColumn("link_name")
                                                    ?.setFilterValue(
                                                        event.target.value,
                                                    )
                                            }
                                            className="w-full"
                                        />
                                        <InputGroupAddon>
                                            <Search />
                                        </InputGroupAddon>
                                    </InputGroup>
                                    <div className="relative inline-block text-left">
                                        <button
                                            onClick={() =>
                                                setIsDropdownOpen(
                                                    (prev) => !prev,
                                                )
                                            }
                                            className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
                                        >
                                            <div className="pr-1">
                                                <HugeiconsIcon
                                                    icon={SlidersHorizontalIcon}
                                                />
                                            </div>
                                            Filter Tags
                                        </button>

                                        {isDropdownOpen && (
                                            <div className="absolute right-0 z-10 mt-2 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                                                <div className="py-2">
                                                    {/* TAGS */}
                                                    <div className="px-2 mt-2">
                                                        <div className="ml-2 mt-1 flex flex-col gap-1 max-h-40 overflow-y-auto">
                                                            {tagFilters.map(
                                                                (option) => (
                                                                    <label
                                                                        key={
                                                                            option.id
                                                                        }
                                                                        className="flex justify-between items-center text-sm"
                                                                    >
                                                                        {
                                                                            option.id
                                                                        }
                                                                        <input
                                                                            type="checkbox"
                                                                            checked={filters.some(
                                                                                (
                                                                                    f,
                                                                                ) =>
                                                                                    f.id ===
                                                                                    option.id,
                                                                            )}
                                                                            onChange={(
                                                                                e,
                                                                            ) =>
                                                                                handleCheckbox(
                                                                                    e,
                                                                                    option,
                                                                                )
                                                                            }
                                                                        />
                                                                    </label>
                                                                ),
                                                            )}
                                                        </div>
                                                        {/*)}*/}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex justify-end ml-auto">
                                        <AddLinksForm
                                            type="Add Link"
                                            name=""
                                            url=""
                                            size={true}
                                            reload={setReload}
                                        />
                                    </div>
                                </div>
                                <div className="flex ">
                                    <TabsList>
                                        <TabsTrigger value="administrator">
                                            All
                                        </TabsTrigger>
                                        <TabsTrigger value="ActuarialAnalyst">
                                            Actuarial Analyst
                                        </TabsTrigger>
                                        <TabsTrigger value="BusinessAnalyst">
                                            Business Analyst
                                        </TabsTrigger>
                                        <TabsTrigger value="BusinessOperator">
                                            Business Operator
                                        </TabsTrigger>
                                        <TabsTrigger value="ExcelOperator">
                                            Excel Operator
                                        </TabsTrigger>
                                        <TabsTrigger value="Underwriter">
                                            Under Writer
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </div>
                            <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
                                {filters.map((option) => (
                                    <div
                                        key={option.id}
                                        className=" flex  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 "
                                    >
                                        <p className=" px-2 py-1 text-gray-800 rounded-md text-xs ">
                                            {" "}
                                            {option.id}
                                        </p>
                                        <button
                                            onClick={() => {
                                                setFilters((filter) =>
                                                    filter.filter(
                                                        (filterId) =>
                                                            filterId !== option,
                                                    ),
                                                );

                                                setRoleFilters((rlFilters) =>
                                                    rlFilters.map((filter) =>
                                                        filter.id === option.id
                                                            ? {
                                                                  ...filter,
                                                                  state: !filter.state,
                                                              }
                                                            : filter,
                                                    ),
                                                );
                                                setTagFilters((tgFilters) =>
                                                    tgFilters.map((filter) =>
                                                        filter.id === option.id
                                                            ? {
                                                                  ...filter,
                                                                  state: !filter.state,
                                                              }
                                                            : filter,
                                                    ),
                                                );
                                            }}
                                            className="text-black pr-2"
                                        >
                                            <div className="ml-1">
                                                <HugeiconsIcon
                                                    size={16}
                                                    icon={X}
                                                />
                                            </div>
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Table className="border rounded-lg overflow-hidden">
                                <TableHeader className="bg-[#ecf4f9] text-[#0b4461] text-center">
                                    {table
                                        .getHeaderGroups()
                                        .map((headerGroup) => (
                                            <TableRow key={headerGroup.id}>
                                                <TableHead className=" text-[#0b4461] text-center">
                                                    {" "}
                                                    Favorite{" "}
                                                </TableHead>
                                                {headerGroup.headers.map(
                                                    (header) => {
                                                        return (
                                                            <TableHead
                                                                className=" text-[#0b4461] text-center"
                                                                key={header.id}
                                                            >
                                                                {header.isPlaceholder
                                                                    ? null
                                                                    : flexRender(
                                                                          header
                                                                              .column
                                                                              .columnDef
                                                                              .header,
                                                                          header.getContext(),
                                                                      )}
                                                            </TableHead>
                                                        );
                                                    },
                                                )}
                                                <TableHead className="text-[#0b4461] text-center">
                                                    Actions
                                                </TableHead>
                                            </TableRow>
                                        ))}
                                </TableHeader>
                                <TableBody>
                                    {table.getRowModel().rows.map((row) => {
                                        const link = row.original;

                                        const canEdit =
                                            (roles.includes("UnderWriter") &&
                                                link.owner === "UnderWriter") ||
                                            (roles.includes(
                                                "BusinessAnalyst",
                                            ) &&
                                                link.owner ===
                                                    "BusinessAnalyst") ||
                                            (roles.includes(
                                                "ActuarialAnalyst",
                                            ) &&
                                                link.owner ===
                                                    "ActuarialAnalyst") ||
                                            (roles.includes("ExcelOperator") &&
                                                link.owner ===
                                                    "ExcelOperator") ||
                                            (roles.includes(
                                                "BusinessOperator",
                                            ) &&
                                                link.owner ===
                                                    "BusinessOperator");
                                        return link.lock === "none" ||
                                            link.lock === empID ? (
                                            <TableRow key={row.id}>
                                                <FavoriteStar
                                                    doc={link}
                                                    onToggleOn={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            false,
                                                        )
                                                    }
                                                    onToggleOff={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            true,
                                                        )
                                                    }
                                                />
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="px-5 py-0.5 text-left whitespace-normal"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                {!canEdit ? (
                                                    <></>
                                                ) : link.lock === "none" ? (
                                                    <TableCell className="px-1 py-0.5">
                                                        <div className="flex justify-end w-full">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                onClick={async () => {
                                                                    const token =
                                                                        await getToken();
                                                                    await setLinkLock(
                                                                        token,
                                                                        link.id,
                                                                        true,
                                                                        setReload,
                                                                    );
                                                                }}
                                                            >
                                                                <Lock />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                ) : link.lock === empID ? (
                                                    <TableCell className="px-1 py-0.5 text-center">
                                                        <div className="flex gap-2 justify-end">
                                                            {canEdit && (
                                                                <Editlinksform
                                                                    id={link.id}
                                                                    name={
                                                                        link.link_name
                                                                    }
                                                                    url={
                                                                        link.url
                                                                    }
                                                                    owner={roles.at(
                                                                        0,
                                                                    )}
                                                                    reload={
                                                                        setReload
                                                                    }
                                                                />
                                                            )}

                                                            {canEdit && (
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                >
                                                                    <DeletePopupConfirmationLinks
                                                                        link={
                                                                            link
                                                                        }
                                                                        reload={
                                                                            setReload
                                                                        }
                                                                    />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                onClick={async () => {
                                                                    const token =
                                                                        await getToken();
                                                                    await setLinkLock(
                                                                        token,
                                                                        link.id,
                                                                        false,
                                                                        setReload,
                                                                    );
                                                                }}
                                                            >
                                                                <LockOpen />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell>
                                                        <p>{link.lock_name}</p>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ) : (
                                            <TableRow
                                                key={row.id}
                                                className="bg-[#e6e8e8]"
                                            >
                                                <FavoriteStar
                                                    doc={link}
                                                    onToggleOn={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            false,
                                                        )
                                                    }
                                                    onToggleOff={(link) =>
                                                        toggleFavorite(
                                                            link,
                                                            true,
                                                        )
                                                    }
                                                />
                                                {row
                                                    .getVisibleCells()
                                                    .map((cell) => (
                                                        <TableCell
                                                            key={cell.id}
                                                            className="px-5 py-0.5 text-left whitespace-normal"
                                                        >
                                                            {flexRender(
                                                                cell.column
                                                                    .columnDef
                                                                    .cell,
                                                                cell.getContext(),
                                                            )}
                                                        </TableCell>
                                                    ))}
                                                {link.lock === "none" ? (
                                                    <TableCell className="px-1 py-0.5 text-right">
                                                        <div className="flex justify-end w-full">
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                onClick={async () => {
                                                                    const token =
                                                                        await getToken();
                                                                    await setLinkLock(
                                                                        token,
                                                                        link.id,
                                                                        true,
                                                                        setReload,
                                                                    );
                                                                }}
                                                            >
                                                                <Lock />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                ) : link.lock === empID ? (
                                                    <TableCell className="px-1 py-0.5 text-center">
                                                        <div className="flex gap-2 justify-end">
                                                            {canEdit && (
                                                                <Editlinksform
                                                                    id={link.id}
                                                                    name={
                                                                        link.link_name
                                                                    }
                                                                    url={
                                                                        link.url
                                                                    }
                                                                    owner={roles.at(
                                                                        0,
                                                                    )}
                                                                    reload={
                                                                        setReload
                                                                    }
                                                                />
                                                            )}

                                                            {canEdit && (
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                >
                                                                    <DeletePopupConfirmationLinks
                                                                        link={
                                                                            link
                                                                        }
                                                                        reload={
                                                                            setReload
                                                                        }
                                                                    />
                                                                </Button>
                                                            )}
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                                className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                onClick={async () => {
                                                                    const token =
                                                                        await getToken();
                                                                    await setLinkLock(
                                                                        token,
                                                                        link.id,
                                                                        false,
                                                                        setReload,
                                                                    );
                                                                }}
                                                            >
                                                                <LockOpen />
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                ) : (
                                                    <TableCell>
                                                        <div className="flex flex-col text-right">
                                                            <p className="text-xs">
                                                                Checked out by:
                                                            </p>
                                                            <p className="text-sm font-medium">
                                                                {link.lock_name}
                                                            </p>
                                                        </div>
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            <div className="absolute bottom-3 left-3">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        >
                                            <Info className="h-4 w-4" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        side="top"
                                        align="start"
                                        className="w-72"
                                    >
                                        <p className="font-medium text-sm mb-2">
                                            Links
                                        </p>
                                        <p className="text-xs text-muted-foreground mb-3">
                                            Manage and organize all your links
                                            in one place.
                                        </p>
                                        <div className="space-y-2 mb-3">
                                            <p className="text-xs font-medium text-foreground">
                                                Stats
                                            </p>
                                            <div className="flex justify-between text-xs">
                                                <span className="text-muted-foreground">
                                                    Total links
                                                </span>
                                                <span className="font-medium">
                                                    {links.length}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium text-foreground">
                                                Features
                                            </p>
                                            <ul className="text-xs text-muted-foreground space-y-1">
                                                <li>
                                                    Favorite links for quick
                                                    access
                                                </li>
                                                <li>
                                                    Search and filter by tag or
                                                    role
                                                </li>
                                                <li>Edit link name and URL</li>
                                                <li>
                                                    Delete links you no longer
                                                    need
                                                </li>
                                                <li>
                                                    Lock links to prevent edits
                                                </li>
                                                <li>
                                                    Sort by any column header
                                                </li>
                                            </ul>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2 py-4">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                </Tabs>
            </>
        );
    }
}
