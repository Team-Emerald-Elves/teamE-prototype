"use client";

import * as React from "react";
import { useEffect, useMemo, useState } from "react";
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
import { Search, Info } from "lucide-react";
import { HugeiconsIcon } from "@hugeicons/react";
import { SlidersHorizontalIcon, X } from "@hugeicons/core-free-icons";

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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover.tsx";
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group";

import CreateEmployeeForm from "@/components/createEmployeeForm.tsx";
import EmployeeConfirmationPopup from "@/components/deletePopupConfirmationEmployee.tsx";
import EmployeeForm from "@/components/employeeForm.tsx";
import qmgr from "@/lib/querymgr.ts";
import { type Employee } from "@repo/database/types";

interface EmployeeProps {
    columns: ColumnDef<Employee, unknown>[];
}

type RoleFilter = {
    key: "roles";
    value: string;
    id: string;
    state: boolean;
};

const initialRoleFilters: RoleFilter[] = [
    {
        key: "roles",
        value: "ActuarialAnalyst",
        id: "Actuarial Analyst",
        state: false,
    },
    {
        key: "roles",
        value: "Administrator",
        id: "Administrator",
        state: false,
    },
    {
        key: "roles",
        value: "BusinessAnalyst",
        id: "Business Analyst",
        state: false,
    },
    {
        key: "roles",
        value: "BusinessOperator",
        id: "Business Operator",
        state: false,
    },
    {
        key: "roles",
        value: "ExcelOperator",
        id: "Excel Operator",
        state: false,
    },
    {
        key: "roles",
        value: "UnderWriter",
        id: "Underwriter",
        state: false,
    },
];

