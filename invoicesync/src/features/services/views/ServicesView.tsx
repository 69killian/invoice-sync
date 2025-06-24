import React, { useState } from "react";
import { X, ChevronDown } from "lucide-react";
import { useForm } from 'react-hook-form';
import { useServices, useCreateService, useUpdateService, useDeleteService } from "../hooks/useServices";
import type { Service, ServiceCreate, ServiceUpdate } from "../types";
import ServicesHeader from "../components/ServicesHeader";
import ServicesSearchFilters from "../components/ServicesSearchFilters";
import ServicesTable from "../components/ServicesTable";
import ServiceDeleteModal from "../components/ServiceDeleteModal";
import { useAuth } from "../../../contexts/AuthContext";

// Custom hook for pagination (identique à celui dans ClientView)
const usePagination = (initialItemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initialItemsPerPage);

  const getTotalPages = (totalItems: number) => Math.ceil(totalItems / itemsPerPage);

  const goToFirstPage = () => setCurrentPage(1);
  const goToLastPage = (totalPages: number) => setCurrentPage(totalPages);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = (totalPages: number) => setCurrentPage((prev) => Math.min(totalPages, prev + 1));

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

const ServicesView = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<Service | null>(null);

  // filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [recurrenceFilter, setRecurrenceFilter] = useState('');

  // pagination
  const pagination = usePagination(10);

  // RHF form
  const { register, handleSubmit, reset } = useForm<ServiceCreate | ServiceUpdate>({
    defaultValues: { name: '', description: '', unitPrice: 0, recurrence: 'Ponctuel' },
  });

  const { user } = useAuth();

  // TanStack hooks
  const { data: services = [], isLoading } = useServices();
  const createMut = useCreateService();
  const updateMut = useUpdateService();
  const deleteMut = useDeleteService();

  // filtrage
  const filteredServices = services.filter((s) => {
    const matchesName = s.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRecurrence = recurrenceFilter ? s.recurrence === recurrenceFilter : true;
    return matchesName && matchesRecurrence;
  });

  // pagination
  const paginatedServices = pagination.getPaginatedData<Service>(filteredServices);
  const totalPages = pagination.getTotalPages(filteredServices.length);

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;

  // sélection & dropdown
  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]));
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) => (prev.length === paginatedServices.length ? [] : paginatedServices.map((s) => s.id)));
  };

  const toggleDropdown = (id: string) => setOpenDropdown(openDropdown === id ? null : id);

  // panel view / edit / create
  const openServicePanel = (service: Service) => {
    setSelectedService(service);
    reset({ name: service.name, description: service.description ?? '', unitPrice: service.unitPrice, recurrence: service.recurrence ?? 'Ponctuel' });
    setIsEditing(false);
    setOpenDropdown(null);
  };

  const openServicePanelInEditMode = (service: Service) => {
    setSelectedService(service);
    reset({ name: service.name, description: service.description ?? '', unitPrice: service.unitPrice, recurrence: service.recurrence ?? 'Ponctuel' });
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
    reset({ name: '', description: '', unitPrice: 0, recurrence: 'Ponctuel' });
    setIsCreating(true);
    setIsEditing(false);
  };

  const toggleEditMode = () => setIsEditing(!isEditing);

  const onSubmit = handleSubmit((data: ServiceCreate | ServiceUpdate) => {
    if (isCreating) {
      const { userId, ...rest } = data as ServiceCreate; // ignore any userId
      const payload: ServiceCreate = { ...rest } as ServiceCreate;
      console.log('CREATE SERVICE payload:', payload);
      createMut.mutate(payload, { onSuccess: () => { setIsCreating(false); reset(); } });
    } else if (selectedService) {
      updateMut.mutate({ id: selectedService!.id, payload: data as ServiceUpdate }, { onSuccess: () => setIsEditing(false) });
    }
  });

  // suppression
  const openDeleteModal = (service: Service) => {
    setServiceToDelete(service);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  const confirmDelete = () => {
    if (serviceToDelete) deleteMut.mutate(serviceToDelete.id, { onSuccess: closeDeleteModal });
  };

  return (
    <div className="">
      {/* Header */}
      <ServicesHeader onCreateClick={openCreatePanel} />

      {/* Search and Filters */}
      <ServicesSearchFilters
        searchTerm={searchTerm}
        recurrenceFilter={recurrenceFilter}
        onSearchTermChange={setSearchTerm}
        onRecurrenceFilterChange={setRecurrenceFilter}
      />

      <div className="space-y-6 py-4 px-8">
        <ServicesTable
          services={paginatedServices}
          selectedRows={selectedRows}
          hoveredRow={hoveredRow}
          openDropdown={openDropdown}
          itemsPerPage={pagination.itemsPerPage}
          currentPage={pagination.currentPage}
          totalPages={totalPages}
          onToggleRowSelection={toggleRowSelection}
          onToggleAllRows={toggleAllRows}
          onToggleDropdown={toggleDropdown}
          onOpenPanelView={openServicePanel}
          onOpenPanelEdit={openServicePanelInEditMode}
          onOpenDeleteModal={openDeleteModal}
          onSetItemsPerPage={pagination.setItemsPerPage}
          onSetCurrentPage={pagination.setCurrentPage}
        />
      </div>

      {/* Delete Confirmation Modal */}
      <ServiceDeleteModal
        open={showDeleteModal && Boolean(serviceToDelete)}
        service={serviceToDelete}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
      />

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
                    Nom: {selectedService?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Tarif: {selectedService?.unitPrice}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Récurrence: {selectedService?.recurrence}
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
                        {selectedService?.description}
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
                          <div>Prix unitaire: {selectedService?.unitPrice}</div>
                          <div>Type: {selectedService?.recurrence}</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Configuration</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Créé le: {selectedService ? new Date(selectedService.createdAt).toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' }) : ''}</div>
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

                    <form onSubmit={onSubmit} className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Nom de la prestation</label>
                        <input
                          type="text"
                          {...register('name')}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="Entrez le nom de la prestation"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Description</label>
                        <textarea
                          rows={3}
                          {...register('description')}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none mt-1"
                          placeholder="Décrivez la prestation"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Tarif unitaire</label>
                          <input
                            type="text"
                            {...register('unitPrice', { valueAsNumber: true })}
                            className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            placeholder="Ex: 500€"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Récurrence</label>
                          <select
                            {...register('recurrence')}
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
    </div>
  );
};

export default ServicesView; 