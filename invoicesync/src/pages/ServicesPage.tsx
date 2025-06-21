import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MoreHorizontal, GripVertical, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, Plus } from "lucide-react";

const ServicesPage = () => {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  
  const services = [
    { id: 1, name: "Développement Web", description: "Création de sites web sur mesure", price: "500€", recurrence: "Ponctuel" },
    { id: 2, name: "Maintenance Site", description: "Maintenance mensuelle de site web", price: "150€", recurrence: "Mensuel" },
    { id: 3, name: "Consultation SEO", description: "Optimisation pour moteurs de recherche", price: "300€", recurrence: "Ponctuel" },
    { id: 4, name: "Formation WordPress", description: "Formation à l'utilisation de WordPress", price: "200€", recurrence: "Ponctuel" },
    { id: 5, name: "Hébergement Web", description: "Hébergement et nom de domaine", price: "50€", recurrence: "Mensuel" },
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

  return (
    <div className="">
      {/* Header */}
      <div className="px-8">
        <div className="flex items-center justify-between px-8">
          <p className="font-normal text-sm py-3" style={{color: 'white', fontFamily: 'Bricolage Grotesque, sans-serif'}}>
            Prestations
          </p>
          <Link 
            to="/services/new"
            className="text-xs px-3 py-1 flex items-center gap-2 text-muted-foreground bg-card hover:bg-muted hover:text-foreground transition-colors" 
            style={{border: '1px solid #374151', fontFamily: 'Roboto Mono, monospace', fontWeight: 400, textDecoration: 'none'}}
          >
            <Plus size={14} />
            Nouvelle prestation
          </Link>
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
  );
};

export default ServicesPage; 