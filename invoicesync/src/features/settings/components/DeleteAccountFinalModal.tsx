import * as React from "react"
import { X, Trash2, Loader2, AlertCircle } from "lucide-react"

interface DeleteAccountFinalModalProps {
  open: boolean
  confirmationText: string
  onConfirmationTextChange: (val: string) => void
  onCancel: () => void
  onConfirm: () => void
  isDeleting: boolean
  error?: string
}

const DeleteAccountFinalModal: React.FC<DeleteAccountFinalModalProps> = ({ 
  open, 
  confirmationText, 
  onConfirmationTextChange, 
  onCancel, 
  onConfirm,
  isDeleting,
  error
}) => {
  if (!open) return null;
  
  const isConfirmed = confirmationText === 'SUPPRIMER MON COMPTE';
  
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
        onClick={onCancel}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10003, backdropFilter: 'blur(4px)', WebkitBackdropFilter: 'blur(4px)', transition: 'backdrop-filter 0.3s ease-out, opacity 0.3s ease-out' }}
      ></div>

      {/* Modal */}
      <div
        className="fixed inset-0 flex items-center justify-center fadeInBlur"
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 10004 }}
      >
        <div className="w-96 bg-card border border-border shadow-xl rounded-none" onClick={(e) => e.stopPropagation()}>
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium" style={{ color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif' }}>
                Confirmation finale
              </h2>
              <button 
                onClick={onCancel} 
                className="text-muted-foreground hover:text-foreground"
                disabled={isDeleting}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-red-100 rounded-none flex items-center justify-center">
                <Trash2 size={24} className="text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-foreground" style={{ color: 'white' }}>
                  Dernière étape
                </h3>
                <p className="text-xs text-muted-foreground mt-1" style={{ color: '#9ca3af' }}>
                  Cette action est irréversible
                </p>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/20 border border-red-500 p-4 rounded-none flex items-center gap-2">
                <AlertCircle size={16} className="text-red-500 shrink-0" />
                <span className="text-sm text-red-500">{error}</span>
              </div>
            )}

            <div className="bg-red-50 border border-red-200 p-4 rounded-none">
              <p className="text-sm text-red-800 mb-3" style={{ color: 'white' }}>
                Pour confirmer la suppression définitive de votre compte, tapez exactement :
              </p>
              <div className="bg-red-100 p-2 rounded-none">
                <code className="text-sm font-mono text-red-900" style={{ color: 'white' }}>SUPPRIMER MON COMPTE</code>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground" style={{ color: '#9ca3af' }}>
                Phrase de confirmation
              </label>
              <input
                type="text"
                value={confirmationText}
                onChange={(e) => onConfirmationTextChange(e.target.value)}
                className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                placeholder="Tapez la phrase exacte..."
                style={{ color: 'white' }}
                disabled={isDeleting}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={onCancel}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: 'transparent', color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif', border: '1px solid #374151' }}
              >
                Annuler
              </button>
              <button
                onClick={onConfirm}
                disabled={!isConfirmed || isDeleting}
                className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                style={{ backgroundColor: '#ef4444', color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif', border: '1px solid #ef4444' }}
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Suppression...
                  </>
                ) : (
                  'Supprimer définitivement'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteAccountFinalModal 