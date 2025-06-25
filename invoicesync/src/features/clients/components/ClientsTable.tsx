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
import type { Client } from "../types"

interface ClientsTableProps {
  clients: Client[]
  selectedRows: string[]
  hoveredRow: string | null
  openDropdown: string | null
  itemsPerPage: number
  currentPage: number
  totalPages: number
  onToggleRowSelection: (id: string) => void
  onToggleAllRows: () => void
  onToggleDropdown: (id: string) => void
  onOpenPanelView: (client: Client) => void
  onOpenPanelEdit: (client: Client) => void
  onOpenDeleteModal: (client: Client) => void
  onSetItemsPerPage: (val: number) => void
  onSetCurrentPage: (val: number) => void
}

const ClientsTable: React.FC<ClientsTableProps> = ({
  clients,
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
              <input type="checkbox" onChange={onToggleAllRows} checked={selectedRows.length === clients.length} />
            </TableHead>
            <TableHead style={{ border: 'none' }}>Nom</TableHead>
            <TableHead style={{ border: 'none' }}>Email</TableHead>
            <TableHead style={{ border: 'none' }}>Téléphone</TableHead>
            <TableHead style={{ border: 'none' }}>Status</TableHead>
            <TableHead style={{ border: 'none' }}>Chiffre d'affaires</TableHead>
            <TableHead className="w-12" style={{ border: 'none' }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((c) => (
            <TableRow key={c.id} style={{ backgroundColor: hoveredRow === c.id ? 'rgba(0,0,0,0.1)' : 'var(--background)' }}>
              <TableCell>
                <input type="checkbox" checked={selectedRows.includes(c.id)} onChange={() => onToggleRowSelection(c.id)} />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-muted-foreground" />
                  <span className="text-sm font-nomal text-foreground">{c.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-sm font-thin text-foreground">{c.email}</TableCell>
              <TableCell className="text-sm font-thin text-foreground">{c.phone}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {c.status === 'Active' ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-thin border px-2 text-foreground">Active</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-sm font-thin text-foreground">Inactive</span>
                    </>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-sm font-thin text-foreground">{c.totalRevenue}€</TableCell>
              <TableCell>
                <div className="relative">
                  <button className="text-muted-foreground hover:text-foreground rounded-none border border-border flex items-center justify-center" onClick={() => onToggleDropdown(c.id)}>
                    <MoreHorizontal size={16} />
                  </button>
                  {openDropdown === c.id && (
                    <div className="absolute right-0 top-8 w-32 bg-card border border-border rounded-none shadow-lg z-[10000] fadeInDown" style={{ zIndex: 10000 }}>
                      <button onClick={() => onOpenPanelView(c)} className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2">
                        <Eye size={12} />
                        Voir
                      </button>
                      <button onClick={() => onOpenPanelEdit(c)} className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2">
                        <Edit size={12} />
                        Éditer
                      </button>
                      <button onClick={() => onOpenDeleteModal(c)} className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2 text-red-500 hover:text-red-400">
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
        {selectedRows.length} of {clients.length} client(s) selected.
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

export default ClientsTable 