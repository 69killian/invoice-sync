import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, GripVertical, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus, Eye, Edit, X, ChevronDown, Trash2 } from "lucide-react";

const ServicesView = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    price: '',
    recurrence: 'Ponctuel'
  });
  
  const services = [
    { id: 1, name: "Développement Web", description: "Création de sites web sur mesure", price: "500€", recurrence: "Ponctuel", category: "Développement", duration: "2-4 semaines" },
    { id: 2, name: "Maintenance Site", description: "Maintenance mensuelle de site web", price: "150€", recurrence: "Mensuel", category: "Maintenance", duration: "Continu" },
    { id: 3, name: "Consultation SEO", description: "Optimisation pour moteurs de recherche", price: "300€", recurrence: "Ponctuel", category: "Marketing", duration: "1-2 semaines" },
    { id: 4, name: "Formation WordPress", description: "Formation à l'utilisation de WordPress", price: "200€", recurrence: "Ponctuel", category: "Formation", duration: "1 jour" },
    { id: 5, name: "Hébergement Web", description: "Hébergement et nom de domaine", price: "50€", recurrence: "Mensuel", category: "Infrastructure", duration: "Continu" },
  ];

  const toggleRowSelection = (id: number) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === services.length 
        ? []
        : services.map(service => service.id)
    );
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openServicePanel = (service: any) => {
    setSelectedService(service);
    setEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      recurrence: service.recurrence
    });
    setIsEditing(false);
    setOpenDropdown(null);
  };

  const openServicePanelInEditMode = (service: any) => {
    setSelectedService(service);
    setEditForm({
      name: service.name,
      description: service.description,
      price: service.price,
      recurrence: service.recurrence
    });
    setIsEditing(true);
    setOpenDropdown(null);
  };

  const closeServicePanel = () => {
    setSelectedService(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const openCreatePanel = () => {
    setSelectedService(null);
    setEditForm({
      name: '',
      description: '',
      price: '',
      recurrence: 'Ponctuel'
    });
    setIsCreating(true);
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = () => {
    if (isCreating) {
      // Here you would typically save the new service to your backend
      console.log('Creating new service:', editForm);
      setIsCreating(false);
    } else {
      // Here you would typically save the changes to your backend
      console.log('Saving changes:', editForm);
      setIsEditing(false);
      // Update the selectedService with new values
      setSelectedService({
        ...selectedService,
        ...editForm
      });
    }
  };

  const openDeleteModal = (service: any) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const confirmDelete = () => {
    // Here you would typically delete the service from your backend
    console.log('Deleting service:', serviceToDelete);
    closeDeleteModal();
  };

  return (
    <div className="">
      {/* Header */}
      <div className="px-8">
        <div className="flex items-center justify-between px-8">
          <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Prestations
          </p>
          <button 
            onClick={openCreatePanel}
            className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors" 
            style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none'}}
          >
            <Plus size={14} />
            Nouvelle prestation
          </button>
        </div>
        <div className="border-b border-gray-700 mb-4"></div>
      </div>

      {/* Search and Filters */}
      <div className="px-8 mb-4">
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Recherche nom..." 
            className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground w-64"
          />
          <select className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground">
            <option>Filtrer</option>
            <option>Nom</option>
            <option>Récurrence</option>
          </select>
        </div>
      </div>

      <div className="space-y-6 py-4 px-8">
        {/* Table */}
        <div className="bg-card rounded-none border-t border-l border-r border-border">
          <table className="w-full border-collapse" style={{ border: 'none', borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 w-12 border-none" style={{ border: 'none' }}>
                  <input type="checkbox" />
                </th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Nom</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Description</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Tarif unitaire</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Récurrence</th>
                <th className="text-left p-2 w-12 border-none" style={{ border: 'none' }}></th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr 
                  key={service.id} 
                  className="border-b border-border bg-background transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: hoveredRow === service.id ? 'rgba(0, 0, 0, 0.1)' : 'var(--background)'
                  }}
                  onMouseEnter={() => setHoveredRow(service.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-muted-foreground" />
                      <span className="text-sm font-nomal text-foreground">{service.name}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="text-sm font-thin text-foreground">{service.description}</span>
                  </td>
                  <td className="p-2">
                    <span className="text-sm font-thin text-foreground">{service.price}</span>
                  </td>
                  <td className="p-2">
                    <span className="text-sm font-thin text-foreground">{service.recurrence}</span>
                  </td>
                  <td className="p-2">
                    <div className="relative">
                      <button 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleDropdown(service.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openDropdown === service.id && (
                        <div className="absolute right-0 top-8 w-32 bg-card border border-border rounded-none shadow-lg z-[10000] fadeInDown" style={{zIndex: 10000}}>
                          <button
                            onClick={() => openServicePanel(service)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                          >
                            <Eye size={12} />
                            Voir
                          </button>
                          <button 
                            onClick={() => openServicePanelInEditMode(service)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                          >
                            <Edit size={12} />
                            Éditer
                          </button>
                          <button 
                            onClick={() => openDeleteModal(service)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2 text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-2 text-sm text-foreground bg-background">
          <div style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            0 of 5 row(s) selected.
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>Rows per page</span>
              <select className="bg-muted/5 hover:bg-muted border border-border font-thin rounded-none px-3 py-1 text-foreground min-w-16">
                <option>10</option>
                <option>20</option>
                <option>50</option>
              </select>
            </div>
            <div style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>Page 1 of 1</div>
            <div className="flex items-center gap-1">
              <button className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" disabled>
                <ChevronsLeft size={14} />
              </button>
              <button className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" disabled>
                <ChevronLeft size={14} />
              </button>
              <button className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" disabled>
                <ChevronRight size={14} />
              </button>
              <button className="p-2 bg-muted/5 hover:bg-muted border border-border rounded-none disabled:opacity-50 w-8 h-8 flex items-center justify-center" disabled>
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal - Moved outside main content to cover entire page */}
      {(selectedService || isCreating) && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closeServicePanel}
            style={{
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 9998,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              transition: 'backdrop-filter 0.3s ease-out, opacity 0.3s ease-out'
            }}
          ></div>
          
          {/* Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-80 bg-card border-l border-border shadow-lg animate-slideIn"
            style={{position: 'fixed', zIndex: 9999}}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
                  {isCreating ? 'Nouvelle Prestation' : 'Prestation'}
                </h2>
                <button 
                  onClick={closeServicePanel}
                  className=" text-xs rounded-non transition-colors flex items-center justify-center border"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    border: '1px solid #d1d5db'
                  }}
                >
                  <X size={14} />
                </button>
              </div>
              {!isCreating && (
                <>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Nom: {selectedService.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tarif: {selectedService.price}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Récurrence: {selectedService.recurrence}
                  </div>
                </>
              )}
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 modal-scroll border-b border-border" style={{height: '500px'}}>
              <div className="p-6 space-y-6 pb-20">
                {!isEditing && !isCreating ? (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                      <div className="text-sm text-foreground">
                        {selectedService.description}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations générales</h3>
                        <div className="text-sm text-foreground space-y-2">
                          <div>Statut: Actif</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Tarification</h3>
                        <div className="text-sm text-foreground space-y-2">
                          <div>Prix unitaire: {selectedService.price}</div>
                          <div>Type: {selectedService.recurrence}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Configuration</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Créé le: 15 Mars 2024</div>
                        <div>Dernière modification: 22 Mars 2024</div>
                        <div>Créé par: Martin Dupont</div>
                        <div>Modifié par: Martin Dupont</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {isCreating ? 'Créer une nouvelle prestation' : 'Modifier la prestation'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Nom de la prestation</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="Entrez le nom de la prestation"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea
                          rows={3}
                          value={editForm.description}
                          onChange={(e) => handleInputChange('description', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none mt-1"
                          placeholder="Décrivez la prestation"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Tarif unitaire</label>
                          <input
                            type="text"
                            value={editForm.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            placeholder="Ex: 500€"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Récurrence</label>
                          <select
                            value={editForm.recurrence}
                            onChange={(e) => handleInputChange('recurrence', e.target.value)}
                            className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          >
                            <option value="Ponctuel">Ponctuel</option>
                            <option value="Mensuel">Mensuel</option>
                            <option value="Annuel">Annuel</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button 
                          onClick={handleSaveChanges}
                          className="flex-1 px-3 py-2 text-xs rounded-none transition-colors border"
                          style={{
                            backgroundColor: 'white',
                            color: 'black',
                            fontFamily: 'Bricolage Grotesque, sans-serif',
                            border: '1px solid #d1d5db'
                          }}
                        >
                          {isCreating ? 'Créer' : 'Sauvegarder'}
                        </button>
                        <button 
                          onClick={isCreating ? closeServicePanel : toggleEditMode}
                          className="flex-1 px-3 py-2 text-xs rounded-none transition-colors border"
                          style={{
                            backgroundColor: 'transparent',
                            color: 'white',
                            fontFamily: 'Bricolage Grotesque, sans-serif',
                            border: '1px solid #374151'
                          }}
                        >
                          Annuler
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {!isCreating && (
              <div className="absolute px-6 py-2">
                <button 
                  onClick={toggleEditMode}
                  className="px-3 py-1 text-xs rounded-none transition-colors flex items-center gap-2 border"
                  style={{
                    backgroundColor: 'white',
                    color: 'black',
                    fontFamily: 'Bricolage Grotesque, sans-serif',
                    border: '1px solid #d1d5db'
                  }}
                >
                  {isEditing ? 'Voir' : 'Modifier'}
                  <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && serviceToDelete && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closeDeleteModal}
            style={{
              position: 'fixed', 
              top: 0, 
              left: 0, 
              right: 0, 
              bottom: 0, 
              zIndex: 10001,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
              transition: 'backdrop-filter 0.3s ease-out, opacity 0.3s ease-out'
            }}
          ></div>
          
          {/* Modal */}
          <div 
            className="fixed inset-0 flex items-center justify-center fadeInBlur"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 10002,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div 
              className="w-96 bg-card border border-border shadow-xl rounded-none"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-border">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
                    Confirmer la suppression
                  </h2>
                  <button 
                    onClick={closeDeleteModal}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-100 rounded-none flex items-center justify-center">
                    <Trash2 size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Supprimer la prestation
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cette action est irréversible
                    </p>
                  </div>
                </div>

                <div className="bg-muted/20 p-4 rounded-none">
                  <p className="text-sm text-foreground">
                    Êtes-vous sûr de vouloir supprimer la prestation <strong>"{serviceToDelete.name}"</strong> ?
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cette prestation sera définitivement supprimée et ne pourra plus être utilisée dans de nouvelles factures.
                  </p>
                </div>

                <div className="flex gap-3 pt-4">
                  <button 
                    onClick={closeDeleteModal}
                    className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                    style={{
                      backgroundColor: 'transparent',
                      color: 'white',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #374151'
                    }}
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2 text-xs rounded-none transition-colors border"
                    style={{
                      backgroundColor: '#ef4444',
                      color: 'white',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #ef4444'
                    }}
                  >
                    Supprimer définitivement
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ServicesView; 