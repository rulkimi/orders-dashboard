"use client"

import { useState, useCallback, useRef, useEffect } from "react"
import OrderDetails, { OrderDetailsType } from "@/components/OrderDetails"

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


import { Input } from "@/components/ui/input"

import { MoreHorizontal, EyeIcon, Trash2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuCheckboxItem,
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

import { 
  Search, 
  FilterIcon, 
  ChevronRight, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronsLeft,
  ChevronDown
} from "lucide-react"

interface BaseRow {
  id: string
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  isDashboard?: boolean
}

import Link from "next/link"

import { OrderStatus } from "./columns"

const getStatusStyles = (status: OrderStatus) => {
  switch (status) {
    case "preparing":
      return { styleClass: "bg-yellow-100", text: "Preparing" };
    case "waitpickup":
      return { styleClass: "bg-blue-100", text: "Waiting for pickup..." };
    case "completed":
      return { styleClass: "bg-green-500 text-white", text: "Completed" };
    case "cancel":
      return { styleClass: "bg-gray-200", text: "Cancel" };
    case "pending":
      return { styleClass: "bg-gray-200", text: "Cancel" };
    case "refund":
      return { styleClass: "bg-gray-200", text: "Refund" };
    case "nopickup":
      return { styleClass: "bg-gray-200", text: "Did not pickup" };
    default:
      return { styleClass: "bg-gray-200", text: "Unknown" };
  }
};

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

const updateOrderStatus = async (orderId: string, newStatus: string) => {
  try {
    const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update order with ID ${orderId}. Status: ${response.status}`);
    }

    const updatedOrder = await response.json();
    console.log(`Order with ID ${orderId} updated successfully.`, updatedOrder);
    return updatedOrder;
  } catch (error: any) {
    console.error(`Error updating order with ID ${orderId}:`, error.message);
    throw error;
  }
};

const OrderStatuses: OrderStatus[] = [
  "preparing",
  "waitpickup",
  "completed",
  "cancel",
  "pending",
  "refund",
  "nopickup",
];

export function DataTable<TData extends BaseRow, TValue>({
  columns,
  data,
  isDashboard
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [activeOrderId, setActiveOrderId] = useState<string>()
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({
    id: '',
    items: [{ name: '', price: 0, expiry: '', amount: 0}],
    payment_method: '',
    pickup_time: '',
    subtotal: 0,
    service_tax: 0,
    voucher_applied: 0
  });
  const tableRef = useRef(null)
  let [tableHeight, setTableHeight] = useState(0)
  const [goToPageValue, setGoToPageValue] = useState('5')

  useEffect(() => {
    if (!tableRef.current) return;
    const tableElement = tableRef.current as HTMLElement;
    if (tableElement) {
      setTableHeight(tableElement.clientHeight);
    }
  }, []);

  const fetchOrderDetails = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/order_details/${orderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setActiveOrderId(orderId)
      setOrderDetails(data)
      setShowOrderDetails(true)
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  }, []);

  const table = useReactTable({
    data,
    columns: columns
      .filter(column => !(isDashboard && (column.id === "actions" || column.id === "date")))
      .map((column) => ({
        ...column,
      })),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    }
  })

  return (
    <div>
      <div className="rounded-md border flex">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow>
              <TableHead colSpan={columns.length}>
                {!isDashboard ? (
                  <div className="flex gap-2 py-2 px-1">
                    <Input
                      id="filter-table"
                      placeholder="Filter table..."
                      value={(table.getState().globalFilter as string) ?? ""}
                      onChange={(event) => table.setGlobalFilter(event.target.value)}
                      icon={<Search size={16} />}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline">
                          <FilterIcon />
                          Filter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {
                          table
                          .getAllColumns()
                          .filter((column) => column.getCanHide())
                          .map((column) => {
                            return (
                              <DropdownMenuCheckboxItem
                                key={column.id}
                                className="capitalize"
                                checked={column.getIsVisible()}
                                onCheckedChange={(value) => {
                                  column.toggleVisibility(!!value)
                                }}
                              >
                                {column.id}
                              </DropdownMenuCheckboxItem>
                            )
                          })
                        }
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2 py-2 px-1">
                    <span className="text-gray-400">Sales Orders</span>
                      <Link href="/orders">
                        <Button variant="outline">
                          View All
                        </Button>
                      </Link>
                  </div>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {
                        header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )
                      }
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} className={activeOrderId === row.original.id ? 'bg-slate-100/50' : ''}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "status" ? (
                        (() => {
                          const value = cell.getValue() as OrderStatus;
                          const { styleClass, text } = getStatusStyles(value);
                          return (
                            <div className="flex justify-center">
                              <DropdownMenu>
                                <DropdownMenuTrigger>
                                  <span className={`${styleClass} px-3 py-1 rounded-full text-nowrap flex items-center`}>
                                    {text}
                                    <ChevronDown className="inline-block ml-1" size={16} />
                                  </span>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                                  <DropdownMenuSeparator />
                                  {OrderStatuses.map((status) => (
                                    <DropdownMenuItem
                                      key={status}
                                      onClick={() => updateOrderStatus(row.original.id, status)}
                                    >
                                      {getStatusStyles(status).text}
                                    </DropdownMenuItem>
                                  ))}
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          );
                        })()
                      ) : cell.column.id === "actions" ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="group"
                              onClick={() => fetchOrderDetails(row.getAllCells().find((cell) => cell.column.id === 'id')?.getValue() as string)}
                            >
                              <EyeIcon className="group-hover:visible invisible" />
                              View Sales Order Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="group">
                              <EyeIcon className="group-hover:visible invisible" />
                              View Transaction
                            </DropdownMenuItem>
                
                            <DropdownMenuSeparator />
                            <Dialog>
                              <DialogTrigger className="w-full">
                                <DropdownMenuItem
                                  className="text-red-500 group"
                                  onSelect={(e) => e.preventDefault()}
                                >
                                  <Trash2Icon className="group-hover:visible invisible" />
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
                                  <Button
                                    variant="destructive"
                                    onClick={() => deleteOrder(row.getAllCells().find((cell) => cell.column.id === 'id')?.getValue() as string)}
                                  >
                                    Delete
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length}
                  style={{ textAlign: "center" }}
                >
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {(showOrderDetails && !isDashboard) && (
          <div className="border-l w-2/4">
            <OrderDetails details={orderDetails} onClose={() => setShowOrderDetails(false)} tableHeight={tableHeight}/>
          </div>
        )}
      </div>
      {!isDashboard && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <label>
                Rows per page:
                <Button className="ml-2" size="sm" variant="outline">
                  {table.getState().pagination.pageSize}
                </Button>
              </label>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              {[10, 20, 30, 50, 100].map((pageSize) => (
                <DropdownMenuItem
                  key={pageSize}
                  onClick={() => table.setPageSize(Number(pageSize))}
                >
                  {pageSize}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(1)}
          >
            Go To Page 2
          </Button> */}
          <label>
            Go to page
            <Input
              id="go-to-page"
              type="number"
              className="w-[40px] text-center inline-block ml-1 h-[32px]"
              value={goToPageValue}
              onChange={(e) => setGoToPageValue(e.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  if (Number(goToPageValue) > Math.ceil(data.length / table.getState().pagination.pageSize)) return;
                  table.setPageIndex(Number(goToPageValue) - 1);
                }
              }}
            />
          </label>
          <div className="px-6">
            Page {table.getState().pagination.pageIndex + 1} of {Math.ceil(data.length / table.getState().pagination.pageSize)}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight />
          </Button>
        </div>
      )}
    </div>
  )
}