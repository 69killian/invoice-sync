import React from "react";
import { Link, useParams } from "react-router-dom";

const ServiceDetailPage = () => {
  const { id } = useParams();
  return (
    <div className="max-w-2xl mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Prestation #{id}</h1>
      <div className="mb-6 space-y-2">
        <div><span className="text-neutral-400">Nom:</span> Service {id}</div>
        <div><span className="text-neutral-400">Description:</span> Description {id}</div>
        <div><span className="text-neutral-400">Tarif unitaire:</span> {id}00 €</div>
        <div><span className="text-neutral-400">Récurrence:</span> Mensuel</div>
      </div>
      <div className="flex gap-4">
        <Link to={`/services/${id}/edit`} className="bg-yellow-500 text-black px-4 py-2 rounded">Éditer</Link>
        <button className="bg-red-700 text-white px-4 py-2 rounded">Supprimer</button>
      </div>
    </div>
  );
};

export default ServiceDetailPage; 