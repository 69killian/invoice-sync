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
import type { Service } from '../types'

interface ServicesTableProps {
  services: Service[]
  selectedRows: string[]
  hoveredRow: string | null
  openDropdown: string | null
  itemsPerPage: number
  currentPage: number
  totalPages: number
  onToggleRowSelection: (id: string) => void
  onToggleAllRows: () => void
  onToggleDropdown: (id: string) => void
  onOpenPanelView: (service: Service) => void
  onOpenPanelEdit: (service: Service) => void
  onOpenDeleteModal: (service: Service) => void
  onSetItemsPerPage: (val: number) => void
  onSetCurrentPage: (val: number) => void
}

const ServicesTable: React.FC<ServicesTableProps> = ({
  services,
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
          <TableRow className="border-b border-border bg-muted/40">
            <TableHead className="w-12" style={{ border: 'none' }}>
              <input type="checkbox" onChange={onToggleAllRows} checked={selectedRows.length === services.length} />
            </TableHead>
            <TableHead style={{ border: 'none' }}>Nom</TableHead>
            <TableHead style={{ border: 'none' }}>Description</TableHead>
            <TableHead style={{ border: 'none' }}>Tarif unitaire</TableHead>
            <TableHead style={{ border: 'none' }}>Récurrence</TableHead>
            <TableHead className="w-12" style={{ border: 'none' }}></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow
              key={service.id}
              style={{ backgroundColor: hoveredRow === service.id ? 'rgba(0,0,0,0.1)' : 'var(--background)' }}
            >
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(service.id)}
                  onChange={() => onToggleRowSelection(service.id)}
                />
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3">
                  <GripVertical size={16} className="text-muted-foreground" />
                  <span className="text-sm font-nomal text-foreground">{service.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{service.description}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{service.unitPrice.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-thin text-foreground">{service.recurrence}</span>
              </TableCell>
              <TableCell>
                <div className="relative">
                  <button
                    className="text-muted-foreground hover:text-foreground rounded-none border border-border flex items-center justify-center"
                    onClick={() => onToggleDropdown(service.id)}
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openDropdown === service.id && (
                    <div className="absolute right-0 top-8 w-32 bg-card border-none rounded-none shadow-lg z-[10000] fadeInDown" style={{zIndex: 10000}}>
                      <button
                        onClick={() => onOpenPanelView(service)}
                        className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                      >
                        <Eye size={12} />
                        Voir
                      </button>
                      <button
                        onClick={() => onOpenPanelEdit(service)}
                        className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                      >
                        <Edit size={12} />
                        Éditer
                      </button>
                      <button
                        onClick={() => onOpenDeleteModal(service)}
                        className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2 text-red-500 hover:text-red-400"
                      >
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

    {/* Pagination */}
    <Pagination>
      <PaginationText>
        {selectedRows.length} of {services.length} service(s) selected.
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

export default ServicesTable 