"use client";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "./ui/button.tsx";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import DocumentViewer from "@/components/docViewer.tsx";
import { TableCell } from "@/components/ui/table.tsx";
import DocTag from "@/components/doctag.tsx";
import { HugeiconsIcon } from "@hugeicons/react";
import { Download01Icon } from "@hugeicons/core-free-icons";
import * as React from "react";

type Employee = {
    id: string;
    first_name: string;
    last_name: string;
    uname: string;
    email?: string;
    roles?: string[];
    imageUrl: string;
};

export const columns: ColumnDef<Employee>[] = [
    {
        id: "full_name", // important when using accessorFn
        accessorFn: (row) => `${row.first_name} ${row.last_name}`,
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Name
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const emp = row.original;

            return (
                <div className="flex gap-3 text-center items-center">
                    <img className="size-8 rounded-full" src={emp.imageUrl} />
                    {emp.first_name} {emp.last_name}
                </div>
            );
        },
    },

    {
        accessorKey: "uname",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Username
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Email
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
    },
    {
        accessorKey: "roles",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
                >
                    Roles
                    <ArrowUpDown className="ml-2 h-4" />
                </Button>
            );
        },
        cell: ({ row }) => {
            const emp = row.original.roles[0];

            let roleBackground = "bg-gray-200";

            switch (emp) {
                case "Administrator":
                    roleBackground = "bg-purple-400";
                    break;
                case "BusinessAnalyst":
                    roleBackground = "bg-blue-300";
                    break;
                case "UnderWriter":
                    roleBackground = "bg-pink-300";
                    break;
                case "ExcelOperator":
                    roleBackground = "bg-teal-400";
                    break;
                case "BusinessOperator":
                    roleBackground = "bg-violet-300";
                    break;
                case "ActuarialAnalyst":
                    roleBackground = "bg-fuchsia-300";
                    break;
            }

            return (
                <div className="items-center justify-items-center">
                    <DocTag background={roleBackground}>{emp}</DocTag>
                </div>
            );
        },
    },
];
