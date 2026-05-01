"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/react";
import {
    type ColumnDef,
    type ColumnFiltersState,
    type SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Info, Lock, LockOpen, Search } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon, X } from "@hugeicons/core-free-icons";

import FavoriteStar from "@/components/favoriteStar.tsx";
import AddLinksForm from "@/components/addlinksform.tsx";
import Editlinksform from "@/components/editlinksform.tsx";
import DeletePopupConfirmationLinks from "@/components/deletePopupConfirmationLinks.tsx";
import qmgr from "@/lib/querymgr.ts";
import { type Links } from "@repo/database/types";

type FilterItem = {
    key: "owner" | "meta_tags";
    value: string;
    id: string;
    state: boolean;
};

type LinksTableProps<TData extends Links, TValue> = {
    columns: ColumnDef<TData, TValue>[];
};

const ROLE_OPTIONS: FilterItem[] = [
    {
        key: "owner",
        value: "ActuarialAnalyst",
        id: "Actuarial Analyst",
        state: false,
    },
    { key: "owner", value: "Administrator", id: "Administrator", state: false },
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
];

async function setLinkLock(
    sessionToken: string | null,
    linkID: string,
    status: boolean,
    setReload: React.Dispatch<React.SetStateAction<boolean>>,
) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/checkin-checkout-links/update-link-lock`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: linkID,
                status,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("Failed to update link lock");
    }

    setReload((prev) => !prev);
}

function getTagFilters(links: Links[]): FilterItem[] {
    const uniqueTags = Array.from(
        new Set(links.flatMap((link) => link.meta_tags ?? [])),
    );

    return uniqueTags.map((tag) => ({
        key: "meta_tags",
        value: tag,
        id: tag,
        state: false,
    }));
}

export default function LinksTable<TData extends Links, TValue>({
    columns,
}: LinksTableProps<TData, TValue>) {
    const { getToken, isSignedIn } = useAuth();

    const [links, setLinks] = useState<Links[]>([]);
    const [roles, setRoles] = useState<string[]>([]);
    const [empID, setEmpID] = useState("");
    const [reload, setReload] = useState(false);

    const [filters, setFilters] = useState<FilterItem[]>([]);
    const [_, setRoleFilters] = useState<FilterItem[]>(ROLE_OPTIONS);
    const [tagFilters, setTagFilters] = useState<FilterItem[]>([]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [tab, setTab] = useState("administrator");

    const [sorting, setSorting] = useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

    const isAdmin = roles.includes("Administrator");

    const table = useReactTable({
        data: links as TData[],
        columns,
        state: {
            sorting,
            columnFilters,
        },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    const currentPage = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    const pageNumbers = useMemo(() => {
        if (pageCount <= 7) {
            return Array.from({ length: pageCount }, (_, i) => i);
        }

        const pages: (number | string)[] = [0];

        if (currentPage > 2) {
            pages.push("...");
        }

        const start = Math.max(1, currentPage - 1);
        const end = Math.min(pageCount - 2, currentPage + 1);

        for (let i = start; i <= end; i++) {
            if (!pages.includes(i)) {
                pages.push(i);
            }
        }

        if (currentPage < pageCount - 3) {
            pages.push("...");
        }

        pages.push(pageCount - 1);

        return pages;
    }, [currentPage, pageCount]);

    async function getLinks() {
        const token = await getToken();

        const ownerFilters = filters.filter((item) => item.key === "owner");
        const tagFilters = filters.filter((item) => item.key === "meta_tags");

        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/links`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                action: "list",
                owner: ownerFilters.map((item) => item.value),
                meta_tags: tagFilters.map((item) => item.value),
            }),
        });

        if (!res.ok) {
            throw new Error("Failed to fetch links");
        }

        return res.json();
    }

    useEffect(() => {
        qmgr.wait(() => {
            getLinks()
                .then((data: Links[]) => {
                    setLinks(data);
                    setTagFilters(getTagFilters(data));
                })
                .catch(console.error);
        });
    }, [filters, reload]);

    useEffect(() => {
        if (!isSignedIn) return;

        qmgr.wait(() => {
            qmgr.getMe(async (res) => {
                if (!res.success) {
                    throw new Error("Unable to get current employee");
                }

                const data = await res.data!;

                setEmpID(data.id);
                setRoles(data.roles as string[]);
            });
        });
    }, [isSignedIn]);

    useEffect(() => {
        if (tab === "administrator") {
            table.getColumn("owner")?.setFilterValue(undefined);
        } else {
            table.getColumn("owner")?.setFilterValue(tab);
        }
    }, [tab, table]);

    async function toggleFavorite(link: Links, nextValue: boolean) {
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
                prev.map((item) =>
                    item.id === link.id
                        ? { ...item, favorite: nextValue }
                        : item,
                ),
            );
        } catch (error) {
            console.error(error);
        }
    }

    function handleCheckbox(
        e: React.ChangeEvent<HTMLInputElement>,
        option: FilterItem,
    ) {
        const checked = e.target.checked;

        setFilters((prev) =>
            checked
                ? [...prev, option]
                : prev.filter((item) => item.id !== option.id),
        );

        setRoleFilters((prev) =>
            prev.map((item) =>
                item.id === option.id ? { ...item, state: checked } : item,
            ),
        );

        setTagFilters((prev) =>
            prev.map((item) =>
                item.id === option.id ? { ...item, state: checked } : item,
            ),
        );
    }

    function removeFilter(option: FilterItem) {
        setFilters((prev) => prev.filter((item) => item.id !== option.id));

        setRoleFilters((prev) =>
            prev.map((item) =>
                item.id === option.id ? { ...item, state: false } : item,
            ),
        );

        setTagFilters((prev) =>
            prev.map((item) =>
                item.id === option.id ? { ...item, state: false } : item,
            ),
        );
    }

    function canEditLink(link: Links) {
        if (isAdmin) return true;
        if (!link.owner) return false;

        return roles.includes(link.owner);
    }

    function renderActions(link: Links) {
        const canEdit = canEditLink(link);
        const isUnlocked = link.lock === "none" || link.lock === null;
        const isLockedByMe = link.lock === empID;

        if (!canEdit) {
            return (
                <TableCell>
                    {isUnlocked ? null : (
                        <div className="flex flex-col text-right">
                            <p className="text-xs">Checked out by:</p>
                            <p className="text-sm font-medium">{link.lock}</p>
                        </div>
                    )}
                </TableCell>
            );
        }

        if (isUnlocked) {
            return (
                <TableCell className="px-1 py-0.5">
                    <div className="flex justify-end">
                        <Button
                            variant="outline"
                            size="icon"
                            className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                            onClick={async () => {
                                const token = await getToken();
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
            );
        }

        if (isLockedByMe) {
            return (
                <TableCell className="px-1 py-0.5 text-center">
                    <div className="flex gap-2 justify-end">
                        <Editlinksform
                            id={link.id}
                            lock={link.lock}
                            created_at={link.created_at}
                            updated_at={link.updated_at}
                            meta_tags={link.meta_tags}
                            link_name={link.link_name}
                            url={link.url}
                            owner={roles.at(0) as string}
                            reload={setReload}
                        />

                        <Button variant="destructive" size="icon">
                            <DeletePopupConfirmationLinks
                                link={link}
                                reload={setReload}
                            />
                        </Button>

                        <Button
                            variant="outline"
                            size="icon"
                            className="px-4 py-3 text-base bg-[#6d89a3] text-secondary-foreground"
                            onClick={async () => {
                                const token = await getToken();
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
            );
        }

        return (
            <TableCell>
                <div className="flex flex-col text-right">
                    <p className="text-xs">Checked out by:</p>
                    <p className="text-sm font-medium">{link.lock}</p>
                </div>
            </TableCell>
        );
    }

    return (
        <Tabs value={tab} onValueChange={setTab}>
            <div className="max-w-10xl mx-auto w-full px-10 py-10">
                <div className="bg-white rounded-xl shadow-sm border p-4 relative overflow-visible">
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-2">
                            <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={
                                        (table
                                            .getColumn("link_name")
                                            ?.getFilterValue() as string) ?? ""
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn("link_name")
                                            ?.setFilterValue(event.target.value)
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
                                        setIsDropdownOpen((prev) => !prev)
                                    }
                                    className="flex px-4 py-1 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md"
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
                                        <div className="py-2 px-3">
                                            <div className="flex flex-col gap-1 max-h-40 overflow-y-auto">
                                                {tagFilters.map((option) => (
                                                    <label
                                                        key={option.id}
                                                        className="flex justify-between items-center text-sm"
                                                    >
                                                        {option.id}
                                                        <input
                                                            type="checkbox"
                                                            checked={filters.some(
                                                                (item) =>
                                                                    item.id ===
                                                                    option.id,
                                                            )}
                                                            onChange={(e) =>
                                                                handleCheckbox(
                                                                    e,
                                                                    option,
                                                                )
                                                            }
                                                        />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="ml-auto">
                                <AddLinksForm
                                    id={""}
                                    lock={""}
                                    created_at={new Date()}
                                    updated_at={new Date()}
                                    meta_tags={[]}
                                    link_name={""}
                                    url={""}
                                    owner={roles.at(0) as string}
                                    reload={setReload}
                                />
                            </div>
                        </div>

                        {isAdmin && (
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
                                <TabsTrigger value="UnderWriter">
                                    Underwriter
                                </TabsTrigger>
                            </TabsList>
                        )}

                        {filters.length > 0 && (
                            <div className="py-1 flex flex-row flex-wrap gap-2">
                                {filters.map((option) => (
                                    <div
                                        key={option.id}
                                        className="flex rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5"
                                    >
                                        <p className="px-2 py-1 text-gray-800 rounded-md text-xs">
                                            {option.id}
                                        </p>
                                        <button
                                            onClick={() => removeFilter(option)}
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
                        )}

                        <Table className="border rounded-lg overflow-hidden">
                            <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableHead className="text-[#0b4461] text-center">
                                            Favorite
                                        </TableHead>

                                        {headerGroup.headers.map((header) => (
                                            <TableHead
                                                className="text-[#0b4461] text-center"
                                                key={header.id}
                                            >
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                          header.column
                                                              .columnDef.header,
                                                          header.getContext(),
                                                      )}
                                            </TableHead>
                                        ))}

                                        <TableHead className="text-[#0b4461] text-center">
                                            Actions
                                        </TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>

                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const link = row.original as Links;
                                    const isLockedByOther =
                                        link.lock !== "none" &&
                                        link.lock !== null &&
                                        link.lock !== empID;

                                    return (
                                        <TableRow
                                            key={row.id}
                                            className={
                                                isLockedByOther
                                                    ? "bg-[#e6e8e8]"
                                                    : ""
                                            }
                                        >
                                            <FavoriteStar
                                                doc={link}
                                                onToggleOn={() =>
                                                    toggleFavorite(link, false)
                                                }
                                                onToggleOff={() =>
                                                    toggleFavorite(link, true)
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
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}

                                            {renderActions(link)}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
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
                                    Manage and organize all your links in one
                                    place.
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
                                        <li>Favorite links for quick access</li>
                                        <li>
                                            Search and filter by tag or role
                                        </li>
                                        <li>Edit link name and URL</li>
                                        <li>Delete links you no longer need</li>
                                        <li>Lock links to prevent edits</li>
                                        <li>Sort by any column header</li>
                                    </ul>
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-1 py-4">
                    <Button
                        disabled={!table.getCanPreviousPage()}
                        onClick={() => table.previousPage()}
                        size="sm"
                        variant="outline"
                    >
                        Previous
                    </Button>

                    {pageNumbers.map((page, index) =>
                        typeof page === "number" ? (
                            <Button
                                className="h-8 w-8 p-0"
                                key={index}
                                onClick={() => table.setPageIndex(page)}
                                size="sm"
                                variant={
                                    currentPage === page ? "default" : "outline"
                                }
                            >
                                {page + 1}
                            </Button>
                        ) : (
                            <span className="px-2" key={index}>
                                {page}
                            </span>
                        ),
                    )}

                    <Button
                        disabled={!table.getCanNextPage()}
                        onClick={() => table.nextPage()}
                        size="sm"
                        variant="outline"
                    >
                        Next
                    </Button>
                </div>
            </div>
        </Tabs>
    );
}
