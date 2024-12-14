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

import {
  Dialog,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogContent,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog'
import { DialogDescription } from "@radix-ui/react-dialog"

export type Order = {
  id: string
  buyer: string
  merchant: string
  status: "pending" | "preparing" | "waitpickup" | "cancel" | "refund" | "completed" | "nopickup"
  amount: number
  date: string
}

export type OrderStatus = Order["status"]

const deleteOrder = async (orderId: string) => {
  try {
    const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error(`Failed to delete order with ID ${orderId}. Status: ${response.status}`);
    }

    console.log(`Order with ID ${orderId} deleted successfully.`);
    return await response.json();
  } catch (error: any) {
    console.error(`Error deleting order with ID ${orderId}:`, error.message);
    throw error;
  }
};


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
    header: "More",
    cell: ({ row }) => {

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
            <Dialog>
              <DialogTrigger className="w-full">
                <DropdownMenuItem
                  className="text-red-500"
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => console.log(row.original.id)}
                >
                  Delete this Order
                </DropdownMenuItem>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete Order</DialogTitle>
                  <DialogDescription>
                    This will delete the order.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="secondary">Cancel</Button>
                  </DialogClose>
                  <Button variant="destructive" onClick={() => deleteOrder(row.original.id)}>Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
