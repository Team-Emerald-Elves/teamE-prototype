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

const DOCUMENT_FILTERS: FilterItem[] = ["Reference", "Workflow"].map((type) => ({
  key: "document_type",
  value: type,
  id: type,
  state: false,
}));

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

      const data = await res.json();

      setEmpID(data.id);
      setRoles((data.roles as string[]).map((role) => role.toLowerCase()));
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

  const downloadDocument = async (doc: documentContent) => {
    try {
      await createNotification(getToken, doc, "downloaded");

      const response = await fetch(doc.url as string);

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