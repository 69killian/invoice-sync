import React from "react";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  selectedCount?: number;
  itemsPerPage: number;
  itemsPerPageOptions?: number[];
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (itemsPerPage: number) => void;
  onFirstPage: () => void;
  onLastPage: () => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  itemName?: string;
  className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  selectedCount = 0,
  itemsPerPage,
  itemsPerPageOptions = [10, 20, 50],
  onPageChange,
  onItemsPerPageChange,
  onFirstPage,
  onLastPage,
  onPreviousPage,
  onNextPage,
  itemName = "row(s)",
  className = "",
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className={`flex items-center justify-between px-2 text-sm text-foreground bg-background ${className}`}>
      <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
        {selectedCount} of {totalItems} {itemName} selected.
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>Rows per page</span>
          <select 
            className="bg-muted/5 hover:bg-muted border border-border font-thin rounded-none px-3 py-1 text-foreground min-w-16"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          >
            {itemsPerPageOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
        <div style={{ fontFamily: 'Bricolage Grotesque, sans-serif' }}>
          Page {currentPage} of {totalPages}
        </div>
        <div className="flex items-center gap-1">
          <button 
            className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" 
            disabled={currentPage === 1}
            onClick={onFirstPage}
            title="First page"
          >
            <ChevronsLeft size={14} />
          </button>
          <button 
            className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" 
            disabled={currentPage === 1}
            onClick={onPreviousPage}
            title="Previous page"
          >
            <ChevronLeft size={14} />
          </button>
          <button 
            className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" 
            disabled={currentPage === totalPages}
            onClick={onNextPage}
            title="Next page"
          >
            <ChevronRight size={14} />
          </button>
          <button 
            className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" 
            disabled={currentPage === totalPages}
            onClick={onLastPage}
            title="Last page"
          >
            <ChevronsRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination; 