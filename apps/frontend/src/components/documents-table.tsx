"use client";

import * as React from "react";
import mime from "mime";
import {
    type ColumnDef,
    type ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    type SortingState,
    useReactTable,
} from "@tanstack/react-table";
import { Info, Lock, LockOpen, Search } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DocumentValidationIcon,
    Download01Icon,
    File01Icon,
    Folder01Icon,
    PencilEdit02Icon,
    SlidersHorizontalIcon,
    UserGroupIcon,
    X,
} from "@hugeicons/core-free-icons";
import { useAuth } from "@clerk/react";

import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "@/components/deletePopupConfirmation.tsx";
import FavoriteStar from "@/components/favoriteStar.tsx";
import { Button } from "./ui/button.tsx";
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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.tsx";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { documentContent } from "@repo/database/types";

type FilterKey =
    | "document_type"
    | "mime_type"
    | "assigned_role"
    | "meta_tags"
    | "document_status"
    | "content_owner";

type FilterItem = {
    key: FilterKey;
    value: string;
    id: string;
    state: boolean;
};

type FilterGroup = {
    key: string;
    label: string;
    icon: typeof File01Icon;
    filters: FilterItem[];
    show?: boolean;
};

interface DocProps {
    columns: ColumnDef<documentContent, any>[];
}

const ROLE_FILTERS: FilterItem[] = [
    ["ActuarialAnalyst", "Actuarial Analyst"],
    ["BusinessAnalyst", "Business Analyst"],
    ["BusinessOperator", "Business Operator"],
    ["ExcelOperator", "Excel Operator"],
    ["UnderWriter", "Underwriter"],
].map(([value, id]) => ({
    key: "assigned_role",
    value,
    id,
    state: false,
}));

const DOCUMENT_FILTERS: FilterItem[] = ["Reference", "Workflow"].map(
    (type) => ({
        key: "document_type",
        value: type,
        id: type,
        state: false,
    }),
);

const FILE_FILTERS: FilterItem[] = [
    "docx",
    "jpg",
    "pdf",
    "png",
    "pptx",
    "txt",
    "xlsx",
].map((extension) => ({
    key: "mime_type",
    value: mime.getType(extension) ?? extension,
    id: `.${extension}`,
    state: false,
}));

const STATUS_FILTERS: FilterItem[] = [
    ["not_started", "Not Started"],
    ["done", "Done"],
    ["in_progress", "In Progress"],
    ["needs_review", "Needs Review"],
].map(([value, id]) => ({
    key: "document_status",
    value,
    id,
    state: false,
}));

const ROLE_TABS = [
    ["All", "All"],
    ["ActuarialAnalyst", "Actuarial Analyst"],
    ["BusinessAnalyst", "Business Analyst"],
    ["BusinessOperator", "Business Operator"],
    ["ExcelOperator", "Excel Operator"],
    ["UnderWriter", "Under Writer"],
    ["OwnedByMe", "Owned By Me"],
];

const editableRoleByDocumentRole: Record<string, string> = {
    UnderWriter: "underwriter",
    BusinessAnalyst: "businessanalyst",
    ActuarialAnalyst: "actuarialanalyst",
    ExcelOperator: "exceloperator",
    BusinessOperator: "businessoperator",
};

function buildTagFilters(docs: documentContent[]): FilterItem[] {
    return Array.from(new Set(docs.flatMap((doc) => doc.meta_tags ?? []))).map(
        (tag) => ({
            key: "meta_tags",
            value: tag,
            id: tag,
            state: false,
        }),
    );
}

function nextFilters(
    filters: FilterItem[],
    changed: FilterItem,
    checked: boolean,
) {
    if (checked) {
        const exists = filters.some(
            (filter) => filter.key === changed.key && filter.id === changed.id,
        );

        if (exists) {
            return filters;
        }

        return [...filters, { ...changed, state: true }];
    }

    return filters.filter(
        (filter) => !(filter.key === changed.key && filter.id === changed.id),
    );
}

