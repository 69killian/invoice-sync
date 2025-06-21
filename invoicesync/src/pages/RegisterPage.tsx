import React, { useState } from "react";

const RegisterPage = () => {
  const [error, setError] = useState("");
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-neutral-900 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription</h1>
        {error && <div className="bg-red-800 text-red-200 p-2 rounded mb-4 text-center">{error}</div>}
        <form onSubmit={e => {e.preventDefault(); setError("Erreur de validation");}} className="flex flex-col gap-4">
          <input type="text" placeholder="Nom" className="bg-neutral-800 p-3 rounded text-white" required />
          <input type="email" placeholder="Email" className="bg-neutral-800 p-3 rounded text-white" required />
          <input type="password" placeholder="Mot de passe" className="bg-neutral-800 p-3 rounded text-white" required />
          <input type="password" placeholder="Confirmer le mot de passe" className="bg-neutral-800 p-3 rounded text-white" required />
          <button type="submit" className="bg-primary text-white py-2 rounded hover:bg-primary/80">Créer un compte</button>
        </form>
        <div className="mt-4 text-center text-neutral-400">
          <a href="/login" className="underline">Déjà inscrit ?</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 