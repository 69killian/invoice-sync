import * as React from "react"
import { X, AlertTriangle } from "lucide-react"
import { cn } from "../../../lib/utils"

interface DeleteAccountInitialModalProps {
  open: boolean
  onClose: () => void
  onProceed: () => void
}

const DeleteAccountInitialModal: React.FC<DeleteAccountInitialModalProps> = ({ open, onClose, onProceed }) => {
  if (!open) return null
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 10001,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          transition: 'backdrop-filter 0.3s ease-out, opacity 0.3s ease-out'
        }}
      ></div>

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center fadeInBlur"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10002 }}
      >
        <div className="w-96 bg-card border border-border shadow-xl rounded-none" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium" style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Supprimer le compte
              </h2>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-none flex items-center justify-center">
                <AlertTriangle size={24} className="text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground" style={{ color: 'white' }}>
                  Attention : Action irréversible
                </h3>
                <p className="text-xs text-muted-foreground mt-1" style={{ color: '#9ca3af' }}>
                  Cette action ne peut pas être annulée
                </p>
              </div>
            </div>

            <div className="bg-muted/20 p-4 rounded-none">
              <p className="text-sm text-foreground mb-3" style={{ color: 'white' }}>
                La suppression de votre compte entraînera :
              </p>
              <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside" style={{ color: '#9ca3af' }}>
                <li>Suppression définitive de toutes vos données</li>
                <li>Suppression de tous vos clients et factures</li>
                <li>Suppression de tous vos services</li>
                <li>Perte d'accès immédiate à votre compte</li>
                <li>Impossibilité de récupérer vos données</li>
              </ul>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-none">
              <p className="text-sm text-red-800" style={{ color: 'white' }}>
                <strong>Êtes-vous absolument certain de vouloir supprimer votre compte ?</strong>
              </p>
              <p className="text-xs text-red-600 mt-1" style={{ color: '#9ca3af' }}>
                Cette action est définitive et ne peut pas être annulée.
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                style={{ backgroundColor: 'transparent', color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif', border: '1px solid #374151' }}
              >
                Annuler
              </button>
              <button
                onClick={onProceed}
                className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                style={{ backgroundColor: '#f97316', color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif', border: '1px solid #f97316' }}
              >
                Continuer
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteAccountInitialModal 