import * as React from "react"
import { MoreHorizontal, GripVertical, Eye, Edit, Trash2 } from "lucide-react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationRowsPerPage,
  PaginationText,
} from "../../../components/ui/pagination"
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
} from "../../../components/ui/table"

interface InvoicesTableProps {
  invoices: any[]
  selectedRows: number[]
  hoveredRow: number | null
  openDropdown: number | null
  itemsPerPage: number
  currentPage: number
  totalPages: number
  onToggleRowSelection: (id: number) => void
  onToggleAllRows: () => void
  onToggleDropdown: (id: number) => void
  onOpenPanelView: (invoice: any) => void
  onOpenPanelEdit: (invoice: any) => void
  onOpenDeleteModal: (invoice: any) => void
  onSetItemsPerPage: (val: number) => void
  onSetCurrentPage: (val: number) => void
}

const InvoicesTable: React.FC<InvoicesTableProps> = ({
  invoices,
  selectedRows,
  hoveredRow,
  openDropdown,
  itemsPerPage,
  currentPage,
  totalPages,
  onToggleRowSelection,
  onToggleAllRows,
  onToggleDropdown,
  onOpenPanelView,
  onOpenPanelEdit,
  onOpenDeleteModal,
  onSetItemsPerPage,
  onSetCurrentPage,
}) => (
  <>
    <TableContainer>
      <Table style={{ border: 'none', borderCollapse: 'collapse' }}>
        <TableHeader>
          <TableRow className="border-b border-border bg-muted/20">
            <TableHead className="w-12" style={{ border: 'none' }}>
              <input type="checkbox" onChange={onToggleAllRows} checked={selectedRows.length === invoices.length} />
            </TableHead>
            <TableHead style={{ border: 'none' }}>N°</TableHead>
            <TableHead style={{ border: 'none' }}>Client</TableHead>
            <TableHead style={{ border: 'none' }}>Date</TableHead>
            <TableHead style={{ border: 'none' }}>Montant</TableHead>
            <TableHead style={{ border: 'none' }}>Statut</TableHead>
            <TableHead className="w-12" style={{ border: 'none' }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((inv) => (
            <TableRow
              key={inv.id}
              style={{ backgroundColor: hoveredRow === inv.id ? 'rgba(0,0,0,0.1)' : 'var(--background)' }}
            >
              <TableCell>
                <input type="checkbox" checked={selectedRows.includes(inv.id)} onChange={() => onToggleRowSelection(inv.id)} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-muted-foreground" />
                  <span className="text-sm font-nomal text-foreground">{inv.number}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{inv.client}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{inv.date}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{inv.amount}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{inv.status}</span>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <button className="text-muted-foreground hover:text-foreground rounded-none border border-border flex items-center justify-center" onClick={() => onToggleDropdown(inv.id)}>
                    <MoreHorizontal size={16} />
                  </button>
                  {openDropdown === inv.id && (
                    <div className="absolute right-0 bottom-8 w-32 bg-card border border-border rounded-none shadow-lg z-[10000] fadeInDown" style={{ zIndex: 10000 }}>
                      <button onClick={() => onOpenPanelView(inv)} className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2">
                        <Eye size={12} />
                        Voir
                      </button>
                      <button onClick={() => onOpenPanelEdit(inv)} className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2">
                        <Edit size={12} />
                        Éditer
                      </button>
                      <button onClick={() => onOpenDeleteModal(inv)} className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2 text-red-500 hover:text-red-400">
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>

    <Pagination>
      <PaginationText>
        {selectedRows.length} of {invoices.length} invoice(s) selected.
      </PaginationText>
      <PaginationContent>
        <PaginationItem>
          <PaginationText>Rows per page</PaginationText>
          <PaginationRowsPerPage value={itemsPerPage} onChange={(e) => onSetItemsPerPage(Number(e.target.value))} />
        </PaginationItem>
        <PaginationText>
          Page {currentPage} of {totalPages}
        </PaginationText>
        <PaginationItem>
          <PaginationFirst onClick={() => onSetCurrentPage(1)} isDisabled={currentPage === 1} />
          <PaginationPrevious onClick={() => onSetCurrentPage(Math.max(1, currentPage - 1))} isDisabled={currentPage === 1} />
          <PaginationNext onClick={() => onSetCurrentPage(Math.min(totalPages, currentPage + 1))} isDisabled={currentPage === totalPages} />
          <PaginationLast onClick={() => onSetCurrentPage(totalPages)} isDisabled={currentPage === totalPages} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </>
)

export default InvoicesTable 