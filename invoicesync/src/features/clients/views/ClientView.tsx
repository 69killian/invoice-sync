import { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import { useForm } from 'react-hook-form';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from "../hooks/useClients";
import type { ClientCreate, ClientUpdate, Client } from "../types";
import ClientsHeader from "../components/ClientsHeader";
import ClientsTopClients from "../components/ClientsTopClients";
import ClientsTable from "../components/ClientsTable";
import ClientDeleteModal from "../components/ClientDeleteModal";

// Custom hook for pagination
const usePagination = (initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const getTotalPages = (totalItems: number) => {
    return Math.ceil(totalItems / itemsPerPage);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = (totalPages: number) => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage(prev => Math.max(1, prev - 1));
  const goToNextPage = (totalPages: number) => setCurrentPage(prev => Math.min(totalPages, prev + 1));

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPaginatedData = <T,>(data: T[]): T[] => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: handleItemsPerPageChange,
    goToFirstPage,
    goToLastPage,
    goToPreviousPage,
    goToNextPage,
    getTotalPages,
    getPaginatedData,
  };
};

const ClientView = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);
  const { register, handleSubmit, reset } = useForm<ClientCreate | ClientUpdate>({
    defaultValues: { name: '', email: '', phone: '', status: 'Active' }
  });

  // Use pagination hook
  const pagination = usePagination(10);
  
  const { data: clients = [], isLoading } = useClients();
  const createMut = useCreateClient();
  const updateMut = useUpdateClient();
  const deleteMut = useDeleteClient();

  // Get paginated data
  const paginatedClients = pagination.getPaginatedData<Client>(clients);
  const totalPages = pagination.getTotalPages(clients.length);

  if (isLoading) {
    return <div className="p-8 text-center">Chargement...</div>;
  }

  const toggleRowSelection = (id: string) => {
    setSelectedRows(prev => 
      prev.includes(id) 
        ? prev.filter(rowId => rowId !== id)
        : [...prev, id]
    );
  };

  const toggleAllRows = () => {
    setSelectedRows(prev => 
      prev.length === clients.length 
        ? []
        : clients.map((client: Client) => client.id)
    );
  };

  const toggleDropdown = (id: string) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openClientPanel = (client: Client) => {
    setSelectedClient(client);
    reset({ name: client.name, email: client.email ?? '', phone: client.phone ?? '', status: client.status });
    setIsEditing(false);
    setOpenDropdown(null);
  };

  const openClientPanelInEditMode = (client: Client) => {
    setSelectedClient(client);
    reset({ name: client.name, email: client.email ?? '', phone: client.phone ?? '', status: client.status });
    setIsEditing(true);
    setOpenDropdown(null);
  };

  const closeClientPanel = () => {
    setSelectedClient(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const openCreatePanel = () => {
    setSelectedClient(null);
    reset({ name:'', email:'', phone:'', status:'Active' });
    setIsCreating(true);
    setIsEditing(false);
  };

  const toggleEditMode = () => {
    setIsEditing(!isEditing);
  };

  const onSubmit = handleSubmit((data: ClientCreate | ClientUpdate) => {
    if (isCreating) {
      createMut.mutate(data as ClientCreate, { onSuccess: () => { setIsCreating(false); reset(); } });
    } else if (selectedClient) {
      updateMut.mutate({ id: selectedClient.id, payload: data as ClientUpdate }, { onSuccess: () => { setIsEditing(false); } });
    }
  });

  const openDeleteModal = (client: Client) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const confirmDelete = () => {
    if (clientToDelete) {
      deleteMut.mutate(clientToDelete.id, { onSuccess: closeDeleteModal });
    }
  };

  return (
    <div className="">
      {/* Header */}
      <ClientsHeader onCreateClick={openCreatePanel} />

      {/* Top Clients Card */}
      <div className="px-8 mb-6">
        <ClientsTopClients clients={clients} />
      </div>

      <div className="space-y-6 py-4 px-8">
        <ClientsTable
          clients={paginatedClients}
          selectedRows={selectedRows}
          hoveredRow={hoveredRow}
          openDropdown={openDropdown}
          itemsPerPage={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          onToggleRowSelection={toggleRowSelection}
          onToggleAllRows={toggleAllRows}
          onToggleDropdown={toggleDropdown}
          onOpenPanelView={openClientPanel}
          onOpenPanelEdit={openClientPanelInEditMode}
          onOpenDeleteModal={openDeleteModal}
          onSetItemsPerPage={pagination.setItemsPerPage}
          onSetCurrentPage={pagination.setCurrentPage}
        />
      </div>

      {/* Client Detail Modal */}
      {(selectedClient || isCreating) && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closeClientPanel}
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
                  {isCreating ? 'Nouveau Client' : 'Client'}
                </h2>
                <button 
                  onClick={closeClientPanel}
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
                    Nom: {selectedClient?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Email: {selectedClient?.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Status: {selectedClient?.status}
                  </div>
                </>
              )}
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 modal-scroll border-b border-border" style={{height: '500px'}}>
              <div className="p-6 space-y-6 pb-20">
                {!isEditing && !isCreating ? (
                  <>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations de contact</h3>
                        <div className="text-sm text-foreground space-y-2">
                          <div>Email: {selectedClient?.email}</div>
                          <div>Téléphone: {selectedClient?.phone}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Activité</h3>
                        <div className="text-sm text-foreground space-y-2">
                          <div>Projets: {selectedClient?.projectsCount}</div>
                          <div>Chiffre d'affaires: {selectedClient?.totalRevenue}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Configuration</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Créé le: {selectedClient ? new Date(selectedClient.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' }) : ''}</div>
                        {/* Vous pourrez ajouter "Créé par" si l'API renvoie l'auteur */}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {isCreating ? 'Créer un nouveau client' : 'Modifier le client'}
                      </h3>
                    </div>

                    <form onSubmit={onSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Nom du client</label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="Entrez le nom du client"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <input
                          type="email"
                          {...register('email')}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="client@example.com"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Téléphone</label>
                        <input
                          type="tel"
                          {...register('phone')}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="06 00 00 00 00"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Status</label>
                        <select
                          {...register('status')}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                        >
                          <option value="Active">Active</option>
                          <option value="Inactive">Inactive</option>
                        </select>
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button 
                          type="submit"
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
                          onClick={isCreating ? closeClientPanel : toggleEditMode}
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
                    </form>
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

      <ClientDeleteModal
        open={showDeleteModal && Boolean(clientToDelete)}
        client={clientToDelete}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default ClientView; 