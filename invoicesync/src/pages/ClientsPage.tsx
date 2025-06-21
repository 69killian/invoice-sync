import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, GripVertical, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus } from "lucide-react";

const ClientsPage = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  const clients = [
    { id: 1, name: "Client 1", email: "client1@mail.com", phone: "06 00 00 00 01", address: "123 rue Exemple", status: "Active", projects: 3, revenue: "5,200€" },
    { id: 2, name: "Client 2", email: "client2@mail.com", phone: "06 00 00 00 02", address: "123 rue Exemple", status: "Active", projects: 1, revenue: "2,800€" },
    { id: 3, name: "Client 3", email: "client3@mail.com", phone: "06 00 00 00 03", address: "123 rue Exemple", status: "Inactive", projects: 0, revenue: "0€" },
    { id: 4, name: "Client 4", email: "client4@mail.com", phone: "06 00 00 00 04", address: "123 rue Exemple", status: "Active", projects: 2, revenue: "3,600€" },
    { id: 5, name: "Client 5", email: "client5@mail.com", phone: "06 00 00 00 05", address: "123 rue Exemple", status: "Active", projects: 4, revenue: "8,900€" },
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
      prev.length === clients.length 
        ? []
        : clients.map(client => client.id)
    );
  };

  return (
    <div className="">
      {/* Header */}
      <div className="px-8">
        <div className="flex items-center justify-between px-8">
          <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Clients
          </p>
          <Link 
            to="/clients/new"
            className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors" 
            style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none'}}
          >
            <Plus size={14} />
            Ajouter un client
          </Link>
        </div>
        <div className="border-b border-gray-700 mb-4"></div>
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
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Email</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Téléphone</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Status</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Projets</th>
                <th className="text-left p-2 text-sm font-normal text-muted-foreground border-none" style={{ border: 'none' }}>Chiffre d'affaires</th>
                <th className="text-left p-2 w-12 border-none" style={{ border: 'none' }}></th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr 
                  key={client.id} 
                  className="border-b border-border bg-background transition-all duration-300 ease-in-out"
                  style={{
                    backgroundColor: hoveredRow === client.id ? 'rgba(0, 0, 0, 0.1)' : 'var(--background)'
                  }}
                  onMouseEnter={() => setHoveredRow(client.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-2">
                    <input type="checkbox" />
                  </td>
                  <td className="p-2">
                    <div className="flex items-center gap-3">
                      <GripVertical size={16} className="text-muted-foreground" />
                      <span className="text-sm font-nomal text-foreground">{client.name}</span>
                    </div>
                  </td>
                  <td className="p-2">
                    <span className="text-sm font-thin text-foreground">{client.email}</span>
                  </td>
                  <td className="p-2">
                    <span className="text-sm font-thin text-foreground">{client.phone}</span>
                  </td>
                  <td className="p-2">
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
                  </td>
                  <td className="p-2 text-sm font-thin text-foreground">{client.projects}</td>
                  <td className="p-2 text-sm font-thin text-foreground">{client.revenue}</td>
                  <td className="p-2">
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-2 text-sm text-foreground bg-background">
          <div style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            0 of 68 row(s) selected.
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
            <div style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>Page 1 of 7</div>
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
  );
};

export default ClientsPage; 