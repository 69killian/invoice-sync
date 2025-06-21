import React from "react";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Prestations</h1>
        <Link to="/services/new" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">+ Nouvelle prestation</Link>
      </div>
      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Recherche nom..." className="bg-neutral-800 p-2 rounded text-white w-64" />
        <select className="bg-neutral-800 p-2 rounded text-white">
          <option>Filtrer</option>
          <option>Nom</option>
          <option>Récurrence</option>
        </select>
      </div>
      <table className="w-full bg-neutral-900 rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-neutral-400">
            <th className="p-3">Nom</th>
            <th className="p-3">Description</th>
            <th className="p-3">Tarif unitaire</th>
            <th className="p-3">Récurrence</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3].map(i => (
            <tr key={i} className="border-t border-neutral-800 hover:bg-neutral-800">
              <td className="p-3">Service {i}</td>
              <td className="p-3">Description {i}</td>
              <td className="p-3">{i * 100} €</td>
              <td className="p-3">Mensuel</td>
              <td className="p-3">
                <Link to={`/services/${i}`} className="underline text-primary">Voir</Link>
                <span className="mx-2">|</span>
                <Link to={`/services/${i}/edit`} className="underline text-yellow-400">Éditer</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesPage; 