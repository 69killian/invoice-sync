import React from "react";
import { Link, useParams } from "react-router-dom";

const ClientDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Client #{id}</h1>
      <div className="mb-6 space-y-2">
        <div><span className="text-neutral-400">Nom:</span> Client {id}</div>
        <div><span className="text-neutral-400">Email:</span> client{id}@mail.com</div>
        <div><span className="text-neutral-400">Téléphone:</span> 06 00 00 00 0{id}</div>
        <div><span className="text-neutral-400">Adresse:</span> 123 rue Exemple</div>
      </div>
      <div className="flex gap-4">
        <Link to={`/clients/${id}/edit`} className="bg-yellow-500 text-black px-4 py-2 rounded">Éditer</Link>
        <button className="bg-red-700 text-white px-4 py-2 rounded">Supprimer</button>
        <Link to="/invoices?client=1" className="bg-primary text-white px-4 py-2 rounded">Voir factures</Link>
      </div>
    </div>
  );
};

export default ClientDetailPage; 