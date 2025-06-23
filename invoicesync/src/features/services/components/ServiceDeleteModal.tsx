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

type ServiceDeleteModalProps = {
  open: boolean
  service: any | null
  onClose: () => void
  onConfirm: () => void
}

const ServiceDeleteModal: React.FC<ServiceDeleteModalProps> = ({ open, service, onClose, onConfirm }) => {
  if (!open || !service) return null
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
                <h3 className="text-sm font-medium text-foreground">Supprimer la prestation</h3>
                <p className="text-xs text-muted-foreground mt-1">Cette action est irréversible</p>
              </div>
            </div>
            <DeleteModalDescription>
              <p className="text-sm text-foreground">
                Êtes-vous sûr de vouloir supprimer la prestation <strong>"{service.name}"</strong> ?
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Cette prestation sera définitivement supprimée et ne pourra plus être utilisée dans de nouvelles factures.
              </p>
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

export default ServiceDeleteModal 