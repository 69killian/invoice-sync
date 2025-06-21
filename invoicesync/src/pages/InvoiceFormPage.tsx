import React from "react";

const InvoiceFormPage = () => {
  return (
    <div className="max-w-xl mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Nouvelle facture</h1>
      <form className="flex flex-col gap-4">
        <select className="bg-neutral-800 p-3 rounded text-white" required>
          <option value="">Sélectionner un client</option>
          <option>Client 1</option>
          <option>Client 2</option>
        </select>
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
            <select className="bg-neutral-800 p-2 rounded text-white flex-1">
              <option>Service 1</option>
              <option>Service 2</option>
            </select>
            <input type="number" min="1" defaultValue={1} className="bg-neutral-800 p-2 rounded text-white w-20" />
            <span className="text-neutral-400">x 100 €</span>
          </div>
          <div className="flex gap-2 items-center">
            <select className="bg-neutral-800 p-2 rounded text-white flex-1">
              <option>Service 2</option>
              <option>Service 3</option>
            </select>
            <input type="number" min="1" defaultValue={2} className="bg-neutral-800 p-2 rounded text-white w-20" />
            <span className="text-neutral-400">x 200 €</span>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="text-neutral-400">Montant total</div>
          <div className="text-2xl font-bold">500 €</div>
        </div>
        <input type="date" className="bg-neutral-800 p-3 rounded text-white" required />
        <button type="submit" className="bg-primary text-white py-2 rounded hover:bg-primary/80">Créer la facture</button>
      </form>
    </div>
  );
};

export default InvoiceFormPage; 