import React from "react";
import { Link } from "react-router-dom";

const InvoicesPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Factures</h1>
        <Link to="/invoices/new" className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80">+ Nouvelle facture</Link>
      </div>
      <div className="flex gap-4 mb-4">
        <select className="bg-neutral-800 p-2 rounded text-white">
          <option>Statut</option>
          <option>Payé</option>
          <option>En attente</option>
        </select>
        <input type="date" className="bg-neutral-800 p-2 rounded text-white" />
        <input type="text" placeholder="Client..." className="bg-neutral-800 p-2 rounded text-white w-64" />
      </div>
      <table className="w-full bg-neutral-900 rounded-lg overflow-hidden">
        <thead>
          <tr className="text-left text-neutral-400">
            <th className="p-3">N°</th>
            <th className="p-3">Client</th>
            <th className="p-3">Date</th>
            <th className="p-3">Montant</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {[1,2,3,4].map(i => (
            <tr key={i} className="border-t border-neutral-800 hover:bg-neutral-800">
              <td className="p-3">INV-2024-0{i}</td>
              <td className="p-3">Client {i}</td>
              <td className="p-3">2024-06-0{i}</td>
              <td className="p-3">{i * 500} €</td>
              <td className="p-3">
                <span className={i % 2 === 0 ? "text-green-400" : "text-yellow-400"}>{i % 2 === 0 ? "Payé" : "En attente"}</span>
              </td>
              <td className="p-3">
                <Link to={`/invoices/${i}`} className="underline text-primary">Voir</Link>
                <span className="mx-2">|</span>
                <Link to={`/invoices/${i}/edit`} className="underline text-yellow-400">Éditer</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoicesPage; 