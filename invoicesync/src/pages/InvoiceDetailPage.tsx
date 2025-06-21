import React from "react";
import { useParams } from "react-router-dom";

const InvoiceDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Facture #{id}</h1>
      <div className="mb-6">
        <div className="bg-neutral-800 rounded p-4 flex items-center justify-center h-64 text-neutral-500">
          [Aperçu PDF ici]
        </div>
      </div>
      <div className="flex gap-4">
        <button className="bg-primary text-white px-4 py-2 rounded">Télécharger PDF</button>
        <button className="bg-green-600 text-white px-4 py-2 rounded">Marquer payé</button>
        <button className="bg-neutral-700 text-white px-4 py-2 rounded">Partager lien</button>
      </div>
    </div>
  );
};

export default InvoiceDetailPage; 