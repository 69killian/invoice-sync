import React from "react";

const SettingsPage = () => {
  return (
    <div className="max-w-lg mx-auto bg-neutral-900 p-8 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Profil utilisateur</h1>
      <form className="flex flex-col gap-4">
        <input type="text" placeholder="Nom" className="bg-neutral-800 p-3 rounded text-white" defaultValue="John Doe" />
        <input type="email" placeholder="Email" className="bg-neutral-800 p-3 rounded text-white" defaultValue="john@mail.com" />
        <input type="password" placeholder="Nouveau mot de passe" className="bg-neutral-800 p-3 rounded text-white" />
        <input type="password" placeholder="Confirmer le mot de passe" className="bg-neutral-800 p-3 rounded text-white" />
        <button type="submit" className="bg-primary text-white py-2 rounded hover:bg-primary/80">Enregistrer</button>
      </form>
    </div>
  );
};

export default SettingsPage; 