export default function EmployeeTable({ columns }: EmployeeProps) {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [roleFilters, setRoleFilters] =
        useState<RoleFilter[]>(initialRoleFilters);
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const [reload, setReload] = useState(false);

    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] =
        React.useState<ColumnFiltersState>([]);

    useEffect(() => {
        qmgr.wait(async () => {
            qmgr.getEmployees(async (res) => {
                if (!res.success) {
                    console.error(res.error);
                    return;
                }

                setEmployees(res.data ?? []);
            });
        });
    }, [reload]);

    const activeRoleFilters = useMemo(
        () => roleFilters.filter((filter) => filter.state),
        [roleFilters],
    );

    const filteredEmployees = useMemo(() => {
        if (activeRoleFilters.length === 0) {
            return employees;
        }

        return employees.filter((employee) => {
            const roles = (
                employee as Employee & {
                    roles?: string[] | string | null;
                }
            ).roles;

            if (!roles) {
                return false;
            }

            if (Array.isArray(roles)) {
                return activeRoleFilters.some((filter) =>
                    roles.includes(filter.value),
                );
            }

            return activeRoleFilters.some((filter) => filter.value === roles);
        });
    }, [employees, activeRoleFilters]);

    const table = useReactTable({
        data: filteredEmployees,
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

    const handleCheckbox = (
        e: React.ChangeEvent<HTMLInputElement>,
        option: RoleFilter,
    ) => {
        const { checked } = e.target;

        setRoleFilters((currentFilters) =>
            currentFilters.map((filter) =>
                filter.id === option.id
                    ? {
                          ...filter,
                          state: checked,
                      }
                    : filter,
            ),
        );
    };

    const removeRoleFilter = (option: RoleFilter) => {
        setRoleFilters((currentFilters) =>
            currentFilters.map((filter) =>
                filter.id === option.id
                    ? {
                          ...filter,
                          state: false,
                      }
                    : filter,
            ),
        );
    };

    return (
        <div className="max-w-10xl mx-auto px-10 py-10">
            <div className="bg-card rounded-xl shadow-sm border p-4 relative overflow-visible">
                <div className="flex items-center mb-4">
                    <InputGroup className="flex-1 max-w-sm h-8 border-2 shadow-md hover:shadow-xl transition-all duration-100 bg-input">
                        <InputGroupInput
                            placeholder="Search"
                            value={
                                (table
                                    .getColumn("full_name")
                                    ?.getFilterValue() as string) ?? ""
                            }
                            onChange={(event) =>
                                table
                                    .getColumn("full_name")
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
                            onClick={() => setIsRoleOpen((open) => !open)}
                            className="flex px-4 py-1 ml-2 bg-primary text-primary-foreground hover:bg-primary/80 rounded-md"
                        >
                            <div className="pr-1">
                                <HugeiconsIcon icon={SlidersHorizontalIcon} />
                            </div>
                            Filter
                        </button>

                        {isRoleOpen && (
                            <div className="absolute right-0 mt-2 z-10 w-48 origin-top-right rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5">
                                <div className="py-1">
                                    {roleFilters.map((option) => (
                                        <div
                                            key={option.id}
                                            className="flex items-center justify-between"
                                        >
                                            <label
                                                htmlFor={option.id}
                                                className="text-sm font-medium text-(--subheader-color) cursor-pointer ml-2"
                                            >
                                                {option.id}
                                            </label>

                                            <input
                                                id={option.id}
                                                type="checkbox"
                                                checked={option.state}
                                                onChange={(e) =>
                                                    handleCheckbox(e, option)
                                                }
                                                className="h-4 w-4 rounded border-gray-300 hover:bg-gray-600 focus:bg-gray-600 cursor-pointer mr-3"
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end ml-auto">
                        <CreateEmployeeForm reload={setReload} />
                    </div>
                </div>

                <div className="py-1 mb-2 flex flex-row flex-wrap gap-2">
                    {activeRoleFilters.map((option) => (
                        <div
                            key={option.id}
                            className="flex rounded-md bg-card shadow-lg ring-1 ring-black ring-opacity-5"
                        >
                            <p className="px-2 py-1 text-(--subheader-color) rounded-md text-xs">
                                {option.id}
                            </p>

                            <button
                                onClick={() => removeRoleFilter(option)}
                                className="text-black pr-2"
                            >
                                <div className="ml-1">
                                    <HugeiconsIcon size={16} icon={X} />
                                </div>
                            </button>
                        </div>
                    ))}
                </div>

                <Table className="border rounded-lg overflow-hidden">
                    <TableHeader className="bg-(--card-header) text-(--table-titles)">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        className="text-(--table-titles) text-center"
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

                                <TableHead className="text-(--table-titles) text-center px-1">
                                    Actions
                                </TableHead>
                            </TableRow>
                        ))}
                    </TableHeader>

                    <TableBody>
                        {table.getRowModel().rows.length > 0 ? (
                            table.getRowModel().rows.map((row) => {
                                const employee = row.original;

                                return (
                                    <TableRow key={row.id}>
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="px-1 py-0.5 text-center"
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}

                                        <TableCell className="px-1 py-0.5">
                                            <div className="flex gap-2 justify-center">
                                                <EmployeeForm
                                                    employee={{
                                                        ...employee,
                                                        email:
                                                            employee.email ??
                                                            undefined,
                                                    }}
                                                    reload={setReload}
                                                />

                                                <EmployeeConfirmationPopup
                                                    target={employee.id}
                                                    reload={setReload}
                                                />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + 1}
                                    className="h-24 text-center"
                                >
                                    No employees found.
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
                                User Management
                            </p>

                            <p className="text-xs text-muted-foreground mb-3">
                                Manage employees and their roles.
                            </p>

                            <div className="space-y-2 mb-3">
                                <p className="text-xs font-medium text-foreground">
                                    Stats
                                </p>

                                <div className="flex justify-between text-xs">
                                    <span className="text-muted-foreground">
                                        Total employees
                                    </span>
                                    <span className="font-medium">
                                        {employees.length}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs font-medium text-foreground">
                                    Features
                                </p>

                                <ul className="text-xs text-muted-foreground space-y-1">
                                    <li>Create new employee accounts</li>
                                    <li>Edit employee details and roles</li>
                                    <li>Delete employees from the system</li>
                                    <li>Search employees by name</li>
                                    <li>Filter employees by role</li>
                                </ul>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
        </div>
    );
}
