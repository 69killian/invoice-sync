import React, { useState } from "react";
import { X, ChevronDown, FileText } from "lucide-react";
import { useForm, useFieldArray } from 'react-hook-form';
import StatCards from "../components/StatCards"
import InvoicesHeader from "../components/InvoicesHeader"
import InvoicesSearchFilters from "../components/InvoicesSearchFilters"
import InvoicesTable from "../components/InvoicesTable"
import InvoiceDeleteModal from "../components/InvoiceDeleteModal"
import { useInvoices, useCreateInvoice, useUpdateInvoice, useDeleteInvoice } from "../hooks/useInvoices";
import type { Invoice, InvoiceCreate, InvoiceUpdate } from "../types";
import { useClients } from "../../clients/hooks/useClients";
import { useServices as useServicesList } from "../../services/hooks/useServices";
import { useAuth } from "../../../contexts/AuthContext";
import { invoiceAPI } from "../../../lib/api";

// pagination hook (reuse)
const usePagination = (initial = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(initial);

  const getTotalPages = (total: number) => Math.ceil(total / itemsPerPage);
  const getPaginated = <T,>(data: T[]): T[] => {
    const start = (currentPage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  };

  const changeItemsPerPage = (n: number) => {
    setItemsPerPage(n);
    setCurrentPage(1);
  };

  return {
    currentPage,
    itemsPerPage,
    setCurrentPage,
    setItemsPerPage: changeItemsPerPage,
    getTotalPages,
    getPaginated,
  };
};

const InvoicesView = () => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);
  const [editForm, setEditForm] = useState({
    number: '',
    client: '',
    date: '',
    amount: '',
    status: 'En attente',
    services: [{ serviceId: '', quantity: 1 }]
  });
  const { data: clients = [] } = useClients();
  const { data: services = [] } = useServicesList();
  const { data: invoices = [], isLoading } = useInvoices();
  const createMut = useCreateInvoice();
  const updateMut = useUpdateInvoice();
  const deleteMut = useDeleteInvoice();

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const pagination = usePagination(10);

  // Apply client search / status filter before pagination
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch = inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    if (!statusFilter) return matchesSearch;
    const isPaid = inv.status.toLowerCase() === 'payé' || inv.status.toLowerCase() === 'paid';
    return matchesSearch && (statusFilter === 'paid' ? isPaid : !isPaid);
  });

  const toggleRowSelection = (id: string) => {
    setSelectedRows((prev) => (prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]));
  };

  const toggleAllRows = () => {
    setSelectedRows((prev) =>
      prev.length === pagination.getPaginated(filteredInvoices).length
        ? []
        : pagination.getPaginated(filteredInvoices).map((i) => i.id)
    );
  };

  const toggleDropdown = (id: string) => setOpenDropdown(openDropdown === id ? null : id);

  const openPanelView = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsEditing(false);
    setIsCreating(false);
  };

  const openPanelEdit = (inv: Invoice) => {
    setSelectedInvoice(inv);
    setIsEditing(true);
    setIsCreating(false);
  };

  const openCreatePanel = () => {
    setSelectedInvoice(null);
    setIsEditing(false);
    setIsCreating(true);
  };

  const closePanel = () => {
    setSelectedInvoice(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setEditForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleServiceChange = (index: number, field: string, value: string | number) => {
    setEditForm(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const addService = () => {
    setEditForm(prev => ({
      ...prev,
      services: [...prev.services, { serviceId: '', quantity: 1 }]
    }));
  };

  const removeService = (index: number) => {
    setEditForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  // Helper to convert the local form state to the API payload shape
  const buildCreatePayload = (): InvoiceCreate => {
    const client = clients.find((c) => c.name === editForm.client);
    // Convert YYYY-MM-DD to ISO format with UTC time
    const dateObj = new Date(editForm.date);
    const utcDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
    return {
      invoiceNumber: editForm.number,
      clientId: client?.id || '',
      dateIssued: utcDate.toISOString(),
      services: editForm.services,
    };
  };

  const buildUpdatePayload = (): InvoiceUpdate => {
    const client = clients.find((c) => c.name === editForm.client);
    // Convert YYYY-MM-DD to ISO format with UTC time
    const dateObj = new Date(editForm.date);
    const utcDate = new Date(Date.UTC(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate()));
    
    console.log('Current form state:', editForm);
    console.log('Original invoice:', selectedInvoice);
    console.log('Found client:', client);
    
    const payload: InvoiceUpdate = {};
    
    // Only include properties that have changed and are valid
    if (editForm.number && editForm.number !== selectedInvoice?.invoiceNumber) {
      payload.invoiceNumber = editForm.number;
    }
    
    // Only include client if it exists and has changed
    if (client?.id && editForm.client !== selectedInvoice?.clientName) {
      payload.clientId = client.id;
    }
    
    // Only include date if it's valid
    if (editForm.date && editForm.date !== selectedInvoice?.dateIssued) {
      payload.dateIssued = utcDate.toISOString();
    }
    
    // Only include status if it's changed
    if (editForm.status && editForm.status !== selectedInvoice?.status) {
      payload.status = editForm.status;
    }
    
    // Only include services if they've changed and are valid
    if (editForm.services?.length > 0 && 
        editForm.services.every(s => s.serviceId && s.quantity > 0) &&
        JSON.stringify(editForm.services) !== JSON.stringify(selectedInvoice?.services)) {
      payload.services = editForm.services;
    }
    
    console.log('Final update payload:', payload);
    return payload;
  };

  const handleSave = () => {
    if (isCreating) {
      createMut.mutate(buildCreatePayload(), { onSuccess: closePanel });
    } else if (selectedInvoice) {
      const payload = buildUpdatePayload();
      console.log('Update payload:', payload);
      updateMut.mutate(
        { id: selectedInvoice.id, payload },
        { onSuccess: () => setIsEditing(false) }
      );
    }
  };

  const openDelete = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const closeDelete = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  const confirmDelete = () => {
    if (invoiceToDelete) deleteMut.mutate(invoiceToDelete.id, { onSuccess: closeDelete });
  };

  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handleGeneratePdf = async () => {
    if (!selectedInvoice) return;
    
    setIsGeneratingPdf(true);
    try {
      await invoiceAPI.generatePdf(selectedInvoice.id);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // TODO: Add error toast notification
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (isLoading) return <div className="p-8 text-center">Chargement...</div>;

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="">
        {/* Header */}
        <InvoicesHeader onCreateClick={openCreatePanel} />

        {/* Statistics Cards */}
        <StatCards />

        {/* Search and Filters */}
        <InvoicesSearchFilters
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onSearchTermChange={setSearchTerm}
          onStatusFilterChange={setStatusFilter}
        />

        <div className="space-y-6 py-4 px-8">
          <InvoicesTable
            invoices={pagination.getPaginated(filteredInvoices)}
            selectedRows={selectedRows}
            hoveredRow={hoveredRow}
            openDropdown={openDropdown}
            itemsPerPage={pagination.itemsPerPage}
            currentPage={pagination.currentPage}
            totalPages={pagination.getTotalPages(filteredInvoices.length)}
            onToggleRowSelection={toggleRowSelection}
            onToggleAllRows={toggleAllRows}
            onToggleDropdown={toggleDropdown}
            onOpenPanelView={openPanelView}
            onOpenPanelEdit={openPanelEdit}
            onOpenDeleteModal={openDelete}
            onSetItemsPerPage={pagination.setItemsPerPage}
            onSetCurrentPage={pagination.setCurrentPage}
          />
        </div>
      </div>

      {/* Invoice Detail Modal */}
      {(selectedInvoice || isCreating) && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closePanel}
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
                  {isCreating ? 'Nouvelle Facture' : isEditing ? 'Modifier la facture' : 'Facture'}
                </h2>
                <button 
                  onClick={closePanel}
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
              {!isCreating && !isEditing && selectedInvoice && (
                <>
                  <div className="mt-2 text-sm text-muted-foreground">
                    Invoice No: {selectedInvoice.invoiceNumber}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issue date: {new Date(selectedInvoice.dateIssued).toLocaleDateString('fr-FR')}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due date: {selectedInvoice.dueDate ? new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR') : 'N/A'}
                  </div>
                </>
              )}
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 modal-scroll border-b border-border" style={{height: '500px'}}>
              <div className="p-6 space-y-6 pb-20">
                {!isEditing && !isCreating ? (
                  <>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">Informations</h3>
                        <div className="text-sm text-foreground space-y-2">
                          <div>N° : {selectedInvoice?.invoiceNumber}</div>
                          <div>Client : {selectedInvoice?.clientName}</div>
                          <div>Date d'émission : {selectedInvoice ? new Date(selectedInvoice.dateIssued).toLocaleDateString('fr-FR') : ''}</div>
                          {selectedInvoice?.dueDate && (
                            <div>Date d'échéance : {new Date(selectedInvoice.dueDate).toLocaleDateString('fr-FR')}</div>
                          )}
                          <div>Statut : {selectedInvoice?.status}</div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-4">Services</h3>
                        <div className="border border-border rounded-none">
                          <div className="grid grid-cols-4 gap-4 p-3 border-b border-border bg-muted/20">
                            <div className="text-xs font-medium text-muted-foreground">Service</div>
                            <div className="text-xs font-medium text-muted-foreground">Prix unitaire</div>
                            <div className="text-xs font-medium text-muted-foreground">Quantité</div>
                            <div className="text-xs font-medium text-muted-foreground">Total</div>
                          </div>
                          <div className="divide-y divide-border">
                            {selectedInvoice?.services?.map((service, index) => (
                              <div key={index} className="grid grid-cols-4 gap-4 p-3">
                                <div className="text-sm text-foreground">{service.serviceName}</div>
                                <div className="text-sm text-foreground">
                                  {(service.unitPrice ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </div>
                                <div className="text-sm text-foreground">{service.quantity}</div>
                                <div className="text-sm text-foreground">
                                  {(service.subtotal ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Total HT</span>
                          <span className="text-foreground">
                            {(selectedInvoice?.totalExclTax ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">TVA (20%)</span>
                          <span className="text-foreground">
                            {((selectedInvoice?.totalInclTax ?? 0) - (selectedInvoice?.totalExclTax ?? 0)).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                          <span style={{color: 'white'}}>Total TTC</span>
                          <span style={{color: 'white'}}>
                            {(selectedInvoice?.totalInclTax ?? 0).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">
                        {isCreating ? 'Créer une nouvelle facture' : 'Modifier la facture'}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Numéro de facture</label>
                        <input
                          type="text"
                          value={editForm.number}
                          onChange={(e) => handleInputChange('number', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                          placeholder="INV-2024-001"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Client</label>
                        <select
                          value={editForm.client}
                          onChange={(e) => handleInputChange('client', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                        >
                          <option value="">Sélectionner un client</option>
                          {clients.map(client => (
                            <option key={client.id} value={client.name}>{client.name}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted-foreground">Date</label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={(e) => handleInputChange('date', e.target.value)}
                          className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
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
                            <option value="En attente">En attente</option>
                            <option value="Payé">Payé</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted-foreground">Montant</label>
                          <input
                            type="text"
                            value={editForm.amount}
                            onChange={(e) => handleInputChange('amount', e.target.value)}
                            className="w-full bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground focus:outline-none focus:ring-1 focus:ring-primary mt-1"
                            placeholder="Ex: 1,500€"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-medium text-muted-foreground">Services</label>
                          <button
                            type="button"
                            onClick={addService}
                            className="text-xs px-2 py-1 border border-border rounded-none hover:bg-muted"
                          >
                            + Ajouter
                          </button>
                        </div>
                        {editForm.services.map((service, index) => (
                          <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                            <select
                              value={service.serviceId}
                              onChange={(e) => handleServiceChange(index, 'serviceId', e.target.value)}
                              className="bg-background border border-border text-xs px-2 py-1 rounded-none text-foreground"
                            >
                              <option value="">Sélectionner</option>
                              {services.map(svc => (
                                <option key={svc.id} value={svc.id}>{svc.name}</option>
                              ))}
                            </select>
                            <input
                              type="number"
                              value={service.quantity}
                              onChange={(e) => handleServiceChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              className="bg-background border border-border text-xs px-2 py-1 rounded-none text-foreground"
                              placeholder="Qté"
                              min="1"
                            />
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="text-xs px-2 py-1 border border-red-500 text-red-500 rounded-none hover:bg-red-50"
                              disabled={editForm.services.length === 1}
                            >
                              Suppr.
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-4">
                        <button 
                          onClick={handleSave}
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
                          onClick={closePanel}
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
              <div className="absolute px-6 py-2 flex gap-2">
                <button 
                  onClick={() => setIsEditing(!isEditing)}
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
                {!isEditing && (
                  <button 
                    onClick={handleGeneratePdf}
                    disabled={isGeneratingPdf}
                    className="px-3 py-1 text-xs rounded-none transition-colors flex items-center gap-2 border"
                    style={{
                      backgroundColor: 'white',
                      color: 'black',
                      fontFamily: 'Bricolage Grotesque, sans-serif',
                      border: '1px solid #d1d5db'
                    }}
                  >
                    {isGeneratingPdf ? 'Génération...' : 'PDF'}
                    <FileText size={14} />
                  </button>
                )}
              </div>
            )}
          </div>
        </>
      )}

      <InvoiceDeleteModal
        open={showDeleteModal && Boolean(invoiceToDelete)}
        invoice={invoiceToDelete}
        onClose={closeDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default InvoicesView; 