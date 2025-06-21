import React, { useState } from "react";
import { User, Mail, Camera, Save, Trash2, Plus, Link, X, AlertTriangle } from "lucide-react";

const SettingsPage = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmationText("");
  };

  const proceedToFinalConfirmation = () => {
    setShowDeleteModal(false);
    setShowFinalDeleteModal(true);
  };

  const closeFinalDeleteModal = () => {
    setShowFinalDeleteModal(false);
    setConfirmationText("");
  };

  const confirmAccountDeletion = () => {
    if (confirmationText === "SUPPRIMER MON COMPTE") {
      // Here you would typically call your backend to delete the account
      console.log('Account deletion confirmed');
      // Redirect to login or home page
      closeFinalDeleteModal();
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="px-8">
        <div className="flex items-center justify-between px-8">
          <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Profil utilisateur
          </p>
          <button 
            onClick={openDeleteModal}
            className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground cursor-pointer bg-card hover:bg-muted hover:text-foreground transition-colors" 
            style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none', color: '#ef4444'}}
          >
            <Trash2 size={14} />
            Supprimer le compte
          </button>
        </div>
        <div className="border-b border-gray-700 mb-4"></div>
      </div>

      <div className="px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-background border border-border rounded-none">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
                    Informations du profil
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gérez vos informations personnelles et votre photo de profil
                  </p>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-muted rounded-none flex items-center justify-center">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-none flex items-center justify-center hover:bg-primary/80 transition-colors">
                    <Camera size={14} className="text-primary-foreground" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Photo de profil</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG ou GIF. Taille maximale de 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Prénom</label>
                  <input
                    type="text"
                    defaultValue="Martin"
                    className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Nom</label>
                  <input
                    type="text"
                    defaultValue="Dupont"
                    className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    defaultValue="martin.dupont@invoicesync.com"
                    className="w-full bg-background border border-border text-xs px-3 py-2 pl-10 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Entreprise</label>
                <input
                  type="text"
                  defaultValue="InvoiceSync"
                  className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Poste</label>
                <input
                  type="text"
                  defaultValue="Développeur Full Stack"
                  className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Développeur passionné par les technologies web modernes et l'expérience utilisateur."
                  className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button 
                  className="px-4 py-2 text-xs rounded-none transition-colors flex items-center gap-2 border"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <Save size={14} />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* First Confirmation Modal */}
      {showDeleteModal && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closeDeleteModal}
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
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10002,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="w-96 bg-card border border-border shadow-xl rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
                    Supprimer le compte
                  </h2>
                  <button 
                    onClick={closeDeleteModal}
                    className="text-muted-foreground hover:text-foreground"
                  >
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
                    <h3 className="text-sm font-medium text-foreground" style={{color: 'white'}}>
                      Attention : Action irréversible
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1" style={{color: '#9ca3af'}}>
                      Cette action ne peut pas être annulée
                    </p>
                  </div>
                </div>

                <div className="bg-muted/20 p-4 rounded-none">
                  <p className="text-sm text-foreground mb-3" style={{color: 'white'}}>
                    La suppression de votre compte entraînera :
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside" style={{color: '#9ca3af'}}>
                    <li>Suppression définitive de toutes vos données</li>
                    <li>Suppression de tous vos clients et factures</li>
                    <li>Suppression de tous vos services</li>
                    <li>Perte d'accès immédiate à votre compte</li>
                    <li>Impossibilité de récupérer vos données</li>
                  </ul>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-none">
                  <p className="text-sm text-red-800" style={{color: 'white'}}>
                    <strong>Êtes-vous absolument certain de vouloir supprimer votre compte ?</strong>
                  </p>
                  <p className="text-xs text-red-600 mt-1" style={{color: '#9ca3af'}}>
                    Cette action est définitive et ne peut pas être annulée.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #374151'
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={proceedToFinalConfirmation}
                    className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                    style={{
                      backgroundColor: '#f97316',
                      color: 'white',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #f97316'
                    }}
                  >
                    Continuer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Final Confirmation Modal */}
      {showFinalDeleteModal && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closeFinalDeleteModal}
            style={{
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 10003,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              transition: 'backdrop-filter 0.3s ease-out, opacity 0.3s ease-out'
            }}
          ></div>
          
          {/* Modal */}
          <div 
            className="fixed inset-0 flex items-center justify-center fadeInBlur"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10004,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="w-96 bg-card border border-border shadow-xl rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
                    Confirmation finale
                  </h2>
                  <button 
                    onClick={closeFinalDeleteModal}
                    className="text-muted-foreground hover:text-foreground"
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
                    <h3 className="text-sm font-medium text-foreground" style={{color: 'white'}}>
                      Dernière étape
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1" style={{color: '#9ca3af'}}>
                      Tapez la phrase de confirmation
                    </p>
                  </div>
                </div>

                <div className="bg-red-50 border border-red-200 p-4 rounded-none">
                  <p className="text-sm text-red-800 mb-3" style={{color: 'white'}}>
                    Pour confirmer la suppression définitive de votre compte, tapez exactement :
                  </p>
                  <div className="bg-red-100 p-2 rounded-none">
                    <code className="text-sm font-mono text-red-900" style={{color: 'white'}}>SUPPRIMER MON COMPTE</code>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground" style={{color: '#9ca3af'}}>
                    Phrase de confirmation
                  </label>
                  <input
                    type="text"
                    value={confirmationText}
                    onChange={(e) => setConfirmationText(e.target.value)}
                    className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-red-500"
                    placeholder="Tapez la phrase exacte..."
                    style={{color: 'white'}}
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={closeFinalDeleteModal}
                    className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #374151'
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmAccountDeletion}
                    disabled={confirmationText !== "SUPPRIMER MON COMPTE"}
                    className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #ef4444'
                    }}
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SettingsPage; 