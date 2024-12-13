"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type Order = {
  id: string
  buyer: string
  merchant: string
  status: "pending" | "preparing" | "waitpickup" | "cancel" | "refund" | "completed" | "nopickup"
  amount: number
  date: string
}

export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID"
  },
  {
    accessorKey: "buyer",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Buyer
          <ArrowUpDown className="h-4 w-4" />
        </div>
      )
    }
  },
  {
    accessorKey: "merchant",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Merchant
          <ArrowUpDown className="h-4 w-4" />
        </div>
      )
    }
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return <div className="text-center">Status</div>
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.getValue("status")}</div>
    }
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>Date/Time</span>
          <ArrowUpDown className="h-4 w-4" />
        </div>
      )
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <div className="flex items-center gap-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          <span>Amount</span>
          <ArrowUpDown className="h-4 w-4" />
        </div>
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-MY", {
        style: "currency",
        currency: "MYR",
      }).format(amount)
 
      return <div className="text-left font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    header: "More",
    cell: ({ row }) => {
      const payment = row.original
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
            <DropdownMenuItem>View Sales Order Details</DropdownMenuItem>
            <DropdownMenuItem>View Transaction</DropdownMenuItem>

            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Delete this Order</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]