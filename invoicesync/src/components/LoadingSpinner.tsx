import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <Loader2 size={48} className="text-white animate-spin" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-foreground" style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Chargement...
          </h2>
          <p className="text-sm text-muted-foreground">
            Préparation du tableau de bord
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner; 