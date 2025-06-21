import React from "react";
import { useParams } from "react-router-dom";

const ClientFormPage = ({ edit = false }: { edit?: boolean }) => {
  const { id } = useParams();
  return (
    <div className="max-w-lg mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {edit ? `Éditer le client #${id}` : "Nouveau client"}
      </h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Nom" className="bg-neutral-800 p-3 rounded text-white" required />
        <input type="email" placeholder="Email" className="bg-neutral-800 p-3 rounded text-white" required />
        <input type="tel" placeholder="Téléphone" className="bg-neutral-800 p-3 rounded text-white" required />
        <input type="text" placeholder="Adresse" className="bg-neutral-800 p-3 rounded text-white" required />
        <button type="submit" className="bg-primary text-white py-2 rounded hover:bg-primary/80">
          {edit ? "Enregistrer" : "Créer"}
        </button>
      </form>
    </div>
  );
};

export default ClientFormPage; 