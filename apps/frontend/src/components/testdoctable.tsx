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

import { Search } from "lucide-react";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";
import ContentForm from "@/components/contentForm.tsx";
import DeleteConfirmationPopup from "@/components/deletePopupConfirmation.tsx";

type Document = {
    id: number;
    url: string;
    name: string;
    last_modified: string;
    expiration_date: string;
    mime_type: string;
    role: string;
    contentOwner: string;
    status: string;
};

const Documents: Document[] = [];

const Doc1: Document = {
    id: 1,
    url: "www.testurl.com",
    name: "underwritingrole",
    lastModified: "01/02/2025",
    expirationDate: "01/02/2027",
    mime_type: "reference",
    role: "underwriter",
    contentOwner: "leah",
    status: "not_started",
};

const Doc2: Document = {
    id: 2,
    url: "www.testurl2.com",
    name: "businessanalystrole1",
    lastModified: "03/02/2025",
    expirationDate: "03/02/2027",
    mime_type: "reference",
    role: "businessanalyst",
    contentOwner: "john",
    status: "not_started",
};

Documents.push(Doc1);
Documents.push(Doc2);

interface DocProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

export function TestDoc<TData, TValue>({
    columns,
    data,
}: DocProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);
    const table = useReactTable({
        data,
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

    return (
        <div className="max-w-10xl mx-auto px-6 py-6">
            <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center mb-4">
                    <InputGroup className="max-w-md py-4 border-2 shadow-md hover:shadow-xl transition-all duration-100 cursor-pointer bg-white">
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
                            className="max-w-sm"
                        />
                        <InputGroupAddon>
                            <Search />
                        </InputGroupAddon>
                    </InputGroup>
                    <ContentForm
                        type="Create"
                        currentID={Math.trunc((Math.random() * 10000) % 10000)}
                        currentName="Name..."
                        currentURL="www.example.com"
                        currentContentOwner="Select Content Owner"
                        currentRole="Select Role"
                        currentExpirationDate="Tomorrow"
                        currentExpirationTime="10:30:00"
                        currentStatus="Select Status"
                        size={true}
                    />
                </div>
                <Table className="border rounded-lg overflow-hidden">
                    <TableHeader className="bg-[#ecf4f9] text-[#0b4461]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead
                                            className=" text-[#0b4461]"
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
                                    );
                                })}
                                <TableHead className="text-[#0b4461]">
                                    Actions
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={
                                        row.getIsSelected() && "selected"
                                    }
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext(),
                                            )}
                                        </TableCell>
                                    ))}
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <ContentForm
                                                type="Edit"
                                                currentID={1}
                                                currentName={"example"}
                                                currentURL={"www.example.com"}
                                                currentContentOwner={"alex"}
                                                currentRole={"underwriter"}
                                                currentExpirationDate={"1/2/3"}
                                                currentExpirationTime={"2:30"}
                                                currentStatus={"done"}
                                                size={false}
                                            />

                                            <DeleteConfirmationPopup
                                                target={"null"}
                                            />
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
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
            </div>
        </div>
    );
}
