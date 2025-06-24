import React, { useState } from "react";
import { User, Mail, Camera, Save, Trash2, Plus, Link, X, AlertTriangle } from "lucide-react";
import SettingsHeader from "../components/SettingsHeader"
import ProfileForm from "../components/ProfileForm"
import DeleteAccountInitialModal from "../components/DeleteAccountInitialModal"
import DeleteAccountFinalModal from "../components/DeleteAccountFinalModal"
import { useAuth } from "../../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const SettingsView = () => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFinalDeleteModal, setShowFinalDeleteModal] = useState(false);
  const [confirmationText, setConfirmationText] = useState("");
  const { logout } = useAuth();
  const navigate = useNavigate();

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
      />
    </div>
  );
};

export default SettingsView; 