import React from "react";
import { User, Mail, Camera, Save, Trash2, Plus, Link } from "lucide-react";

const SettingsPage = () => {
  return (
    <div className="">
      {/* Header */}
      <div className="px-8">
        <div className="flex items-center justify-between px-8">
          <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Profil utilisateur
          </p>
          <button 
            className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground cursor-pointer bg-card hover:bg-muted hover:text-foreground transition-colors" 
            style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none', color: '#ef4444'}}
          >
            <Trash2 size={14} />
            Supprimer le compte
          </button>
        </div>
        <div className="border-b border-gray-700 mb-4"></div>
      </div>

      <div className="px-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-background border border-border rounded-none">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h2 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
                    Informations du profil
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gérez vos informations personnelles et votre photo de profil
                  </p>
                </div>
              </div>

              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-muted rounded-none flex items-center justify-center">
                    <User size={32} className="text-muted-foreground" />
                  </div>
                  <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-primary rounded-none flex items-center justify-center hover:bg-primary/80 transition-colors">
                    <Camera size={14} className="text-primary-foreground" />
                  </button>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-foreground">Photo de profil</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    JPG, PNG ou GIF. Taille maximale de 2MB.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Prénom</label>
                  <input
                    type="text"
                    defaultValue="Martin"
                    className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Nom</label>
                  <input
                    type="text"
                    defaultValue="Dupont"
                    className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    defaultValue="martin.dupont@invoicesync.com"
                    className="w-full bg-background border border-border text-xs px-3 py-2 pl-10 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Entreprise</label>
                <input
                  type="text"
                  defaultValue="InvoiceSync"
                  className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Poste</label>
                <input
                  type="text"
                  defaultValue="Développeur Full Stack"
                  className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground">Bio</label>
                <textarea
                  rows={3}
                  defaultValue="Développeur passionné par les technologies web modernes et l'expérience utilisateur."
                  className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-border">
                <button 
                  className="px-4 py-2 text-xs rounded-none transition-colors flex items-center gap-2 border"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <Save size={14} />
                  Enregistrer les modifications
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 