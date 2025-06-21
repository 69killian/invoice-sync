import React, { useState } from "react";

const LoginPage = () => {
  const [error, setError] = useState("");
  
  return (
    <div className="dark min-h-screen flex items-center justify-center bg-background">
      <div className="card p-8 rounded-none border w-full max-w-md">
        <div className="flex flex-col space-y-2 text-center mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Connexion</h1>
          <p className="text-sm text-muted-foreground">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>
        
        {error && (
          <div className="bg-destructive text-destructive-foreground p-3 rounded-none text-sm mb-4">
            {error}
          </div>
        )}
        
        <form onSubmit={e => {e.preventDefault(); setError("Identifiants invalides");}} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Email</label>
            <input 
              type="email" 
              placeholder="nom@exemple.com" 
              className="input"
              required 
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">Mot de passe</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="input"
              required 
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full">
            Se connecter
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Pas encore de compte ?{" "}
            <a href="/register" className="text-primary hover:underline font-medium">
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 