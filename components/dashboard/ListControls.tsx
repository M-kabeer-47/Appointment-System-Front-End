import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortControlProps {
  sortOrder: "newest" | "oldest";
  onSortChange: (value: "newest" | "oldest") => void;
}

export function SortControl({ sortOrder, onSortChange }: SortControlProps) {
  return (
    <div className="flex bg-slate-100 p-1 rounded-lg">
      <button
        onClick={() => onSortChange("newest")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
          sortOrder === "newest"
            ? "bg-white shadow-sm text-blue-600"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        )}
      >
        Newest First
      </button>
      <button
        onClick={() => onSortChange("oldest")}
        className={cn(
          "px-3 py-1.5 text-xs font-medium rounded-md transition-all",
          sortOrder === "oldest"
            ? "bg-white shadow-sm text-blue-600"
            : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
        )}
      >
        Oldest First
      </button>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center gap-4 mt-6">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="rounded-lg"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </Button>
      <span className="text-sm text-slate-600">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="rounded-lg"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </Button>
    </div>
  );
}
