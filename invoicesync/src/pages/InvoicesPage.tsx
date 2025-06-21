import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, GripVertical, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus, Eye, Edit, X, ChevronDown, Trash2 } from "lucide-react";

const InvoicesPage = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<any>(null);
  const [editForm, setEditForm] = useState({
    number: '',
    client: '',
    date: '',
    amount: '',
    status: 'En attente',
    services: [{ serviceId: '', quantity: 1 }]
  });
  
  const invoices = [
    { id: 1, number: "INV-2024-001", client: "Acme Corp", date: "2024-06-01", amount: "1,500€", status: "Payé" },
    { id: 2, number: "INV-2024-002", client: "Beta SARL", date: "2024-06-02", amount: "2,800€", status: "En attente" },
    { id: 3, number: "INV-2024-003", client: "Gamma SAS", date: "2024-06-03", amount: "3,200€", status: "Payé" },
    { id: 4, number: "INV-2024-004", client: "Delta Ltd", date: "2024-06-04", amount: "950€", status: "En attente" },
    { id: 5, number: "INV-2024-005", client: "Echo Inc", date: "2024-06-05", amount: "4,100€", status: "Payé" },
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
      prev.length === invoices.length 
        ? []
        : invoices.map(invoice => invoice.id)
    );
  };

  const toggleDropdown = (id: number) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  const openInvoicePanel = (invoice: any) => {
    setSelectedInvoice(invoice);
    setEditForm({
      number: invoice.number,
      client: invoice.client,
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status,
      services: [{ serviceId: '', quantity: 1 }]
    });
    setIsEditing(false);
    setOpenDropdown(null);
  };

  const openInvoicePanelInEditMode = (invoice: any) => {
    setSelectedInvoice(invoice);
    setEditForm({
      number: invoice.number,
      client: invoice.client,
      date: invoice.date,
      amount: invoice.amount,
      status: invoice.status,
      services: [{ serviceId: '', quantity: 1 }]
    });
    setIsEditing(true);
    setOpenDropdown(null);
  };

  const closeInvoicePanel = () => {
    setSelectedInvoice(null);
    setIsEditing(false);
    setIsCreating(false);
  };

  const openCreatePanel = () => {
    setSelectedInvoice(null);
    setEditForm({
      number: '',
      client: '',
      date: '',
      amount: '',
      status: 'En attente',
      services: [{ serviceId: '', quantity: 1 }]
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

  const handleSaveChanges = () => {
    if (isCreating) {
      // Here you would typically save the new invoice to your backend
      console.log('Creating new invoice:', editForm);
      setIsCreating(false);
    } else {
      // Here you would typically save the changes to your backend
      console.log('Saving changes:', editForm);
      setIsEditing(false);
      // Update the selectedInvoice with new values
      setSelectedInvoice({
        ...selectedInvoice,
        ...editForm
      });
    }
  };

  const openDeleteModal = (invoice: any) => {
    setInvoiceToDelete(invoice);
    setShowDeleteModal(true);
    setOpenDropdown(null);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setInvoiceToDelete(null);
  };

  const confirmDelete = () => {
    // Here you would typically delete the invoice from your backend
    console.log('Deleting invoice:', invoiceToDelete);
    closeDeleteModal();
  };

  // Available services for selection
  const availableServices = [
    { id: 'service1', name: 'Prestation 1', price: 150 },
    { id: 'service2', name: 'Prestation 2', price: 200 },
    { id: 'service3', name: 'Prestation 3', price: 300 },
    { id: 'service4', name: 'Prestation 4', price: 250 },
  ];

  // Available clients for selection
  const availableClients = [
    { id: 'client1', name: 'Client 1' },
    { id: 'client2', name: 'Client 2' },
    { id: 'client3', name: 'Client 3' },
    { id: 'client4', name: 'Client 4' },
    { id: 'client5', name: 'Client 5' },
  ];

  return (
    <div className="relative">
      {/* Main Content */}
      <div className="">
        {/* Header */}
        <div className="px-8">
          <div className="flex items-center justify-between px-8">
            <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
              Factures
            </p>
            <button 
              onClick={openCreatePanel}
              className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors" 
              style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none'}}
            >
              <Plus size={14} />
              Nouvelle facture
            </button>
          </div>
          <div className="border-b border-gray-700 mb-4"></div>
        </div>

        {/* Statistics Cards */}
        <div className="px-8 mb-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 rounded-none border bg-background text-card-foreground space-y-3">
              <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-normal text-muted-foreground">Total Factures</div>
                <div className="text-xs text-chart-1 font-normal border border-gray-700 px-2" style={{color: '#10b981'}}>+8.2%</div>
              </div>
              <div className="text-2xl font-light" style={{color: 'white'}}>156</div>
              <p className="text-xs text-muted-foreground">
                +12 ce mois-ci
              </p>
            </div>
            
            <div className="p-6 rounded-none border bg-background text-card-foreground space-y-3">
              <div className="flex flex-row items-center justify-between">
                <div className="text-sm font-normal text-muted-foreground">Chiffre d'Affaires</div>
                <div className="text-xs text-chart-1 font-normal border border-gray-700 px-2" style={{color: '#10b981'}}>+15.3%</div>
              </div>
              <div className="text-2xl font-light" style={{color: 'white'}}>€47,250</div>
              <p className="text-xs text-muted-foreground">
                +€6,800 ce mois-ci
              </p>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="px-8 mb-4">
          <div className="flex gap-4">
            <select className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground">
              <option>Statut</option>
              <option>Payé</option>
              <option>En attente</option>
            </select>
            <input 
              type="date" 
              className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground"
            />
            <input 
              type="text" 
              placeholder="Client..." 
              className="bg-background border border-border text-xs px-3 py-2 rounded-none text-foreground w-64"
            />
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
                  <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>N°</th>
                  <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Client</th>
                  <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Date</th>
                  <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Montant</th>
                  <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Statut</th>
                  <th className="text-left p-2 w-12 border-none" style={{ border: 'none' }}></th>
                </tr>
              </thead>
              <tbody>
                {invoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    className="border-b border-border bg-background transition-all duration-300 ease-in-out"
                    style={{
                      backgroundColor: hoveredRow === invoice.id ? 'rgba(0, 0, 0, 0.1)' : 'var(--background)'
                    }}
                    onMouseEnter={() => setHoveredRow(invoice.id)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="p-2">
                      <input type="checkbox" />
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-muted-foreground" />
                        <span className="text-sm font-nomal text-foreground">{invoice.number}</span>
                      </div>
                    </td>
                    <td className="p-2">
                      <span className="text-sm font-thin text-foreground">{invoice.client}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm font-thin text-foreground">{invoice.date}</span>
                    </td>
                    <td className="p-2">
                      <span className="text-sm font-thin text-foreground">{invoice.amount}</span>
                    </td>
                    <td className="p-2">
                      <div className="flex items-center gap-2">
                        {invoice.status === "Payé" ? (
                          <>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-xs font-thin border px-2 text-foreground">Payé</span>
                          </>
                        ) : (
                          <>
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-xs font-thin border px-2 text-foreground">En attente</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="p-2 relative">
                      <button 
                        className="text-muted-foreground hover:text-foreground"
                        onClick={() => toggleDropdown(invoice.id)}
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openDropdown === invoice.id && (
                        <div className="absolute right-0 bottom-8 w-32 bg-card border border-border rounded-none shadow-lg z-[10000] fadeInDown" style={{zIndex: 10000}}>
                          <button
                            onClick={() => openInvoicePanel(invoice)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                          >
                            <Eye size={12} />
                            Voir
                          </button>
                          <button 
                            onClick={() => openInvoicePanelInEditMode(invoice)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2"
                          >
                            <Edit size={12} />
                            Éditer
                          </button>
                          <button 
                            onClick={() => openDeleteModal(invoice)}
                            className="w-full px-3 py-2 text-xs text-left hover:bg-muted flex items-center gap-2 text-red-500 hover:text-red-400"
                          >
                            <Trash2 size={12} />
                            Supprimer
                          </button>
                        </div>
                      )}
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
      </div>

      {/* Invoice Detail Modal */}
      {(selectedInvoice || isCreating) && (
        <>
          {/* Dark Overlay */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-40 animate-fadeInBlur"
            onClick={closeInvoicePanel}
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
                  {isCreating ? 'Nouvelle Facture' : 'Invoice'}
                </h2>
                <button 
                  onClick={closeInvoicePanel}
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
                    Invoice No: {selectedInvoice.number}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issue date: {selectedInvoice.date}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Due date: {selectedInvoice.date}
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
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">From</h3>
                        <div className="text-sm text-foreground">
                          <div>InvoiceSync</div>
                          <div>contact@invoicesync.com</div>
                          <div>123 Business Street</div>
                          <div>Paris, France</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-2">To</h3>
                        <div className="text-sm text-foreground">
                          <div>{selectedInvoice.client}</div>
                          <div>client@company.com</div>
                          <div>456 Client Avenue</div>
                          <div>Lyon, France</div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-4">Items</h3>
                      <div className="border border-border rounded-none">
                        <div className="grid grid-cols-4 gap-4 p-3 border-b border-border bg-muted/20">
                          <div className="text-xs font-medium text-muted-foreground">Item</div>
                          <div className="text-xs font-medium text-muted-foreground">Quantity</div>
                          <div className="text-xs font-medium text-muted-foreground">Price</div>
                          <div className="text-xs font-medium text-muted-foreground">Total</div>
                        </div>
                        <div className="grid grid-cols-4 gap-4 p-3">
                          <div className="text-sm text-foreground">Service de développement</div>
                          <div className="text-sm text-foreground">1</div>
                          <div className="text-sm text-foreground">{selectedInvoice.amount}</div>
                          <div className="text-sm text-foreground">{selectedInvoice.amount}</div>
                        </div>
                      </div>
                      
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Subtotal</span>
                          <span className="text-foreground">{selectedInvoice.amount}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">VAT (20%)</span>
                          <span className="text-foreground">€{(parseFloat(selectedInvoice.amount.replace('€', '').replace(',', '')) * 0.2).toFixed(0)}</span>
                        </div>
                        <div className="flex justify-between text-lg font-semibold border-t border-border pt-2">
                          <span style={{color: 'white'}}>Total</span>
                          <span style={{color: 'white'}}>€{(parseFloat(selectedInvoice.amount.replace('€', '').replace(',', '')) * 1.2).toFixed(0)}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Payment details</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Bank: InvoiceSync Bank</div>
                        <div>Account number: 123456789</div>
                        <div>IBAN: FR76 1234 5678 9012 3456 7890</div>
                        <div>Swift (bic): INVOICEFR</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Notes</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>Thank you for your business!</div>
                        <div>Payment is due within 30 days.</div>
                        <div>Late payments may incur additional fees.</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Terms & Conditions</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>1. Payment terms: Net 30 days</div>
                        <div>2. Late payment fee: 2% per month</div>
                        <div>3. All work completed as per agreement</div>
                        <div>4. No refunds after project completion</div>
                        <div>5. Intellectual property rights transferred upon payment</div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-2">Contact Information</h3>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div>For questions about this invoice:</div>
                        <div>Email: billing@invoicesync.com</div>
                        <div>Phone: +33 1 23 45 67 89</div>
                        <div>Address: 123 Business Street, Paris, France</div>
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
                          {availableClients.map(client => (
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
                              {availableServices.map(svc => (
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
                          onClick={isCreating ? closeInvoicePanel : toggleEditMode}
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
      {showDeleteModal && invoiceToDelete && (
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
                      Supprimer la facture
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Cette action est irréversible
                    </p>
                  </div>
                </div>

                <div className="bg-muted/20 p-4 rounded-none">
                  <p className="text-sm text-foreground">
                    Êtes-vous sûr de vouloir supprimer la facture <strong>"{invoiceToDelete.number}"</strong> ?
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Cette facture sera définitivement supprimée ainsi que toutes ses données associées.
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

export default InvoicesPage;