import React, { useState } from "react";
import { User, Mail, Camera, Save, Trash2, Plus, Link, X, AlertTriangle } from "lucide-react";
import SettingsHeader from "../components/SettingsHeader"
import ProfileForm from "../components/ProfileForm"
import DeleteAccountInitialModal from "../components/DeleteAccountInitialModal"
import DeleteAccountFinalModal from "../components/DeleteAccountFinalModal"

const SettingsView = () => {
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
      <SettingsHeader onDeleteClick={openDeleteModal} />

      <ProfileForm />

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