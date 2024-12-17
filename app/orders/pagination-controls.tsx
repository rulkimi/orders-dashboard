import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const PaginationControls = ({ table, goToPageValue, setGoToPageValue, data }: any) => {
  const { toast } = useToast();

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <label>
            Rows per page:
            <Button className="ml-2" variant="outline">
              {table.getState().pagination.pageSize}
            </Button>
          </label>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
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

      <label>
        Go to page
        <Input
          type="number"
          className="w-[50px] text-center inline-block ml-1 h-[32px]"
          value={goToPageValue}
          onChange={(e) => setGoToPageValue(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              const totalPages = Math.ceil(data.length / table.getState().pagination.pageSize);
              if (Number(goToPageValue) > totalPages || Number(goToPageValue) < 1) {
                toast({ variant: "destructive", description: `Page ${goToPageValue} is out of range.` })
                return; 
              }
              table.setPageIndex(Number(goToPageValue) - 1);
            }
          }}
        />
      </label>

      <div className="px-6">
        Page {table.getState().pagination.pageIndex + 1} of{" "}
        {Math.ceil(data.length / table.getState().pagination.pageSize)}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => table.setPageIndex(0)} 
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronLeft size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.nextPage()} 
        disabled={!table.getCanNextPage()}
      >
        <ChevronRight size={16} />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight size={16} />
      </Button>
    </div>
  );
};
