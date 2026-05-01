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
import { Lock, LockOpen, Search, Info } from "lucide-react";
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
<<<<<<< HEAD
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
import type { documentContent } from "@repo/database";

type FilterKey =
  | "document_type"
  | "mime_type"
  | "assigned_role"
  | "meta_tags"
  | "document_status"
  | "content_owner";
=======
import {HugeiconsIcon} from "@hugeicons/react";
import {Download01Icon} from "@hugeicons/core-free-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Document } from "@/../../packages/database/lib/prismadefs.ts"
import qmgr from "@/lib/querymgr.ts";

const handleDownload = async (doc: Document) => {
    try {
        createNotif(doc, "downloaded");
        const response = await fetch(doc.url!);

        if (!response.ok) {
            throw new Error("Failed to fetch file");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = doc.name || "download";
        document.body.appendChild(a);
        a.click();
        a.remove();

        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error(err);
    }
};

async function createNotif(doc: Document, action: string) {
    const token = await getToken();
    qmgr.wait(() => {
        qmgr.getMe( async (res1) => {
            if (!res1.success) {
                throw new Error("Unable to get me");
            }
            const me = res1.data!;
            console.log(me);

            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    public: true,
                    targetRoles: [doc.assigned_role, "Administrator"],
                    title: `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(0, 12) + (doc.name.length >= 12 ? '...' : '')}`,
                })
            })
        
            if (!res.ok) {
                throw new Error("failed to create view notification")
            }
            console.log(await res.json());
                })
            })
}

interface DocProps<TData extends Document, TValue> {
    columns: ColumnDef<TData, TValue>[]
    reload: () => void
}
>>>>>>> main

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
  data?: documentContent[];
  reload?: () => void;
}

const ROLE_FILTERS: FilterItem[] = [
  ["ActuarialAnalyst", "Actuarial Analyst"],
  ["BusinessAnalyst", "Business Analyst"],
  ["BusinessOperator", "Business Operator"],
  ["ExcelOperator", "Excel Operator"],
  ["UnderWriter", "Underwriter"],
].map(([value, id]) => ({ key: "assigned_role", value, id, state: false }));