function syncFilterState(options: FilterItem[], selected: FilterItem[]) {
    const selectedKeys = new Set(
        selected.map((filter) => `${filter.key}:${filter.id}`),
    );

    return options.map((option) => ({
        ...option,
        state: selectedKeys.has(`${option.key}:${option.id}`),
    }));
}

function filterPayload(filters: FilterItem[], tab: string) {
    const payload: Partial<Record<FilterKey, string[]>> = {};

    filters.forEach((filter) => {
        if (filter.key === "assigned_role" && tab !== "All") {
            return;
        }

        payload[filter.key] = [...(payload[filter.key] ?? []), filter.value];
    });

    if (tab !== "All" && tab !== "OwnedByMe") {
        payload.assigned_role = [tab];
    }

    return payload;
}

async function createNotification(
    getToken: () => Promise<string | null>,
    doc: documentContent,
    action: string,
) {
    const token = await getToken();

    const meRes = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tests/me`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        },
    );

    if (!meRes.ok) {
        throw new Error("Failed to get current employee");
    }

    const me = await meRes.json();

    const title = `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(
        0,
        12,
    )}${doc.name.length >= 12 ? "..." : ""}`;

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
                targetRoles: [doc.assigned_role, "Administrator"],
                title,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("Failed to create notification");
    }
}

async function setDocumentLock(
    sessionToken: string | null,
    id: number,
    status: boolean,
) {
    const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/tests/update-lock`,
        {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id,
                status,
            }),
        },
    );

    if (!res.ok) {
        throw new Error("Failed to update document lock");
    }

    return res.json();
}

