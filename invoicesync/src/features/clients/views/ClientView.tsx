import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, GripVertical, Plus, Eye, Edit, X, ChevronDown, Trash2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationFirst,
  PaginationLast,
  PaginationRowsPerPage,
  PaginationText,
} from "../../../components/ui/pagination";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableContainer,
} from "../../../components/ui/table";
import {
  DeleteModal,
  DeleteModalOverlay,
  DeleteModalContent,
  DeleteModalHeader,
  DeleteModalTitle,
  DeleteModalCloseButton,
  DeleteModalBody,
  DeleteModalIcon,
  DeleteModalDescription,
  DeleteModalFooter,
  DeleteModalCancelButton,
  DeleteModalConfirmButton,
} from "../../../components/ui/delete-modal"

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
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
    projects: '',
    revenue: ''
  });

  // Use pagination hook
  const pagination = usePagination(10);
  
  const clients = [
    { id: 1, name: "Client 1", email: "client1@mail.com", phone: "06 00 00 00 01", address: "123 rue Exemple", status: "Active", projects: 3, revenue: "5,200€" },
    { id: 2, name: "Client 2", email: "client2@mail.com", phone: "06 00 00 00 02", address: "123 rue Exemple", status: "Active", projects: 1, revenue: "2,800€" },
    { id: 3, name: "Client 3", email: "client3@mail.com", phone: "06 00 00 00 03", address: "123 rue Exemple", status: "Inactive", projects: 0, revenue: "0€" },
    { id: 4, name: "Client 4", email: "client4@mail.com", phone: "06 00 00 00 04", address: "123 rue Exemple", status: "Active", projects: 2, revenue: "3,600€" },
    { id: 5, name: "Client 5", email: "client5@mail.com", phone: "06 00 00 00 05", address: "123 rue Exemple", status: "Active", projects: 4, revenue: "8,900€" },
  ];

  // Get paginated data
  const paginatedClients = pagination.getPaginatedData(clients);
  const totalPages = pagination.getTotalPages(clients.length);

  const toggleRowSelection = (id: number) => {
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
        : clients.map(client => client.id)
    );
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openClientPanel = (client: any) => {
    setSelectedClient(client);
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      projects: client.projects.toString(),
      revenue: client.revenue
    });
    setIsEditing(false);
    setOpenDropdown(null);
  };

  const openClientPanelInEditMode = (client: any) => {
    setSelectedClient(client);
    setEditForm({
      name: client.name,
      email: client.email,
      phone: client.phone,
      status: client.status,
      projects: client.projects.toString(),
      revenue: client.revenue
    });
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
    setEditForm({
      name: '',
      email: '',
      phone: '',
      status: 'Active',
      projects: '',
      revenue: ''
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
      // Here you would typically save the new client to your backend
      console.log('Creating new client:', editForm);
      setIsCreating(false);
    } else {
      // Here you would typically save the changes to your backend
      console.log('Saving changes:', editForm);
      setIsEditing(false);
      // Update the selectedClient with new values
      setSelectedClient({
        ...selectedClient,
        ...editForm,
        projects: parseInt(editForm.projects) || 0
      });
    }
  };

  const openDeleteModal = (client: any) => {
    setClientToDelete(client);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setClientToDelete(null);
  };

  const confirmDelete = () => {
    // Here you would typically delete the client from your backend
    console.log('Deleting client:', clientToDelete);
    closeDeleteModal();
  };

  return (
    <div className="">
      {/* Header */}
      <div className="px-8">
        <div className="flex items-center justify-between px-8">
          <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Clients
          </p>
          <button 
            onClick={openCreatePanel}
            className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors" 
            style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none'}}
          >
            <Plus size={14} />
            Ajouter un client
          </button>
        </div>
        <div className="border-b border-gray-700 mb-4"></div>
      </div>

      <div className="space-y-6 py-4 px-8">
        {/* Table */}
        <TableContainer>
          <Table style={{ border: 'none', borderCollapse: 'collapse' }}>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="w-12" style={{ border: 'none' }}>
                  <input type="checkbox" />
                </TableHead>
                <TableHead style={{ border: 'none' }}>Nom</TableHead>
                <TableHead style={{ border: 'none' }}>Email</TableHead>
                <TableHead style={{ border: 'none' }}>Téléphone</TableHead>
                <TableHead style={{ border: 'none' }}>Status</TableHead>
                <TableHead style={{ border: 'none' }}>Projets</TableHead>
                <TableHead style={{ border: 'none' }}>Chiffre d'affaires</TableHead>
                <TableHead className="w-12" style={{ border: 'none' }}></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClients.map((client) => (
                <TableRow
                  key={client.id}
                  style={{
                    backgroundColor: hoveredRow === client.id ? 'rgba(0, 0, 0, 0.1)' : 'var(--background)'
                  }}
                  onMouseEnter={() => setHoveredRow(client.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <TableCell>
                    <input type="checkbox" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-muted-foreground" />
                      <span className="text-sm font-nomal text-foreground">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-thin text-foreground">{client.email}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm font-thin text-foreground">{client.phone}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {client.status === "Active" ? (
                        <>
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-xs font-thin border px-2 text-foreground">Active</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          <span className="text-sm font-thin text-foreground">Inactive</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-thin text-foreground">{client.projects}</TableCell>
                  <TableCell className="text-sm font-thin text-foreground">{client.revenue}</TableCell>
                  <TableCell>
                    <div className="relative">
                      <button 
                        className="text-muted-foreground hover:text-foreground rounded-none border border-border flex items-center justify-center"
                        onClick={() => toggleDropdown(client.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openDropdown === client.id && (
                        <div className="absolute right-0 top-8 w-32 bg-card border border-border rounded-none shadow-lg z-[10000] fadeInDown" style={{zIndex: 10000}}>
                          <button
                            onClick={() => openClientPanel(client)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                          >
                            <Eye size={12} />
                            Voir
                          </button>
                          <button 
                            onClick={() => openClientPanelInEditMode(client)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                          >
                            <Edit size={12} />
                            Éditer
                          </button>
                          <button 
                            onClick={() => openDeleteModal(client)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2 text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Pagination>
          <PaginationText>
            {selectedRows.length} of {clients.length} client(s) selected.
          </PaginationText>
          <PaginationContent>
            <PaginationItem>
              <PaginationText>Rows per page</PaginationText>
              <PaginationRowsPerPage
                value={pagination.itemsPerPage}
                onChange={(e) => pagination.setItemsPerPage(Number(e.target.value))}
              />
            </PaginationItem>
            <PaginationText>
              Page {pagination.currentPage} of {totalPages}
            </PaginationText>
            <PaginationItem>
              <PaginationFirst
                onClick={pagination.goToFirstPage}
                isDisabled={pagination.currentPage === 1}
              />
              <PaginationPrevious
                onClick={pagination.goToPreviousPage}
                isDisabled={pagination.currentPage === 1}
              />
              <PaginationNext
                onClick={() => pagination.goToNextPage(totalPages)}
                isDisabled={pagination.currentPage === totalPages}
              />
              <PaginationLast
                onClick={() => pagination.goToLastPage(totalPages)}
                isDisabled={pagination.currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
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
                    Nom: {selectedClient.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Email: {selectedClient.email}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Status: {selectedClient.status}
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
                          <div>Email: {selectedClient.email}</div>
                          <div>Téléphone: {selectedClient.phone}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Activité</h3>
                        <div className="text-sm text-foreground space-y-2">
                          <div>Projets: {selectedClient.projects}</div>
                          <div>Chiffre d'affaires: {selectedClient.revenue}</div>
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
                        {isCreating ? 'Créer un nouveau client' : 'Modifier le client'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Nom du client</label>
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="Entrez le nom du client"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="client@example.com"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Téléphone</label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="06 00 00 00 00"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Status</label>
                          <select
                            value={editForm.status}
                            onChange={(e) => handleInputChange('status', e.target.value)}
                            className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Projets</label>
                          <input
                            type="number"
                            value={editForm.projects}
                            onChange={(e) => handleInputChange('projects', e.target.value)}
                            className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            placeholder="0"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Chiffre d'affaires</label>
                        <input
                          type="text"
                          value={editForm.revenue}
                          onChange={(e) => handleInputChange('revenue', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="Ex: 5,200€"
                        />
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
      {showDeleteModal && clientToDelete && (
        <>
          <DeleteModalOverlay onClick={closeDeleteModal} />
          <DeleteModal>
            <DeleteModalContent>
              <DeleteModalHeader>
                <div className="flex items-center justify-between">
                  <DeleteModalTitle>
                    Confirmer la suppression
                  </DeleteModalTitle>
                  <DeleteModalCloseButton onClick={closeDeleteModal} />
                </div>
              </DeleteModalHeader>

              <DeleteModalBody>
                <div className="flex items-center gap-3">
                  <DeleteModalIcon />
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Supprimer le client
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cette action est irréversible
                    </p>
                  </div>
                </div>

                <DeleteModalDescription>
                  <p className="text-sm text-foreground">
                    Êtes-vous sûr de vouloir supprimer le client <strong>"{clientToDelete.name}"</strong> ?
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Ce client sera définitivement supprimé ainsi que tous ses projets et données associées.
                  </p>
                </DeleteModalDescription>

                <DeleteModalFooter>
                  <DeleteModalCancelButton onClick={closeDeleteModal}>
                    Annuler
                  </DeleteModalCancelButton>
                  <DeleteModalConfirmButton onClick={confirmDelete}>
                    Supprimer définitivement
                  </DeleteModalConfirmButton>
                </DeleteModalFooter>
              </DeleteModalBody>
            </DeleteModalContent>
          </DeleteModal>
        </>
      )}
    </div>
  );
};

export default ClientView; 