import React, { useState } from "react";
import { Loader2 } from 'lucide-react';
import {
  DeleteModal,
  DeleteModalOverlay,
  DeleteModalContent,
  DeleteModalHeader,
  DeleteModalTitle,
  DeleteModalCloseButton,
  DeleteModalBody
} from "../components/ui/delete-modal";
import { useAuth } from "../contexts/AuthContext";

function LegalModal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}) {
  if (!open) return null
  return (
    <DeleteModal onClick={onClose}>
      <DeleteModalOverlay />
      <DeleteModalContent
        className="relative w-80"
        style={{ zIndex: 11000 }}   // AU-DESSUS de l'overlay (10001)
      >
        <DeleteModalHeader className="flex justify-between items-center">
          <DeleteModalTitle>{title}</DeleteModalTitle>
          <DeleteModalCloseButton onClick={onClose} />
        </DeleteModalHeader>
        <DeleteModalBody className="force-white max-h-[60vh] overflow-y-auto space-y-4 text-sm" style={{fontFamily:'Bricolage Grotesque, sans-serif', color: 'white !important'}}>
          {children}
        </DeleteModalBody>
      </DeleteModalContent>
    </DeleteModal>
  )
}

const LoginPage = () => {
  const [error, setError] = useState("");
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  
  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background">
      <div className="card p-32 top-0 bottom-0 right-0 absolute rounded-none border w-80 flex flex-col justify-center">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight" style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive text-destructive-foreground p-3 rounded-none text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={async e => {
          e.preventDefault();
          const email = (e.currentTarget.elements.namedItem('email') as HTMLInputElement).value;
          try {
            setLoading(true);
            await login(email);
            window.location.href = '/';
          } catch (err: any) {
            setError(err.message || 'Erreur');
          } finally {
            setLoading(false);
          }
        }} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <input 
              type="email" 
              placeholder="nom@exemple.com" 
              className="input"
              name="email"
              required 
            />
          </div>
          
          <button type="submit" disabled={loading} className={`btn btn-secondary w-full flex items-center justify-center ${loading?"opacity-70 cursor-not-allowed": ""}`} style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            {loading ? (
              <Loader2 size={16} className="animate-spin text-white" />
            ) : (
              "Se connecter par Email"
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-xs text-muted-foreground px-8">
            En cliquant sur « Se connecter », vous acceptez notre{" "}
            <button
              type="button"
              onClick={() => setShowPrivacy(true)}
              className="underline text-green-500 hover:opacity-80 focus:outline-none"
            >
              Politique de confidentialité
            </button>.
          </p>
        </div>
      </div>
      <LegalModal
        open={showPrivacy}
        onClose={() => setShowPrivacy(false)}
        title="Politique de confidentialité"
      >
        <p>
          Vos adresses e-mail sont enregistrées de façon chiffrée dans une base de
          données sécurisée hébergée dans l'Union européenne. Elles ne sont
          utilisées que pour :
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>l'authentification et l'accès personnel à l'application ;</li>
          <li>l'envoi de notifications liées à votre compte (factures, rappels).</li>
        </ul>
        <p>
          Elles ne sont jamais cédées ni revendues. Vous pouvez demander la
          suppression définitive de vos données depuis le menu « Paramètres ».
        </p>
      </LegalModal>
    </div>
  );
};

export default LoginPage; 