function FilterOptions({
    group,
    onChange,
}: {
    group: FilterGroup;
    onChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        option: FilterItem,
    ) => void;
}) {
    return (
        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-44 rounded-md bg-(--filter-background) shadow-lg ring-1 ring-black/5">
            <div className="py-1">
                {group.filters.map((option) => (
                    <div
                        key={option.id}
                        className="flex items-center justify-between gap-2 px-2"
                    >
                        <label
                            htmlFor={option.id}
                            className="text-sm font-medium text-(--table-text) cursor-pointer"
                        >
                            {option.id}
                        </label>

                        <input
                            id={option.id}
                            type="checkbox"
                            checked={option.state}
                            onChange={(event) => onChange(event, option)}
                            className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

function FilterMenu({
    groups,
    activeGroup,
    onActiveGroupChange,
    onFilterChange,
}: {
    groups: FilterGroup[];
    activeGroup: string | null;
    onActiveGroupChange: (key: string | null) => void;
    onFilterChange: (
        event: React.ChangeEvent<HTMLInputElement>,
        option: FilterItem,
    ) => void;
}) {
    return (
        <div className="absolute right-0 z-10 mt-2 w-41 rounded-md bg-(--filter-background) shadow-lg ring-1 ring-black/5">
            <div className="py-1">
                {groups
                    .filter((group) => group.show !== false)
                    .map((group) => (
                        <div
                            key={group.key}
                            className="relative inline-block text-left"
                        >
                            <div className="flex gap-x-0.5">
                                <button
                                    onClick={() =>
                                        onActiveGroupChange(
                                            activeGroup === group.key
                                                ? null
                                                : group.key,
                                        )
                                    }
                                    className={`flex px-4 py-1 ml-2 justify-center items-center  ${activeGroup === group.key && "bg-(--filter-hover)"} text-(--table-text) rounded-md hover:bg-(--filter-hover) text-xs w-36`}
                                >
                                    <span className="pr-1">
                                        <HugeiconsIcon
                                            size={16}
                                            icon={group.icon}
                                        />
                                    </span>
                                    {group.label}
                                </button>
                            </div>

                            {activeGroup === group.key && (
                                <FilterOptions
                                    group={group}
                                    onChange={onFilterChange}
                                />
                            )}
                        </div>
                    ))}
            </div>
        </div>
    );
}

function SelectedFilters({
    filters,
    onRemove,
}: {
    filters: FilterItem[];
    onRemove: (filter: FilterItem) => void;
}) {
    if (!filters.length) {
        return null;
    }

    return (
        <div className="py-1 mb-2 flex flex-row flex-wrap gap-2 mt-1">
            {filters.map((filter) => (
                <div
                    key={`${filter.key}-${filter.id}`}
                    className=" flex  rounded-md bg-muted shadow-lg ring-1 ring-black ring-opacity-5 "
                >
                    <p className=" px-2 py-1 text-(--table-text) rounded-md text-xs ">
                        {filter.id}
                    </p>

                    <button
                        onClick={() => onRemove(filter)}
                        className=" pr-2 text-(--table-text)"
                    >
                        <HugeiconsIcon size={16} icon={X} />
                    </button>
                </div>
            ))}
        </div>
    );
}

function CreateDocumentButton({
    roles,
    refresh,
}: {
    roles: string[];
    refresh: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    return (
        <ContentForm
            type="Create"
            currentID={Math.trunc((Math.random() * 10000) % 10000)}
            currentName=""
            currentURL=""
            currentContentOwner="Select Content Owner"
            currentRole={
                roles.includes("administrator")
                    ? "Select Role"
                    : (roles.at(0) as string)
            }
            currentExpirationDate={new Date()}
            currentExpirationTime="10:30:00"
            currentStatus="Select Status"
            size
            currentDocType={"Reference"}
            lock="none"
            refresh={refresh}
            roles={roles}
        />
    );
}

function InfoPopover({ totalDocuments }: { totalDocuments: number }) {
    return (
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

                <PopoverContent side="top" align="start" className="w-72">
                    <p className="font-medium text-sm mb-2">Documents</p>
                    <p className="text-xs text-muted-foreground mb-3">
                        Manage and organize all your documents in one place.
                    </p>

                    <div className="space-y-2 mb-3">
                        <p className="text-xs font-medium text-foreground">
                            Stats
                        </p>
                        <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">
                                Total documents
                            </span>
                            <span className="font-medium">
                                {totalDocuments}
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs font-medium text-foreground">
                            Features
                        </p>
                        <ul className="text-xs text-muted-foreground space-y-1">
                            <li>Favorite documents for quick access</li>
                            <li>Search and filter by type, status, or role</li>
                            <li>Edit document metadata and details</li>
                            <li>Delete documents you no longer need</li>
                            <li>Lock documents to prevent edits</li>
                            <li>Sort by any column header</li>
                        </ul>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
}

export function DocumentsTable({ columns }: DocProps) {
    const { getToken, isSignedIn } = useAuth();

    const [docs, setDocs] = React.useState<documentContent[]>([]);
    const [roles, setRoles] = React.useState<string[]>([]);
    const [empID, setEmpID] = React.useState("");
    const [tab, setTab] = React.useState("All");
    const [filters, setFilters] = React.useState<FilterItem[]>([]);
    const [tagFilters, setTagFilters] = React.useState<FilterItem[]>([]);
    const [reload, setReload] = React.useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [activeFilterGroup, setActiveFilterGroup] = React.useState<
        string | null
    >(null);
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    const isAdmin = roles.includes("administrator");

    const myDocumentFilter = React.useMemo<FilterItem>(
        () => ({
            key: "content_owner",
            value: empID,
            id: "Owned by Me",
            state: true,
        }),
        [empID],
    );

    const selectedFilters = React.useMemo(() => {
        if (tab === "All") {
            return filters.filter((filter) => filter.key !== "content_owner");
        }

        if (tab === "OwnedByMe") {
            return [
                ...filters.filter(
                    (filter) =>
                        filter.key !== "assigned_role" &&
                        filter.key !== "content_owner",
                ),
                myDocumentFilter,
            ];
        }

        return filters.filter(
            (filter) =>
                filter.key !== "assigned_role" &&
                filter.key !== "content_owner",
        );
    }, [filters, myDocumentFilter, tab]);

    const filterGroups = React.useMemo<FilterGroup[]>(() => {
        return [
            {
                key: "document_type",
                label: "Document Type",
                icon: File01Icon,
                filters: syncFilterState(DOCUMENT_FILTERS, selectedFilters),
            },
            {
                key: "mime_type",
                label: "File Type",
                icon: Folder01Icon,
                filters: syncFilterState(FILE_FILTERS, selectedFilters),
            },
            {
                key: "assigned_role",
                label: "Role",
                icon: UserGroupIcon,
                filters: syncFilterState(ROLE_FILTERS, selectedFilters),
                show: tab === "All",
            },
            {
                key: "meta_tags",
                label: "Custom Tags",
                icon: PencilEdit02Icon,
                filters: syncFilterState(tagFilters, selectedFilters),
            },
            {
                key: "document_status",
                label: "Status",
                icon: DocumentValidationIcon,
                filters: syncFilterState(STATUS_FILTERS, selectedFilters),
            },
        ];
    }, [selectedFilters, tagFilters, tab]);

    const table = useReactTable({
        data: docs,
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

    const currentPage = table.getState().pagination.pageIndex;
    const pageCount = table.getPageCount();

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (pageCount <= 7) {
            return Array.from({ length: pageCount }, (_, index) => index);
        }

        pages.push(0);

        if (currentPage > 2) {
            pages.push("...");
        }

        const start = Math.max(1, currentPage - 1);
        const end = Math.min(pageCount - 2, currentPage + 1);

        for (let page = start; page <= end; page++) {
            if (!pages.includes(page)) {
                pages.push(page);
            }
        }

        if (currentPage < pageCount - 3) {
            pages.push("...");
        }

        pages.push(pageCount - 1);

        return pages;
    };

    const loadDocuments = React.useCallback(async () => {
        if (!isSignedIn) {
            return;
        }

        const token = await getToken();
        const payload = filterPayload(selectedFilters, tab);

        const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            },
        );

        if (!res.ok) {
            throw new Error("Failed to fetch documents");
        }

        const data: documentContent[] = await res.json();

        setDocs(data);
        setTagFilters(buildTagFilters(data));
    }, [getToken, isSignedIn, selectedFilters, tab]);

    React.useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        async function loadUser() {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/api/tests/me`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            if (!res.ok) {
                throw new Error("Failed to get current user");
            }

            const data = await res.json();

            setEmpID(data.id);
            setRoles(
                (data.roles as string[]).map((role) => role.toLowerCase()),
            );
        }

        loadUser().catch(console.error);
    }, [getToken, isSignedIn]);

    React.useEffect(() => {
        loadDocuments().catch(console.error);
    }, [loadDocuments, reload]);

    const handleFilterChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        option: FilterItem,
    ) => {
        setFilters((current) =>
            nextFilters(current, option, event.target.checked),
        );
    };

    const removeFilter = (filter: FilterItem) => {
        if (filter.key === "assigned_role" || filter.key === "content_owner") {
            setTab("All");
        }

        setFilters((current) => nextFilters(current, filter, false));
    };

    const toggleFavorite = async (doc: documentContent, favorite: boolean) => {
        try {
            const token = await getToken();

            const res = await fetch(
                `${import.meta.env.VITE_BACKEND_URL}/update-favorite`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        id: doc.id,
                        favorite,
                    }),
                },
            );

            if (!res.ok) {
                throw new Error("Failed to update favorite");
            }

            setDocs((current) =>
                current.map((item) =>
                    item.id === doc.id ? { ...item, favorite } : item,
                ),
            );
        } catch (err) {
            console.error(err);
        }
    };

    const downloadDocument = async (doc: documentContent) => {
        try {
            await createNotification(getToken, doc, "downloaded");

            if (!doc.url) {
                throw new Error("Document has no URL");
            }

            const response = await fetch(doc.url);

            if (!response.ok) {
                throw new Error("Failed to fetch file");
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = doc.name || "download";

            document.body.appendChild(link);
            link.click();
            link.remove();

            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error(err);
        }
    };

    const lockDocument = async (doc: documentContent, status: boolean) => {
        try {
            const token = await getToken();
            await setDocumentLock(token, doc.id, status);
            setReload((current) => !current);
        } catch (err) {
            console.error(err);
        }
    };

    const canEditDocument = (doc: documentContent) => {
        if (isAdmin) {
            return true;
        }

        if (!doc.assigned_role) {
            return false;
        }

        const requiredRole = editableRoleByDocumentRole[doc.assigned_role];

        if (!requiredRole) {
            return false;
        }

        return roles.includes(requiredRole);
    };

    return (
        <Tabs value={tab} onValueChange={setTab}>
            <div className="max-w-10xl mx-auto px-10 w-full py-10">
                <div className="bg-(--card) rounded-xl shadow-sm border p-4 relative overflow-hidden h-[650px]">
                    <div className="flex flex-col">
                        <div className="flex items-center mb-4">
                            <InputGroup className="flex-1 max-w-sm h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-(--color-primary-foreground) ">
                                <InputGroupInput
                                    placeholder="Search"
                                    value={
                                        (table
                                            .getColumn("name")
                                            ?.getFilterValue() as string) ?? ""
                                    }
                                    onChange={(event) =>
                                        table
                                            .getColumn("name")
                                            ?.setFilterValue(event.target.value)
                                    }
                                    className="w-full placeholder:text-accent-foreground"
                                />

                                <InputGroupAddon>
                                    <Search color="var(--accent-foreground)"/>
                                </InputGroupAddon>
                            </InputGroup>

                            <div className="relative inline-block text-left">
                                <button
                                    onClick={() =>
                                        setIsDropdownOpen((current) => !current)
                                    }
                                    className="flex px-4 py-1 ml-2 items-center bg-primary text-white text-sm hover:bg-primary/80 rounded-md duration-200"
                                >
                                    <span className="pr-1 ">
                                        <HugeiconsIcon
                                            icon={SlidersHorizontalIcon} size={16}
                                        />
                                    </span>
                                    Filter
                                </button>

                                {isDropdownOpen && (
                                    <FilterMenu
                                        groups={filterGroups}
                                        activeGroup={activeFilterGroup}
                                        onActiveGroupChange={
                                            setActiveFilterGroup
                                        }
                                        onFilterChange={handleFilterChange}
                                    />
                                )}
                            </div>

                            <div className="flex justify-center ml-auto py-1">
                                <CreateDocumentButton
                                    roles={roles}
                                    refresh={setReload}
                                />
                            </div>
                        </div>

                        <div className="flex">
                            <TabsList>
                                {ROLE_TABS.map(([value, label]) => (
                                    <TabsTrigger key={value} value={value}>
                                        {label}
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>
                    </div>

                    <SelectedFilters
                        filters={selectedFilters}
                        onRemove={removeFilter}
                    />

                    <Table className="border rounded-lg overflow-hidden mt-4">
                        <TableHeader className="bg-(--card-header) text-(--table-titles)">
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    <TableHead className="text-(--table-titles) text-left px-5">
                                        Favorite
                                    </TableHead>

                                    {headerGroup.headers.map((header) => (
                                        <TableHead
                                            className="text-(--table-titles) text-left px-5"
                                            key={header.id}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext(),
                                                  )}
                                        </TableHead>
                                    ))}

                                    <TableHead className="text-(--table-titles) px-5 text-center">
                                        Actions
                                    </TableHead>
                                </TableRow>
                            ))}
                        </TableHeader>

                        <TableBody>
                            {table.getRowModel().rows.length > 0 ? (
                                table.getRowModel().rows.map((row) => {
                                    const doc = row.original;
                                    const canEdit = canEditDocument(doc);
                                    const isUnlocked = doc.lock === "none";
                                    const isLockedByMe = doc.lock === empID;
                                    const isLockedByOther =
                                        !isUnlocked && !isLockedByMe;

                                    return (
                                        <TableRow
                                            key={row.id}
                                            className={
                                                isLockedByOther
                                                    ? "bg-(--tab-bg)"
                                                    : undefined
                                            }
                                        >
                                            <FavoriteStar
                                                doc={doc}
                                                onToggleOn={(item) =>
                                                    toggleFavorite(
                                                        item as documentContent,
                                                        false,
                                                    )
                                                }
                                                onToggleOff={(item) =>
                                                    toggleFavorite(
                                                        item as documentContent,
                                                        true,
                                                    )
                                                }
                                            />

                                            {row
                                                .getVisibleCells()
                                                .map((cell) => (
                                                    <TableCell
                                                        key={cell.id}
                                                        className="px-5 py-2 text-left whitespace-normal"
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext(),
                                                        )}
                                                    </TableCell>
                                                ))}

                                            <TableCell>
                                                {isLockedByOther ? (
                                                    <div className="flex items-center justify-center gap-2">
                                                        <div className="flex flex-col text-right">
                                                            <p className="text-[10px]">
                                                                Checked out by:
                                                            </p>
                                                            <p className="text-[10px] font-medium">
                                                                {doc.lock_name}
                                                            </p>
                                                        </div>

                                                        <Button
                                                            onClick={() =>
                                                                downloadDocument(
                                                                    doc,
                                                                )
                                                            }
                                                        >
                                                            <HugeiconsIcon
                                                                icon={
                                                                    Download01Icon
                                                                }
                                                                color="white"
                                                            />
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2 justify-center">
                                                        {canEdit &&
                                                            isLockedByMe && (
                                                                <>
                                                                    <ContentForm
                                                                        type="Edit"
                                                                        currentID={
                                                                            doc.id
                                                                        }
                                                                        currentName={
                                                                            doc.name
                                                                        }
                                                                        currentURL={
                                                                            doc.url ??
                                                                            ""
                                                                        }
                                                                        currentContentOwner={
                                                                            doc.content_owner ??
                                                                            ""
                                                                        }
                                                                        currentRole={
                                                                            doc.assigned_role ??
                                                                            ""
                                                                        }
                                                                        currentExpirationDate={
                                                                            doc.expiration_date
                                                                        }
                                                                        currentExpirationTime="10:30:00"
                                                                        currentStatus={
                                                                            doc.document_status
                                                                        }
                                                                        currentDocType={
                                                                            doc.document_type
                                                                        }
                                                                        size={
                                                                            false
                                                                        }
                                                                        lock={
                                                                            doc.lock as string
                                                                        }
                                                                        refresh={
                                                                            setReload
                                                                        }
                                                                        roles={
                                                                            roles
                                                                        }
                                                                    />

                                                                    <DeleteConfirmationPopup
                                                                        target={
                                                                            doc
                                                                        }
                                                                        refresh={
                                                                            setReload
                                                                        }
                                                                    />
                                                                </>
                                                            )}

                                                        <Button
                                                            onClick={() =>
                                                                downloadDocument(
                                                                    doc,
                                                                )
                                                            }
                                                        >
                                                            <HugeiconsIcon
                                                                icon={
                                                                    Download01Icon
                                                                }
                                                                color="white"
                                                            />
                                                        </Button>

                                                        {canEdit &&
                                                            isUnlocked && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="px-3 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                    onClick={() =>
                                                                        lockDocument(
                                                                            doc,
                                                                            true,
                                                                        )
                                                                    }
                                                                >
                                                                    <Lock />
                                                                </Button>
                                                            )}

                                                        {canEdit &&
                                                            isLockedByMe && (
                                                                <Button
                                                                    variant="outline"
                                                                    size="icon"
                                                                    className="px-3 py-3 text-base bg-[#6d89a3] text-secondary-foreground"
                                                                    onClick={() =>
                                                                        lockDocument(
                                                                            doc,
                                                                            false,
                                                                        )
                                                                    }
                                                                >
                                                                    <LockOpen />
                                                                </Button>
                                                            )}
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length + 2}
                                        className="h-24 text-center"
                                    >
                                        No documents found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>

                    <InfoPopover totalDocuments={docs.length} />
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

                    {getPageNumbers().map((page, index) =>
                        typeof page === "number" ? (
                            <Button
                                className="h-8 w-8 p-0"
                                key={`${page}-${index}`}
                                onClick={() => table.setPageIndex(page)}
                                size="sm"
                                variant={
                                    currentPage === page
                                        ? "default"
                                        : "outline"
                                }
                            >
                                {page + 1}
                            </Button>
                        ) : (
                            <span className="px-2" key={`${page}-${index}`}>
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
