"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"



export type Order = {
  id: string
  buyer: string
  merchant: string
  status: "pending" | "preparing" | "waitpickup" | "cancel" | "refund" | "completed" | "nopickup"
  amount: number
  date: string
}

export type OrderStatus = Order["status"]


export const columns: ColumnDef<Order>[] = [
  {
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      return (
        <span className="font-bold">{row.original.id}</span>
      )
    }
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
  },
  {
    id: "date",
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
    header: "More"
  },
]
