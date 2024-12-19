"use client";

import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useReactTable, ColumnDef, ColumnFiltersState, SortingState, VisibilityState, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Search, FilterIcon, FileText, FileSpreadsheet, Printer, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { OrderStatus } from "./columns";
import Link from "next/link";
import OrderDetails, { OrderDetailsType } from "@/app/orders/order-details";
import { StatusCell, ActionsCell, getStatusStyles } from "./custom-cells";
import { PaginationControls } from "./pagination-controls";

interface BaseRow {
  id: string;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isDashboard?: boolean;
}

export function DataTable<TData extends BaseRow, TValue>({ columns, data, isDashboard }: DataTableProps<TData, TValue>) {
  const [newData, setData] = useState<TData[]>(data);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [activeOrderId, setActiveOrderId] = useState<string>();
  const [showOrderDetails, setShowOrderDetails] = useState(false);
  const [orderDetails, setOrderDetails] = useState<OrderDetailsType>({
    id: '',
    items: [{ name: '', price: 0, expiry: '', amount: 0 }],
    payment_method: '',
    pickup_time: '',
    subtotal: 0,
    service_tax: 0,
    voucher_applied: 0
  });
  const tableRef = useRef(null);
  const [tableHeight, setTableHeight] = useState(0);
  const [goToPageValue, setGoToPageValue] = useState('5');
  const { toast } = useToast();

  useEffect(() => {
    setData(data);
  }, [data]);

  useEffect(() => {
    if (!tableRef.current) return;
    const tableElement = tableRef.current as HTMLElement;
    setTableHeight(tableElement.clientHeight);
  }, [newData]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/order_details/${orderId}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setActiveOrderId(orderId);
      setOrderDetails(data);
      setShowOrderDetails(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error(`Failed to delete order with ID ${orderId}. Status: ${response.status}`);
      setData(prevData => prevData.filter(order => order.id !== orderId));
      toast({ description: `${orderId} is successfully deleted.` });
    } catch (error) {
      console.error(`Error deleting order with ID ${orderId}:`, error);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!response.ok) throw new Error(`Failed to update order with ID ${orderId}. Status: ${response.status}`);
      setData(prevData => prevData.map(order => (order.id === orderId ? { ...order, status: newStatus } : order)));
      toast({ description: `Status for ${orderId} is updated to ${getStatusStyles(newStatus).text}` });
    } catch (error) {
      console.error(`Error updating order with ID ${orderId}:`, error);
    }
  };

  const buttonUnavailable = (buttonName: string) => {
    toast({ 
      title: 'Feature Unavailable', 
      description: buttonName === 'Sort' ? 'Please click on the column title to sort the items.' : `${buttonName} button not available. Only for display.` 
    })
  }

  const table = useReactTable({
    data: newData ?? data,
    columns: columns.filter(column => !(isDashboard && (column.id === "actions" || column.id === "date"))),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: { sorting, columnFilters, columnVisibility, rowSelection }
  });

  return (
    <div>
      <div className="rounded-2xl border flex">
        <Table ref={tableRef}>
          <TableHeader>
            <TableRow className="table-header">
              <TableHead colSpan={columns.length} className="border-b">
                {!isDashboard ? (
                  <div className="flex gap-2 py-2 px-1 justify-between">
                    <Input
                      id="filter-table"
                      placeholder="Search..."
                      className="max-w-[400px]"
                      value={(table.getState().globalFilter as string) ?? ""}
                      onChange={event => table.setGlobalFilter(event.target.value)}
                      icon={<Search size={16} />}
                    />
                    <div className="flex gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline">
                            <FilterIcon /> Filter
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {table.getAllColumns().filter(column => column.getCanHide()).map(column => (
                            <DropdownMenuCheckboxItem
                              key={column.id}
                              className="capitalize"
                              checked={column.getIsVisible()}
                              onCheckedChange={value => column.toggleVisibility(!!value)}
                            >
                              {column.id}
                            </DropdownMenuCheckboxItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button variant="outline" onClick={() => buttonUnavailable('Sort')}><ArrowUpDown /> Sort</Button>
                      <Button variant="outline" onClick={() => buttonUnavailable('View')}><SlidersHorizontal /> View</Button>
                      <Button variant="outline" onClick={() => buttonUnavailable('Doc File')}><FileText /></Button>
                      <Button variant="outline" onClick={() => buttonUnavailable('Spreadsheet')}><FileSpreadsheet /></Button>
                      <Button variant="outline" onClick={() => buttonUnavailable('Print')}><Printer /></Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center gap-2 py-2 px-1">
                    <span className="text-gray-400">Sales Orders</span>
                    <Link href="/orders">
                      <Button variant="outline">View All</Button>
                    </Link>
                  </div>
                )}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow className="table-header" key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody className="text-nowrap overflow-ellipsis">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map(row => (
                <TableRow key={row.id} className={activeOrderId === row.original.id ? 'bg-teal-100/40' : ''}>
                  {row.getVisibleCells().map(cell => (
                    <TableCell key={cell.id}>
                      {cell.column.id === "status" ? (
                        <StatusCell row={row} cell={cell} isDashboard={isDashboard} updateOrderStatus={updateOrderStatus} />
                      ) : cell.column.id === "actions" ? (
                        <ActionsCell row={row} fetchOrderDetails={fetchOrderDetails} deleteOrder={deleteOrder} />
                      ) : (
                        flexRender(cell.column.columnDef.cell, cell.getContext())
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={table.getVisibleLeafColumns().length} style={{ textAlign: "center" }}>
                  No data available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {showOrderDetails && !isDashboard && (
          <div className="w-full fixed bg-white inset-0 z-20 md:z-0 md:bg-transparent md:relative md:border-l md:w-[600px]">
            <OrderDetails
              details={orderDetails} 
              tableHeight={tableHeight} 
              setData={() => fetchOrderDetails(orderDetails.id)}
              onClose={() => setShowOrderDetails(false)} 
            />
          </div>
        )}
      </div>

      {!isDashboard && (
        <div className="flex items-center justify-end space-x-2 py-4">
          <PaginationControls table={table} goToPageValue={goToPageValue} setGoToPageValue={setGoToPageValue} data={data} />
        </div>
      )}
    </div>
  );
}
