import * as React from "react"
import {
  DeleteModal,
  DeleteModalOverlay,
  DeleteModalContent,
  DeleteModalHeader,
  DeleteModalTitle,
  DeleteModalCloseButton,
  DeleteModalBody,
  DeleteModalIcon,
  DeleteModalDescription,
  DeleteModalFooter,
  DeleteModalCancelButton,
  DeleteModalConfirmButton,
} from "../../../components/ui/delete-modal"

type InvoiceDeleteModalProps = {
  open: boolean
  invoice: any | null
  onClose: () => void
  onConfirm: () => void
}

const InvoiceDeleteModal: React.FC<InvoiceDeleteModalProps> = ({ open, invoice, onClose, onConfirm }) => {
  if (!open || !invoice) return null
  return (
    <>
      <DeleteModalOverlay onClick={onClose} />
      <DeleteModal>
        <DeleteModalContent>
          <DeleteModalHeader>
            <div className="flex items-center justify-between">
              <DeleteModalTitle>Confirmer la suppression</DeleteModalTitle>
              <DeleteModalCloseButton onClick={onClose} />
            </div>
          </DeleteModalHeader>
          <DeleteModalBody>
            <div className="flex items-center gap-3">
              <DeleteModalIcon />
              <div>
                <h3 className="text-sm font-medium text-foreground">Supprimer la facture</h3>
                <p className="text-xs text-muted-foreground mt-1">Cette action est irréversible</p>
              </div>
            </div>
            <DeleteModalDescription>
              <p className="text-sm text-foreground">
                Êtes-vous sûr de vouloir supprimer la facture <strong>"{invoice.number}"</strong> ?
              </p>
              <p className="text-xs text-muted-foreground mt-2">Cette facture sera définitivement supprimée ainsi que toutes ses données associées.</p>
            </DeleteModalDescription>
            <DeleteModalFooter>
              <DeleteModalCancelButton onClick={onClose}>Annuler</DeleteModalCancelButton>
              <DeleteModalConfirmButton onClick={onConfirm}>Supprimer définitivement</DeleteModalConfirmButton>
            </DeleteModalFooter>
          </DeleteModalBody>
        </DeleteModalContent>
      </DeleteModal>
    </>
  )
}

export default InvoiceDeleteModal 