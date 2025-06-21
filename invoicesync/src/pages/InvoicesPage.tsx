import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, GripVertical, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus, Eye, Edit, X, ChevronDown } from "lucide-react";

const InvoicesPage = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  
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
    setOpenDropdown(null);
  };

  const closeInvoicePanel = () => {
    setSelectedInvoice(null);
  };

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
            <Link 
              to="/invoices/new"
              className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors" 
              style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none'}}
            >
              <Plus size={14} />
              Nouvelle facture
            </Link>
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
                        <div className="absolute right-0 top-8 bg-card border border-border rounded-none shadow-lg min-w-32 animate-dropdown" 
                             style={{zIndex: 9999, animation: 'fadeInDown 0.2s ease-out'}}>
                          <button 
                            className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors w-full text-left"
                            onClick={() => openInvoicePanel(invoice)}
                          >
                            <Eye size={12} />
                            Voir
                          </button>
                          <Link 
                            to={`/invoices/${invoice.id}/edit`}
                            className="flex items-center gap-2 px-3 py-2 text-xs text-foreground hover:bg-muted transition-colors"
                            style={{textDecoration: 'none'}}
                            onClick={() => setOpenDropdown(null)}
                          >
                            <Edit size={12} />
                            Éditer
                          </Link>
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

      {/* Sliding Panel Modal */}
      {selectedInvoice && (
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
                  Invoice
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
              <div className="mt-2 text-sm text-muted-foreground">
                Invoice No: {selectedInvoice.number}
              </div>
              <div className="text-sm text-muted-foreground">
                Issue date: {selectedInvoice.date}
              </div>
              <div className="text-sm text-muted-foreground">
                Due date: {selectedInvoice.date}
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="flex-1 modal-scroll border-b border-border" style={{height: '500px'}}>
              <div className="p-6 space-y-6 pb-20">
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
              </div>
            </div>

            <div className="absolute px-6 py-2">
              <button 
                className="px-3 py-1 text-xs rounded-none transition-colors flex items-center gap-2 border"
                style={{
                  backgroundColor: 'white',
                  color: 'black',
                  fontFamily: 'Bricolage Grotesque, sans-serif',
                  border: '1px solid #d1d5db'
                }}
              >
                Create & Send
                <ChevronDown size={14} />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InvoicesPage;