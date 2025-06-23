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

type ClientDeleteModalProps = {
  open: boolean
  client: any | null
  onClose: () => void
  onConfirm: () => void
}

const ClientDeleteModal: React.FC<ClientDeleteModalProps> = ({ open, client, onClose, onConfirm }) => {
  if (!open || !client) return null
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
                <h3 className="text-sm font-medium text-foreground">Supprimer le client</h3>
                <p className="text-xs text-muted-foreground mt-1">Cette action est irréversible</p>
              </div>
            </div>
            <DeleteModalDescription>
              <p className="text-sm text-foreground">
                Êtes-vous sûr de vouloir supprimer le client <strong>"{client.name}"</strong> ?
              </p>
              <p className="text-xs text-muted-foreground mt-2">Ce client sera définitivement supprimé ainsi que tous ses projets et données associées.</p>
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

export default ClientDeleteModal 