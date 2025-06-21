import React from "react";

const NotFoundPage = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
    <h1 className="text-5xl font-bold mb-4">404</h1>
    <p className="text-xl text-neutral-400 mb-8">Page non trouvée</p>
    <a href="/" className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80">Retour à l'accueil</a>
  </div>
);

export default NotFoundPage; 