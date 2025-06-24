import React, { useState } from "react";
import { User, Mail, Camera, Save, Trash2, Plus, Link, X, AlertTriangle } from "lucide-react";
import SettingsHeader from "../components/SettingsHeader"
import ProfileForm from "../components/ProfileForm"
import DeleteAccountInitialModal from "../components/DeleteAccountInitialModal"
import DeleteAccountFinalModal from "../components/DeleteAccountFinalModal"
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/useUser";

const SettingsView = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const [deleteError, setDeleteError] = useState<string>();
  const { user: authUser, logout } = useAuth();
  const navigate = useNavigate();
  const { deleteUser, isDeleting } = useUser(authUser?.id || '');

  const openDeleteModal = () => {
    setShowDeleteModal(true);
    setDeleteError(undefined);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setConfirmationText("");
    setDeleteError(undefined);
  };

  const proceedToFinalConfirmation = () => {
    setShowDeleteModal(false);
    setShowFinalDeleteModal(true);
    setDeleteError(undefined);
  };

  const closeFinalDeleteModal = () => {
    setShowFinalDeleteModal(false);
    setConfirmationText("");
    setDeleteError(undefined);
  };

  const confirmAccountDeletion = async () => {
    if (confirmationText !== "SUPPRIMER MON COMPTE" || isDeleting) return;
    
    try {
      setDeleteError(undefined);
      await deleteUser();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
      setDeleteError("Une erreur est survenue lors de la suppression du compte. Veuillez réessayer.");
    }
  };

  return (
    <div className="">
      <SettingsHeader onDeleteClick={openDeleteModal} />

      <ProfileForm />

      {/* Logout button */}
      <div className="px-8 mt-8">
        <button
          onClick={async () => { await logout(); navigate('/login'); }}
          className="btn btn-secondary"
        >
          Se déconnecter
        </button>
      </div>

      <DeleteAccountInitialModal
        open={showDeleteModal}
        onClose={closeDeleteModal}
        onProceed={proceedToFinalConfirmation}
      />

      <DeleteAccountFinalModal
        open={showFinalDeleteModal}
        confirmationText={confirmationText}
        onConfirmationTextChange={setConfirmationText}
        onCancel={closeFinalDeleteModal}
        onConfirm={confirmAccountDeletion}
        isDeleting={isDeleting}
        error={deleteError}
      />
    </div>
  );
};

export default SettingsView; 