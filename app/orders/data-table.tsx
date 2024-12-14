"use client"

import { useState, useCallback } from "react"
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

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { 
  Search, 
  FilterIcon, 
  ChevronRight, 
  ChevronsRight, 
  ChevronLeft, 
  ChevronsLeft 
} from "lucide-react"

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

export function DataTable<TData, TValue>({
  columns,
  data,
  isDashboard
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
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
  
  const fetchOrderDetails = useCallback(async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/order_details/${orderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
        <Table>
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
                <TableRow
                  key={row.id}
                  onClick={() => fetchOrderDetails(row.getAllCells().find((cell) => cell.column.id === 'id')?.getValue() as string)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "status" ? (
                        (() => {
                          const value = cell.getValue() as OrderStatus;
                          const { styleClass, text } = getStatusStyles(value);
                          return (
                            <div className="flex justify-center">
                              <span className={`${styleClass} px-3 py-1 rounded-full text-nowrap`}>
                                {text}
                              </span>
                            </div>
                          );
                        })()
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
        {showOrderDetails && (
          <div className="border-l w-2/4">
            <OrderDetails details={orderDetails} onClose={() => setShowOrderDetails(false)}/>
          </div>
        )}
      </div>
      {!isDashboard && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <label htmlFor="rowsPerPage" className="text-sm">
            Rows per page:
          </label>
          <select
            id="rowsPerPage"
            className="text-sm border rounded"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
          >
            {[10, 20, 30, 50, 100].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
          Page {table.getState().pagination.pageIndex + 1} of {Math.ceil(data.length / table.getState().pagination.pageSize)}
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.setPageIndex(1)}
          >
            Go To Page 2
          </Button>
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