<<<<<<< HEAD
const DOCUMENT_FILTERS: FilterItem[] = ["Reference", "Workflow"].map((type) => ({
  key: "document_type",
  value: type,
  id: type,
  state: false,
}));
=======
export function DocumentsTable<TData extends Document, TValue>({
                                             columns,
                                         }: DocProps<TData, TValue>) {
    const [roles, setRoles] = useState<string[]>([]);
    const { getToken, isSignedIn } = useAuth();
    const[docs, setDocs] = useState<Document[]>([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isDocumentOpen, setIsDocumentOpen] = useState(false);
    const [isTypeOpen, setIsTypeOpen] = useState(false);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const [filters, setFilters] = useState<{key: string; value: string; id: string; state: boolean;}[]>([]);
    const[empID, setEmpID] = useState("");
    const[reload, setReload] = useState<boolean>(false);
    const [isTagOpen, setIsTagOpen] = useState(false);
>>>>>>> main

const FILE_FILTERS: FilterItem[] = ["docx", "jpg", "pdf", "png", "pptx", "txt", "xlsx"].map(
  (extension) => ({
    key: "mime_type",
    value: mime.getType(extension) ?? extension,
    id: `.${extension}`,
    state: false,
  }),
);

const STATUS_FILTERS: FilterItem[] = [
  ["not_started", "Not Started"],
  ["done", "Done"],
  ["in_progress", "In Progress"],
  ["needs_review", "Needs Review"],
].map(([value, id]) => ({ key: "document_status", value, id, state: false }));

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
  return Array.from(new Set(docs.flatMap((doc) => doc.meta_tags ?? []))).map((tag) => ({
    key: "meta_tags",
    value: tag,
    id: tag,
    state: false,
  }));
}

function nextFilters(filters: FilterItem[], changed: FilterItem, checked: boolean) {
  if (checked) return [...filters, { ...changed, state: true }];

  return filters.filter((filter) => {
    return !(filter.key === changed.key && filter.id === changed.id);
  });
}

function syncFilterState(options: FilterItem[], selected: FilterItem[]) {
  const selectedKeys = new Set(selected.map((filter) => `${filter.key}:${filter.id}`));

  return options.map((option) => ({
    ...option,
    state: selectedKeys.has(`${option.key}:${option.id}`),
  }));
}

function filterPayload(filters: FilterItem[], tab: string) {
  const payload: Partial<Record<FilterKey, string[]>> = {};

  filters.forEach((filter) => {
    if (filter.key === "assigned_role" && tab !== "All") return;
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

  const meRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const me = await meRes.json();

  const title = `${me.first_name} ${me.last_name} ${action} ${doc.name.substring(0, 12)}${
    doc.name.length >= 12 ? "..." : ""
  }`;

  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/notifs/create-notification`, {
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
  });

  if (!res.ok) {
    throw new Error("Failed to create notification");
  }
}

async function setDocumentLock(
  sessionToken: string | null,
  id: number,
  status: boolean,
) {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/update-lock`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id,
      status,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update document lock");
  }

  return String(await res.json());
}

function FilterOptions({
  group,
  onChange,
}: {
  group: FilterGroup;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, option: FilterItem) => void;
}) {
  return (
    <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-44 rounded-md bg-white shadow-lg ring-1 ring-black/5">
      <div className="py-1">
        {group.filters.map((option) => (
          <div key={option.id} className="flex items-center justify-between gap-2 px-2">
            <label
              htmlFor={option.id}
              className="text-sm font-medium text-gray-800 cursor-pointer"
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
  onFilterChange: (event: React.ChangeEvent<HTMLInputElement>, option: FilterItem) => void;
}) {
  return (
    <div className="absolute right-0 z-10 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black/5">
      <div className="py-1">
        {groups
          .filter((group) => group.show !== false)
          .map((group) => (
            <div key={group.key} className="relative inline-block text-left">
              <div className="flex gap-x-0.5">
                <button
                  onClick={() => {
                    onActiveGroupChange(activeGroup === group.key ? null : group.key);
                  }}
                  className="flex items-center px-4 py-1 ml-2 text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                >
                  <span className="pr-1">
                    <HugeiconsIcon size={16} icon={group.icon} />
                  </span>
                  {group.label}
                </button>

                <button onClick={() => onActiveGroupChange(null)} className="text-black">
                  <span className="ml-3">
                    <HugeiconsIcon size={16} icon={X} />
                  </span>
                </button>
              </div>

              {activeGroup === group.key && (
                <FilterOptions group={group} onChange={onFilterChange} />
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
  if (!filters.length) return null;

  return (
    <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
      {filters.map((filter) => (
        <div
          key={`${filter.key}-${filter.id}`}
          className="flex items-center gap-1 rounded-md bg-gray-100 px-2 py-1 text-sm"
        >
          <span>{filter.id}</span>

          <button onClick={() => onRemove(filter)} className="text-black pr-1">
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
      currentRole="Select Role"
      currentExpirationDate={new Date()}
      currentExpirationTime="10:30:00"
      currentStatus="Select Status"
      size
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
            <p className="text-xs font-medium text-foreground">Stats</p>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Total documents</span>
              <span className="font-medium">{totalDocuments}</span>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-medium text-foreground">Features</p>
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
  const [activeFilterGroup, setActiveFilterGroup] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const isAdmin = roles.includes("administrator");

  const myDocumentFilter = React.useMemo<FilterItem>(
    () => ({
      key: "content_owner",
      value: empID,
      id: "Owned by Me",
      state: false,
    }),
    [empID],
  );

  const selectedFilters = React.useMemo(() => {
    if (tab === "All") {
      return filters.filter((filter) => filter.key !== "content_owner");
    }

<<<<<<< HEAD
    if (tab === "OwnedByMe") {
      return [
        ...filters.filter(
          (filter) => filter.key !== "assigned_role" && filter.key !== "content_owner",
        ),
        myDocumentFilter,
      ];
    }

    return filters.filter(
      (filter) => filter.key !== "assigned_role" && filter.key !== "content_owner",
    );
  }, [filters, myDocumentFilter, tab]);

  const filterGroups = React.useMemo<FilterGroup[]>(() => {
    const selected = selectedFilters;

    return [
      {
        key: "document_type",
        label: "Document Type",
        icon: File01Icon,
        filters: syncFilterState(DOCUMENT_FILTERS, selected),
      },
      {
        key: "mime_type",
        label: "File Type",
        icon: Folder01Icon,
        filters: syncFilterState(FILE_FILTERS, selected),
      },
      {
        key: "assigned_role",
        label: "Role",
        icon: UserGroupIcon,
        filters: syncFilterState(ROLE_FILTERS, selected),
        show: tab === "All",
      },
      {
        key: "meta_tags",
        label: "Custom Tags",
        icon: PencilEdit02Icon,
        filters: syncFilterState(tagFilters, selected),
      },
      {
        key: "document_status",
        label: "Status",
        icon: DocumentValidationIcon,
        filters: syncFilterState(STATUS_FILTERS, selected),
      },
    ];
  }, [selectedFilters, tagFilters, tab]);
=======
    useEffect(() => {
        if (!isSignedIn) {
            return;
        }

        async function load() {
            if(!isSignedIn) {
                return;
            }

            qmgr.wait(() => {
                qmgr.getMe( async (res) => {
                    if (!res.success) {
                        throw new Error("Unable to get me");
                    }

                    const data = await res.data!;
                    setEmpID(data.id);
                    setRoles((data.roles as string[]).map((role: string) => role.toLowerCase()))
                })
            })

        }
        load();
    }, []);
>>>>>>> main

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

  const loadDocuments = React.useCallback(async () => {
    const token = await getToken();
    const payload = filterPayload(selectedFilters, tab);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/supabase/list-documents`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Failed to fetch documents");
    }

    const data = await res.json();

    setDocs(data);
    setTagFilters((current) => {
      return current.length ? current : buildTagFilters(data);
    });
  }, [getToken, selectedFilters, tab]);

  React.useEffect(() => {
    if (!isSignedIn) return;

    async function loadUser() {
      const token = await getToken();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

<<<<<<< HEAD
      const data = await res.json();
=======
    })

    const currentPage = table.getState().pagination.pageIndex
    const pageCount = table.getPageCount()

    const getPageNumbers = () => {
        const pages: (number | string)[] = []
        const showEllipsisStart = currentPage > 2
        const showEllipsisEnd = currentPage < pageCount - 3

        if (pageCount <= 7) {
            return Array.from({ length: pageCount }, (_, i) => i)
        }

        pages.push(0)

        if (showEllipsisStart) {
            pages.push("...")
            if(currentPage < pageCount - 2) {
                pages.push(currentPage - 1, currentPage, currentPage + 1)
            }
            else if (currentPage < pageCount - 1) {
                pages.push(currentPage -2,currentPage - 1, currentPage)
            }
            else{
                pages.push(currentPage -3,currentPage - 2, currentPage - 1)
            }
        } else {
            pages.push(1, 2, 3)
        }

        if (showEllipsisEnd) {
            pages.push("...")
        } else if (currentPage < pageCount - 3) {
            pages.push(pageCount - 3, pageCount - 2)
        }

        if (currentPage >= pageCount - 3) {
            console.log("current page", currentPage)
            console.log("page count", pageCount)
            for (let i = Math.max(4, currentPage - 1); i < pageCount - 5; i++) {
                if (!pages.includes(i) && (currentPage < pageCount - 3)) {
                    pages.push(i)
                }
            }
        }

        pages.push(pageCount - 1)

        return pages
    }
    const toggleFavorite = async (doc: Document, nextValue: boolean) => {
        try {
            const token = await getToken();
>>>>>>> main

      setEmpID(data.id);
      setRoles((data.roles as string[]).map((role) => role.toLowerCase()));
    }
<<<<<<< HEAD

    loadUser().catch(console.error);
  }, [getToken, isSignedIn]);

  React.useEffect(() => {
    loadDocuments().catch(console.error);
  }, [loadDocuments, reload]);

  const handleFilterChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    option: FilterItem,
  ) => {
    setFilters((current) => nextFilters(current, option, event.target.checked));
  };

  const removeFilter = (filter: FilterItem) => {
    setFilters((current) => nextFilters(current, filter, false));
  };

  const toggleFavorite = async (doc: documentContent, favorite: boolean) => {
    try {
      const token = await getToken();

      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/update-favorite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: doc.id,
          favorite,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update favorite");
      }

      setDocs((current) => {
        return current.map((item) => {
          return item.id === doc.id ? { ...item, favorite } : item;
        });
      });
    } catch (err) {
      console.error(err);
    }
  };
=======
    useEffect(() => {
        if(isDropdownOpen) {
            setIsDropdownOpen(!isDropdownOpen)
        }
        setFilters(prev => {
            const withoutRoles = prev.filter(f => f.key !== "assigned_role" && f.key !== "content_owner");
            if (tab === "All") return withoutRoles;
            const selectedRole = roleFilters.find(f => f.value === tab);
            let selectedOwned = null;

            if (tab === "OwnedByMe") {
                selectedOwned = myDocumentsButton.find(f => f.value === empID);
            }
            const rolesFalse = roleFilters.map(role => ({
                ...role,
                state: false
            }));
            setRoleFilters(rolesFalse);
            const ownedFalse = myDocumentsButton.map(owned => ({
                ...owned,
                state: false
            }));
            setMyDocumentsButton(ownedFalse);

            const tabFilter = selectedOwned || selectedRole;
            return tabFilter ? [...withoutRoles, tabFilter] : withoutRoles;
        });
    }, [tab,empID]);

    async function setDocumentLock(sessionToken: string | null, documentID: number, status: boolean): Promise<string> {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/tests/update-lock`, {
            headers: {
                Authorization: `Bearer ${sessionToken}`,
                "Content-Type": "application/json"
            },
            method: "PUT",
            body: JSON.stringify({
                id: documentID,
                status: status
            })
        })
        if (!res.ok) {
            throw new Error("Failed to fetch document.");
        }
        const data = await res.json();
        setReload(prev => !prev);
        return String(data);
    }

    if(roles.includes("administrator")) {
        return (
            <>
                <Tabs value={tab} onValueChange={setTab}>
                <div className="max-w-10xl mx-auto px-10 w-fulll py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4 relative overflow-visible">
                        <div className="flex flex-col">
                            <div className="flex items-center mb-4">
                                <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                    <InputGroupInput
                                        placeholder="Search"
                                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                        onChange={(event) =>
                                            table.getColumn("name")?.setFilterValue(event.target.value)
                                        }
                                        className="w-full"
                                    />
                                    <InputGroupAddon>
                                        <Search />
                                    </InputGroupAddon>
                                </InputGroup>
                                <div className="relative inline-block text-left">
                                        <button
                                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                            className="flex px-4 py-1 ml-2 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md"
                                        >
                                            <div className="pr-1"><HugeiconsIcon icon={SlidersHorizontalIcon}/></div>
                                            Filter
                                        </button>

                                    {isDropdownOpen && (
                                        <div
                                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                            <div className="py-1">
                                                <div className="relative inline-block text-left">
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsDocumentOpen(!isDocumentOpen)
                                                            }}
                                                            className="flex px-4 py-1 ml-2  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36">
                                                            <div className="pr-1"><HugeiconsIcon size={16} icon={File01Icon}/></div>
                                                            Document Type
                                                        </button>
                                                        <button onClick={() => {
                                                            if (isDocumentOpen) {
                                                                setIsDocumentOpen(!isDocumentOpen)
                                                            }
                                                        }}
                                                                className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isDocumentOpen && (
                                                        <div
                                                            className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                {docFilters.map((option) => (
                                                                    <div key={option.id}
                                                                         className="flex items-center justify-between">
                                                                        <label htmlFor={option.id}
                                                                               className="text-sm  text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="relative inline-block text-left">
                                                    <div className="flex gap-x-0.5">
                                                        <button

                                                            onClick={() => {
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsTypeOpen(!isTypeOpen)
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        >
                                                            <div className="pr-1"><HugeiconsIcon size={16} icon={Folder01Icon}/></div>
                                                            File Type
                                                        </button>
                                                        <button onClick={() => {
                                                            if (isTypeOpen) {
                                                                setIsTypeOpen(!isTypeOpen)
                                                            }
                                                        }}
                                                                className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isTypeOpen && (
                                                        <div
                                                            className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                {fileFilters.map((option) => (
                                                                    <div key={option.id}
                                                                         className="flex items-center justify-between">
                                                                        <label htmlFor={option.id}
                                                                               className="text-sm  text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative inline-block text-left">
                                                    {tab === "All" ?
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        >
                                                            <div className="pr-1"><HugeiconsIcon size={16} icon={UserGroupIcon}/>
                                                            </div>
                                                            Role
                                                        </button>
                                                        <button onClick={() => {
                                                            if (isRoleOpen) {
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }
                                                        }}
                                                                className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div> : null}

                                                    {isRoleOpen && (

                                                        <div
                                                            className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-46 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                {roleFilters.map((option) => (
                                                                    <div key={option.id}
                                                                         className="flex items-center justify-between">
                                                                        <label htmlFor={option.id}
                                                                               className="text-sm  text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative inline-block text-left">
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsTagOpen(!isTagOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        >
                                                            <div className="pr-1"><HugeiconsIcon size={16} icon={PencilEdit02Icon}/></div>
                                                            Custom Tags
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isTagOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {tagFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative inline-block text-left">
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                setIsStatusOpen(!isStatusOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        ><div className="pr-1"><HugeiconsIcon size={16} icon={DocumentValidationIcon}/></div>
                                                            Status
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isStatusOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {statusFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="py-1">

                                                    {tab !== "OwnedByMe" &&
                                                        myDocumentsButton.map((option) => (
                                                        <div key={option.id} className="flex items-center justify-between">
                                                            <label className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md  text-xs w-36">{option.id}</label>
                                                            <input
                                                                id={option.id}
                                                                type="checkbox"
                                                                checked={option.state}
                                                                onChange={(e) => handleCheckbox(e, option)}
                                                                className="mr-3"
                                                            />
                                                        </div>
                                                    ))}
                                            </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="relative inline-block text-left">
                                    <Button type="button" onClick={() => setReload(prev => !prev)} className="flex px-4 py-4 ml-2 "> Refresh </Button>
                                </div>
                                <div className="flex justify-end ml-auto">
                                    <ContentForm
                                        type="Create"
                                        currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                        currentName=""
                                        currentURL=""
                                        currentContentOwner="Select Content Owner"
                                        currentRole= "Select Role"
                                        currentExpirationDate={new Date()}
                                        currentExpirationTime="10:30:00"
                                        currentStatus="Select Status"
                                        size={true}
                                        lock="none"
                                        refresh={setReload}
                                        roles={roles}
                                    />
                                </div>
                            </div>
                            <div className="flex ">
                                <TabsList>
                                    <TabsTrigger value="All">All</TabsTrigger>
                                    <TabsTrigger value="ActuarialAnalyst">Actuarial Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessAnalyst">Business Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessOperator">Business Operator</TabsTrigger>
                                    <TabsTrigger value="ExcelOperator">Excel Operator</TabsTrigger>
                                    <TabsTrigger value="UnderWriter">Under Writer</TabsTrigger>
                                    <TabsTrigger value="OwnedByMe">Owned By Me</TabsTrigger>
                                </TabsList>
                            </div>
                        </div>
                        <div className="py-1 mb-1 flex flex-row flex-wrap gap-2">
                            {filters.map((option) => (
                                <div key={option.id} className=" flex  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
                                    <p className=" px-2 py-1 text-gray-800 rounded-md text-xs "> {option.id}</p>
                                    <button onClick={() => {
                                        setFilters((filter) => filter.filter((filterId) => filterId !== option));
                                        if (option.key == "assigned_role" || option.key == "content_owner") {
                                            if (tab !== "All") {
                                                setTab("All")
                                            }
                                        }
                                        setDocFilters(dcFilters =>
                                            dcFilters.map(filter =>
                                                (filter.id === option.id && filter.state) ? { ...filter, state: false } : filter
                                            )
                                        );
                                        setFileFilters(fiFilters =>
                                            fiFilters.map(filter =>
                                                (filter.id === option.id && filter.state) ? { ...filter, state: false } : filter
                                            )
                                        );
                                        setRoleFilters(rlFilters =>
                                            rlFilters.map(filter =>
                                                (filter.id === option.id && filter.state) ? { ...filter, state: false } : filter
                                            )
                                        );
                                        setTagFilters(tgFilters =>
                                            tgFilters.map(filter =>
                                                (filter.id === option.id && filter.state) ? { ...filter, state: false } : filter
                                            )
                                        );
                                        setStatusFilters(stFilters =>
                                            stFilters.map(filter =>
                                                (filter.id === option.id && filter.state) ? { ...filter, state: false } : filter
                                            )
                                        );
                                        setMyDocumentsButton(myFilters =>
                                            myFilters.map(filter =>
                                                (filter.id === option.id && filter.state) ? { ...filter, state: false } : filter
                                            )
                                        );
                                    }} className="text-black pr-2">
                                        <div className="ml-1"><HugeiconsIcon size={16} icon={X}/></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Table className="border rounded-lg overflow-hidden">
                            <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableHead className=" text-[#0b4461] text-left px-5"> Favorite </TableHead>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className=" text-[#0b4461] text-left px-5" key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                        <TableHead className="text-[#0b4461] px-5 text-right">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const doc = row.original;

                                    return (
                                        (doc.lock === "none" || doc.lock === empID) ? (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={doc}
                                                onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                onToggleOff={(doc) => toggleFavorite(doc, true)}
                                            />

                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            {doc.lock === "none"?(
                                            <TableCell>
                                                <div className="flex items-center gap-1 justify-end">
                                                    {/*<a*/}
                                                    {/*    href={doc.url}*/}
                                                    {/*    target="_blank"*/}
                                                    {/*    rel="noopener noreferrer"*/}
                                                    {/*    className="hover:underline"*/}
                                                    {/*    download*/}
                                                    {/*>*/}
                                                    {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                    {/*</a>*/}
                                                    <Button onClick={async () => await handleDownload(doc)}>
                                                        <HugeiconsIcon icon={Download01Icon} />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground" onClick={async () => {
                                                        const token = await getToken();
                                                        await setDocumentLock(token, doc.id, true)
                                                    }}><Lock /></Button>
                                                </div>
                                            </TableCell>
                                                ):
                                                doc.lock === empID ?(
                                            <TableCell>
                                                <div className="flex gap-2 justify-end">
                                                    {doc.lock != "none" && (
                                                    <ContentForm
                                                        type="Edit"
                                                        currentID={doc.id}
                                                        currentName={doc.name}
                                                        currentURL={doc.url}
                                                        currentContentOwner={doc.content_owner}
                                                        currentRole={doc.assigned_role}
                                                        currentExpirationDate={doc.expiration_date}
                                                        currentExpirationTime={"10:30:00"}
                                                        currentStatus={doc.document_status}
                                                        size={false}
                                                        lock={doc.lock}
                                                        refresh={setReload}
                                                        roles={roles}
                                                    />
                                                )}
                                                    <DeleteConfirmationPopup target={doc} refresh={setReload}/>
                                                    {/*<a*/}
                                                    {/*    href={doc.url}*/}
                                                    {/*    target="_blank"*/}
                                                    {/*    rel="noopener noreferrer"*/}
                                                    {/*    className="hover:underline"*/}
                                                    {/*    download*/}
                                                    {/*>*/}
                                                    {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                    {/*</a>*/}
                                                    <Button onClick={async () => await handleDownload(doc)}>
                                                        <HugeiconsIcon icon={Download01Icon} />
                                                    </Button>
                                                    <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#6d89a3] text-secondary-foreground" onClick={async () => {
                                                        const token = await getToken();
                                                        await setDocumentLock(token, doc.id, false)
                                                    }}><LockOpen /></Button>

                                                </div>
                                            </TableCell>
                                                    ):(
                                                    <TableCell><p>{doc.lock_name}</p></TableCell> )
                                            }
                                        </TableRow> ) : (
                                            <TableRow key={row.id} className="bg-[#e6e8e8]">
                                                <FavoriteStar
                                                    doc={doc}
                                                    onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                    onToggleOff={(doc) => toggleFavorite(doc, true)}
                                                />
                                                {row.getVisibleCells().map((cell) => (
                                                    <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                    </TableCell>
                                                ))}
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-3">

                                                        <div className="flex flex-col text-right">
                                                            <p className="text-xs">Checked out by:</p>
                                                            <p className="text-sm font-medium">{doc.lock_name}</p>
                                                        </div>

                                                        {/*<a*/}
                                                        {/*    href={doc.url}*/}
                                                        {/*    target="_blank"*/}
                                                        {/*    rel="noopener noreferrer"*/}
                                                        {/*    className="hover:underline"*/}
                                                        {/*    download*/}
                                                        {/*>*/}
                                                        {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                        {/*</a>*/}
                                                        <Button onClick={async () => await handleDownload(doc)}>
                                                            <HugeiconsIcon icon={Download01Icon} />
                                                        </Button>

                                                    </div>
                                                </TableCell>
                                            </TableRow>

                                        )
                                    );
                                })}
                            </TableBody>
                        </Table>
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
                                        key={index}
                                        onClick={() => table.setPageIndex(page)}
                                        size="sm"
                                        variant={currentPage === page ? "default" : "outline"}
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

                        {/* Info popover - bottom left of card */}
                        <div className="absolute bottom-3 left-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="top" align="start" className="w-72">
                                    <p className="font-medium text-sm mb-2">Documents</p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Manage and organize all your documents in one place.
                                    </p>
                                    <div className="space-y-2 mb-3">
                                        <p className="text-xs font-medium text-foreground">Stats</p>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Total documents</span>
                                            <span className="font-medium">{docs.length}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-foreground">Features</p>
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

                    </div>
                </div>
                </Tabs>
            </>
        )
    }
    else{
        return(
            <>
                <Tabs value={tab} onValueChange={setTab}>
                <div className="max-w-10xl mx-auto px-10 w-full py-10">
                    <div className="bg-white rounded-xl shadow-sm border p-4 relative overflow-visible">
                        <div className="flex flex-col">
                            <div className="flex items-center mb-4">
                                <InputGroup
                                    className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                                    <InputGroupInput
                                        placeholder="Search"
                                        value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                                        onChange={(event) =>
                                            table.getColumn("name")?.setFilterValue(event.target.value)
                                        }
                                        className="w-full"
                                    />
                                    <InputGroupAddon>
                                        <Search/>
                                    </InputGroupAddon>
                                </InputGroup>
                                <div className="relative inline-block text-left">
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex px-4 py-1 ml-2 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md"
                                    >
                                        <div className="pr-1"><HugeiconsIcon icon={SlidersHorizontalIcon}/></div>
                                        Filter
                                    </button>
>>>>>>> main

  const downloadDocument = async (doc: documentContent) => {
    try {
      await createNotification(getToken, doc, "downloaded");

<<<<<<< HEAD
      const response = await fetch(doc.url as string);
=======
                                                    {isDocumentOpen && (
                                                        <div
                                                            className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                {docFilters.map((option) => (
                                                                    <div key={option.id}
                                                                         className="flex items-center justify-between">
                                                                        <label htmlFor={option.id}
                                                                               className="text-sm  text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
>>>>>>> main

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

<<<<<<< HEAD
      link.href = url;
      link.download = doc.name || "download";
=======
                                                    {isTypeOpen && (
                                                        <div
                                                            className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-33 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                {fileFilters.map((option) => (
                                                                    <div key={option.id}
                                                                         className="flex items-center justify-between">
                                                                        <label htmlFor={option.id}
                                                                               className="text-sm  text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative inline-block text-left">
                                                    {tab === "All" ?
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        >
                                                            <div className="pr-1"><HugeiconsIcon size={16} icon={UserGroupIcon}/>
                                                            </div>
                                                            Role
                                                        </button>
                                                        <button onClick={() => {
                                                            if (isRoleOpen) {
                                                                setIsRoleOpen(!isRoleOpen)
                                                            }
                                                        }}
                                                                className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div> : null}
>>>>>>> main

      document.body.appendChild(link);
      link.click();
      link.remove();

<<<<<<< HEAD
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
=======
                                                        <div
                                                            className=" flex flex-col gap-4 absolute left-full top-0 z-10 mt-2 ml-3.5 w-46 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                                                            <div className="py-1">
                                                                {roleFilters.map((option) => (
                                                                    <div key={option.id}
                                                                         className="flex items-center justify-between">
                                                                        <label htmlFor={option.id}
                                                                               className="text-sm  text-gray-800 cursor-pointer ml-2 ">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative inline-block text-left">
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isStatusOpen) {
                                                                    setIsStatusOpen(!isStatusOpen)
                                                                }
                                                                setIsTagOpen(!isTagOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36">
                                                        <div className="pr-1"><HugeiconsIcon size={16} icon={PencilEdit02Icon}/></div>
                                                    Custom Tags
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isTagOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {tagFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="relative inline-block text-left">
                                                    <div className="flex gap-x-0.5">
                                                        <button
                                                            onClick={() => {
                                                                if (isTypeOpen) {
                                                                    setIsTypeOpen(!isTypeOpen)
                                                                }
                                                                if (isDocumentOpen) {
                                                                    setIsDocumentOpen(!isDocumentOpen)
                                                                }
                                                                if (isRoleOpen) {
                                                                    setIsRoleOpen(!isRoleOpen)
                                                                }
                                                                if(isTagOpen) {
                                                                    setIsTagOpen(!isTagOpen)
                                                                }
                                                                setIsStatusOpen(!isStatusOpen);
                                                            }}
                                                            className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md hover:bg-gray-300 text-xs w-36"
                                                        ><div className="pr-1"><HugeiconsIcon size={16} icon={DocumentValidationIcon}/></div>
                                                            Status
                                                        </button>
                                                        <button onClick={() => setIsTagOpen(false)} className="text-black">
                                                            <div className="ml-3"><HugeiconsIcon size={16} icon={X}/></div>
                                                        </button>
                                                    </div>

                                                    {isStatusOpen && (
                                                        <div className="flex flex-col gap-2 absolute left-full top-0 z-10 mt-2 ml-3.5 w-40 bg-white shadow-lg rounded-md">
                                                            <div className="py-1">
                                                                {statusFilters.map((option) => (
                                                                    <div key={option.id} className="flex items-center justify-between">
                                                                        <label className="text-sm ml-2">{option.id}</label>
                                                                        <input
                                                                            id={option.id}
                                                                            type="checkbox"
                                                                            checked={option.state}
                                                                            onChange={(e) => handleCheckbox(e, option)}
                                                                            className="mr-3"
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="py-1">
                                                    {myDocumentsButton.map((option) => (
                                                        <div key={option.id} className="flex items-center justify-between">
                                                            <label className="flex px-4 py-1 ml-2 justify-center items-center  text-gray-800 rounded-md  text-xs w-36">{option.id}</label>
                                                            <input
                                                                id={option.id}
                                                                type="checkbox"
                                                                checked={option.state}
                                                                onChange={(e) => handleCheckbox(e, option)}
                                                                className="mr-3"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex justify-end ml-auto">
                                    <Button type="button" onClick={() => setReload(prev => !prev)}> Refresh </Button>
                                    <ContentForm
                                        type="Create"
                                        currentID={Math.trunc((Math.random() * 10000) % 10000)}
                                        currentName=""
                                        currentURL=""
                                        currentContentOwner="Select Content Owner"
                                        currentRole=""
                                        currentExpirationDate={new Date()}
                                        currentExpirationTime="10:30:00"
                                        currentStatus="Select Status"
                                        size={true}
                                        lock="none"
                                        refresh={setReload}
                                        roles={roles}
                                    />
                                </div>
                            </div>
                            <div className="flex ">
                                <TabsList>
                                    <TabsTrigger value="All">All</TabsTrigger>
                                    <TabsTrigger value="ActuarialAnalyst">Actuarial Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessAnalyst">Business Analyst</TabsTrigger>
                                    <TabsTrigger value="BusinessOperator">Business Operator</TabsTrigger>
                                    <TabsTrigger value="ExcelOperator">Excel Operator</TabsTrigger>
                                    <TabsTrigger value="UnderWriter">Under Writer</TabsTrigger>
                                    <TabsTrigger value="OwnedByMe">Owned By Me</TabsTrigger>
                                </TabsList>
                            </div>
                        </div>
                        <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
                            {filters.map((option) => (
                                <div key={option.id} className=" flex  rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 ">
                                    <p className=" px-2 py-1 text-gray-800 rounded-md text-xs "> {option.id}</p>
                                    <button onClick={() => {
                                        setFilters((filter) => filter.filter((filterId) => filterId !== option));
                                        if (option.key == "assigned_role" || option.key == "content_owner") {
                                            if (tab !== "All") {
                                                setTab("All")
                                            }
                                        }
                                        setDocFilters(dcFilters =>
                                            dcFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setFileFilters(fiFilters =>
                                            fiFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setRoleFilters(rlFilters =>
                                            rlFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setTagFilters(tgFilters =>
                                            tgFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setStatusFilters(stFilters =>
                                            stFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                        setMyDocumentsButton(myFilters =>
                                            myFilters.map(filter =>
                                                filter.id === option.id ? { ...filter, state: !filter.state } : filter
                                            )
                                        );
                                    }} className="text-black pr-2">
                                        <div className="ml-1"><HugeiconsIcon size={16} icon={X}/></div>
                                    </button>
                                </div>
                            ))}
                        </div>
                        <Table className="border rounded-lg overflow-hidden">
                            <TableHeader className="bg-[#ecf4f9] text-[#0b4461] text-left">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <TableRow key={headerGroup.id}>
                                        <TableHead className=" text-[#0b4461] text-left px-5"> Favorite </TableHead>
                                        {headerGroup.headers.map((header) => {
                                            return (
                                                <TableHead className=" text-[#0b4461] text-left px-5" key={header.id}>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )}
                                                </TableHead>
                                            )
                                        })}
                                        <TableHead className="text-[#0b4461] px-5 text-right pr-30">Actions</TableHead>
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.map((row) => {
                                    const doc = row.original;

                                    const canEdit =
                                        ((roles.includes("underwriter") && doc.assigned_role === "UnderWriter")) ||
                                        ((roles.includes("businessanalyst") && doc.assigned_role === "BusinessAnalyst")) ||
                                        ((roles.includes("actuarialanalyst") && doc.assigned_role === "ActuarialAnalyst")) ||
                                        ((roles.includes("exceloperator") && doc.assigned_role === "ExcelOperator")) ||
                                        ((roles.includes("businessoperator") && doc.assigned_role === "BusinessOperator"))

                                    return (
                                        (doc.lock === "none" || doc.lock === empID) ? (
                                        <TableRow key={row.id}>
                                            <FavoriteStar
                                                doc={doc}
                                                onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                onToggleOff={(doc) => toggleFavorite(doc, true)}
                                            />
                                            {row.getVisibleCells().map((cell) => (
                                                <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                            {!canEdit ? (
                                                <TableCell>
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/*<a*/}
                                                        {/*    href={doc.url}*/}
                                                        {/*    target="_blank"*/}
                                                        {/*    rel="noopener noreferrer"*/}
                                                        {/*    className="hover:underline"*/}
                                                        {/*    download*/}
                                                        {/*>*/}
                                                        {/*    <HugeiconsIcon icon={Download01Icon}/>*/}
                                                        {/*</a>*/}
                                                        <Button onClick={async () => await handleDownload(doc)}>
                                                            <HugeiconsIcon icon={Download01Icon} />
                                                        </Button>
                                                    </div>
                                                </TableCell> ) :
                                            doc.lock === "none" ? (
                                                        <TableCell>
                                                            <div className="flex items-center justify-end gap-2">
                                                                {/*<a*/}
                                                                {/*    href={doc.url}*/}
                                                                {/*    target="_blank"*/}
                                                                {/*    rel="noopener noreferrer"*/}
                                                                {/*    className="hover:underline"*/}
                                                                {/*    download*/}
                                                                {/*>*/}
                                                                {/*    <HugeiconsIcon icon={Download01Icon}/>*/}
                                                                {/*</a>*/}
                                                                <Button onClick={async () => await handleDownload(doc)}>
                                                                    <HugeiconsIcon icon={Download01Icon} />
                                                                </Button>
                                                                <Button variant="outline" size="icon"
                                                                        className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
                                                                        onClick={async () => {
                                                                            const token = await getToken();
                                                                            await setDocumentLock(token, doc.id, true)
                                                                        }}><Lock/></Button>
                                                            </div>
                                                        </TableCell>
                                                ) :
                                                doc.lock === empID ? (
                                                    <TableCell>
                                                        <div className="flex gap-2 justify-end">
                                                            {canEdit && (
                                                                <ContentForm
                                                                    type="Edit"
                                                                    currentID={doc.id}
                                                                    currentName={doc.name}
                                                                    currentURL={doc.url!}
                                                                    currentContentOwner={doc.content_owner!}
                                                                    currentRole={doc.assigned_role!}
                                                                    currentExpirationDate={doc.expiration_date}
                                                                    currentExpirationTime="10:30:00"
                                                                    currentStatus={doc.document_status}
                                                                    size={false}
                                                                    lock={doc.lock}
                                                                    refresh={setReload}
                                                                    roles={roles}
                                                                />
                                                            )}

                                                            {canEdit && (
                                                                <DeleteConfirmationPopup target={doc} refresh={setReload} />
                                                            )}
                                                            {/*<a*/}
                                                            {/*    href={doc.url}*/}
                                                            {/*    target="_blank"*/}
                                                            {/*    rel="noopener noreferrer"*/}
                                                            {/*    className="hover:underline"*/}
                                                            {/*    download*/}
                                                            {/*>*/}
                                                            {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                            {/*</a>*/}
                                                            <Button onClick={async () => await handleDownload(doc)}>
                                                                <HugeiconsIcon icon={Download01Icon} />
                                                            </Button>
                                                            <Button variant="outline" size="icon" className="px-4 py-3 text-base bg-[#6d89a3] text-secondary-foreground" onClick={async () => {
                                                                const token = await getToken();
                                                                await setDocumentLock(token, doc.id, false)
                                                            }}><LockOpen /></Button>
                                                        </div>
                                                    </TableCell>) : (
                                                    <div className="flex flex-col text-right">
                                                        <p className="text-xs">Checked out by:</p>
                                                        <p className="text-sm font-medium">{doc.lock_name}</p>
                                                    </div>)
                                            }
                                        </TableRow>
                                            ): (
                                                <TableRow key={row.id} className="bg-[#e6e8e8]">
                                                    <FavoriteStar
                                                        doc={doc}
                                                        onToggleOn={(doc) => toggleFavorite(doc, false)}
                                                        onToggleOff={(doc) => toggleFavorite(doc, true)}
                                                    />
                                                    {row.getVisibleCells().map((cell) => (
                                                        <TableCell key={cell.id} className="px-5 py-0.5 text-left whitespace-normal">
                                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                        </TableCell>
                                                    ))}
                                                    <TableCell>
                                                        <div className="flex items-center justify-end gap-3">

                                                            <div className="flex flex-col text-right">
                                                                <p className="text-xs">Checked out by:</p>
                                                                <p className="text-sm font-medium">{doc.lock_name}</p>
                                                            </div>

                                                            {/*<a*/}
                                                            {/*    href={doc.url}*/}
                                                            {/*    target="_blank"*/}
                                                            {/*    rel="noopener noreferrer"*/}
                                                            {/*    className="hover:underline"*/}
                                                            {/*    download*/}
                                                            {/*>*/}
                                                            {/*    <HugeiconsIcon icon={Download01Icon} />*/}
                                                            {/*</a>*/}
                                                            <Button onClick={async () => await handleDownload(doc)}>
                                                                <HugeiconsIcon icon={Download01Icon} />
                                                            </Button>

                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                        )
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Info popover - bottom left of card */}
                        <div className="absolute bottom-3 left-3">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button size="icon" variant="ghost" className="h-7 w-7 text-muted-foreground hover:text-foreground">
                                        <Info className="h-4 w-4" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent side="top" align="start" className="w-72">
                                    <p className="font-medium text-sm mb-2">Documents</p>
                                    <p className="text-xs text-muted-foreground mb-3">
                                        Manage and organize all your documents in one place.
                                    </p>
                                    <div className="space-y-2 mb-3">
                                        <p className="text-xs font-medium text-foreground">Stats</p>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-muted-foreground">Total documents</span>
                                            <span className="font-medium">{docs.length}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-xs font-medium text-foreground">Features</p>
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
                            typeof page === "number"? (
                                <Button
                                    className="h-8 w-8 p-0"
                                    key={index}
                                    onClick={() => table.setPageIndex(page)}
                                    size="sm"
                                    variant={currentPage === page ? "default" : "outline"}
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
            </>
        )
>>>>>>> main
    }
  };

  const updateLock = async (doc: documentContent, status: boolean) => {
    const token = await getToken();

    await setDocumentLock(token, doc.id, status);
    setReload((current) => !current);
  };

  const canEdit = (doc: documentContent) => {
    return isAdmin || roles.includes(editableRoleByDocumentRole[doc.assigned_role as string]);
  };

  const renderActions = (doc: documentContent) => {
    const lockedByMe = doc.lock === empID;
    const available = doc.lock === "none";
    const editable = canEdit(doc);

    if (!editable) {
      return (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => downloadDocument(doc)}>
            <HugeiconsIcon icon={Download01Icon} />
          </Button>
        </div>
      );
    }

    if (available) {
      return (
        <div className="flex items-center justify-end gap-2">
          <Button onClick={() => downloadDocument(doc)}>
            <HugeiconsIcon icon={Download01Icon} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
            onClick={() => updateLock(doc, true)}
          >
            <Lock />
          </Button>
        </div>
      );
    }

    if (lockedByMe) {
      return (
        <div className="flex gap-2 justify-end">
          <ContentForm
            type="Edit"
            currentID={doc.id}
            currentName={doc.name}
            currentURL={doc.url as string}
            currentContentOwner={doc.content_owner as string}
            currentRole={doc.assigned_role as string}
            currentExpirationDate={doc.expiration_date}
            currentExpirationTime="10:30:00"
            currentStatus={doc.document_status}
            size={false}
            lock={doc.lock as string}
            refresh={setReload}
            roles={roles}
          />

          <DeleteConfirmationPopup target={doc} refresh={setReload} />

          <Button onClick={() => downloadDocument(doc)}>
            <HugeiconsIcon icon={Download01Icon} />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="px-4 py-3 text-base bg-[#c5e6e8] text-secondary-foreground"
            onClick={() => updateLock(doc, false)}
          >
            <LockOpen />
          </Button>
        </div>
      );
    }

    return (
      <div className="flex items-center justify-end gap-3">
        <CheckedOutBy doc={doc} />

        <Button onClick={() => downloadDocument(doc)}>
          <HugeiconsIcon icon={Download01Icon} />
        </Button>
      </div>
    );
  };

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <div className="max-w-10xl mx-auto px-10 w-full py-10">
        <div className="bg-white rounded-xl shadow-sm border p-4 relative overflow-visible">
          <div className="flex flex-col">
            <div className="flex items-center mb-4">
              <InputGroup className="flex-1 max-w-2xl h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-white">
                <InputGroupInput
                  placeholder="Search"
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => {
                    table.getColumn("name")?.setFilterValue(event.target.value);
                  }}
                  className="w-full"
                />

                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
              </InputGroup>

              <div className="relative inline-block text-left">
                <button
                  onClick={() => setIsDropdownOpen((open) => !open)}
                  className="flex px-4 py-1 ml-2 bg-gray-400 text-white rounded-md hover:bg-gray-600"
                >
                  <span className="pr-1">
                    <HugeiconsIcon icon={SlidersHorizontalIcon} />
                  </span>
                  Filter
                </button>

                {isDropdownOpen && (
                  <FilterMenu
                    groups={filterGroups}
                    activeGroup={activeFilterGroup}
                    onActiveGroupChange={setActiveFilterGroup}
                    onFilterChange={handleFilterChange}
                  />
                )}
              </div>

              <Button
                type="button"
                onClick={() => setReload((current) => !current)}
                className="ml-2"
              >
                Refresh
              </Button>

              <div className="flex justify-end ml-auto">
                <CreateDocumentButton roles={roles} refresh={setReload} />
              </div>
            </div>

            <TabsList>
              {ROLE_TABS.map(([value, label]) => (
                <TabsTrigger key={value} value={value}>
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <SelectedFilters filters={selectedFilters} onRemove={removeFilter} />

          <Table className="border rounded-lg overflow-hidden">
            <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  <TableHead className="text-[#0b4461] text-left px-5">
                    Favorite
                  </TableHead>

                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="text-[#0b4461] text-left px-5"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}

                  <TableHead className="text-[#0b4461] px-5 text-right">
                    Actions
                  </TableHead>
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.map((row) => {
                const doc = row.original;
                const isLockedBySomeoneElse = doc.lock !== "none" && doc.lock !== empID;

                return (
                  <TableRow
                    key={row.id}
                    className={isLockedBySomeoneElse ? "bg-[#e6e8e8]" : undefined}
                  >
                    <FavoriteStar
                      doc={doc}
                      onToggleOn={(doc) => toggleFavorite(doc as documentContent, false)}
                      onToggleOff={(doc) => toggleFavorite(doc as documentContent, true)}
                    />

                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-5 py-0.5 text-left whitespace-normal"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}

                    <TableCell>{renderActions(doc)}</TableCell>
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

          <InfoPopover totalDocuments={docs.length} />
        </div>
      </div>
    </Tabs>
  );
}

function CheckedOutBy({ doc }: { doc: documentContent }) {
  return (
    <div className="flex flex-col text-right">
      <p className="text-xs">Checked out by:</p>
      <p className="text-sm font-medium">{doc.lock_name}</p>
    </div>
  );
}