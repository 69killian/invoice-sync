import React from "react";
import { useParams } from "react-router-dom";

const ServiceFormPage = ({ edit = false }: { edit?: boolean }) => {
  const { id } = useParams();
  return (
    <div className="max-w-lg mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">
        {edit ? `Éditer la prestation #${id}` : "Nouvelle prestation"}
      </h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Nom" className="bg-neutral-800 p-3 rounded text-white" required />
        <textarea placeholder="Description" className="bg-neutral-800 p-3 rounded text-white" required />
        <input type="number" placeholder="Tarif unitaire (€)" className="bg-neutral-800 p-3 rounded text-white" required />
        <div className="flex gap-2 items-center">
          <input type="checkbox" id="rec" className="accent-primary" />
          <label htmlFor="rec">Récurrent</label>
          <select className="bg-neutral-800 p-2 rounded text-white ml-2">
            <option>Mensuel</option>
            <option>Trimestriel</option>
            <option>Annuel</option>
          </select>
        </div>
        <button type="submit" className="bg-primary text-white py-2 rounded hover:bg-primary/80">
          {edit ? "Enregistrer" : "Créer"}
        </button>
      </form>
    </div>
  );
};

export default ServiceFormPage; 