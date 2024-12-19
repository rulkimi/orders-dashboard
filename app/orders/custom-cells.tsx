import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Dialog, DialogTrigger, DialogTitle, DialogHeader, DialogContent, DialogFooter, DialogClose, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, MoreHorizontal, EyeIcon, Trash2Icon } from "lucide-react";
import { OrderStatus } from "./columns";

export const getStatusStyles = (status: OrderStatus) => {
  const statusMap: Record<OrderStatus, { styleClass: string; text: string }> = {
    preparing: { styleClass: "bg-yellow-100", text: "Preparing" },
    waitpickup: { styleClass: "bg-blue-100", text: "Waiting for pickup..." },
    completed: { styleClass: "bg-green-500 text-white", text: "Completed" },
    cancel: { styleClass: "bg-gray-200", text: "Cancel" },
    pending: { styleClass: "bg-gray-200", text: "Pending" },
    refund: { styleClass: "bg-gray-200", text: "Refund" },
    nopickup: { styleClass: "bg-gray-200", text: "Did not pickup" },
  };
  return statusMap[status] || { styleClass: "bg-gray-200", text: "Unknown" };
};

const OrderStatuses: OrderStatus[] = ["preparing", "waitpickup", "completed", "cancel", "pending", "refund", "nopickup"];

export const StatusCell = ({ row, cell, isDashboard, updateOrderStatus }: any) => {
  const value = cell.getValue() as OrderStatus;
  const { styleClass, text } = getStatusStyles(value);
  return (
    <div className="flex justify-center">
      {isDashboard ? (
        <span className={`${styleClass} px-3 py-1 rounded-full text-nowrap flex items-center`}>{text}</span>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <span className={`${styleClass} px-3 py-1 rounded-full text-nowrap flex items-center`}>
              {text} <ChevronDown className="inline-block ml-1" size={16} />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Change Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {OrderStatuses.map(status => (
              <DropdownMenuItem key={status} onClick={() => updateOrderStatus(row.original.id, status)}>
                {getStatusStyles(status).text}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};

export const ActionsCell = ({ row, fetchOrderDetails, deleteOrder }: any) => (
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="ghost" className="h-8 w-8 p-0">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="h-4 w-4" />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem className="group" onClick={() => fetchOrderDetails(row.original.id)}>
        <EyeIcon className="group-hover:visible invisible" />
        View Sales Order Details
      </DropdownMenuItem>
      <DropdownMenuItem className="group" onClick={() => fetchOrderDetails(row.original.id)}>
        <EyeIcon className="group-hover:visible invisible" />
        View Transaction
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <Dialog>
        <DialogTrigger className="w-full">
          <DropdownMenuItem
            className="text-red-500 group hover:!text-red-500"
            onSelect={e => e.preventDefault()}
          >
            <Trash2Icon className="group-hover:visible invisible" />
            Delete this Order
          </DropdownMenuItem>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Order</DialogTitle>
            <DialogDescription>
              This will delete the order <strong>{row.original.id}</strong>. Are you sure?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <div className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300">Cancel</div>
            </DialogClose>
            <DialogClose>
              <div
                onClick={() => deleteOrder(row.original.id)}
                className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
              >
                Delete
              </div>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DropdownMenuContent>
  </DropdownMenu>
);