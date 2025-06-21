import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { BarChart3, Users, Settings, FileText, Wrench } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart3 },
    { name: "Clients", href: "/clients", icon: Users },
    { name: "Services", href: "/services", icon: Settings },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Settings", href: "/settings", icon: Wrench },
  ];

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="sidebar w-64 flex-shrink-0 relative border-r border-sidebar-border">
        {/* Sidebar Header */}
        <div className="">
          <p className="font-normal text-sm py-3 px-6" style={{color: 'white'}}>
            InvoiceSync
          </p>
          <div className="border-b border-gray-700 mb-4"></div>
        </div>
        
        <div className="p-6">
          <nav className="sidebar-nav">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="sidebar-nav-item"
                >
                  <IconComponent size={16} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-muted rounded-none flex items-center justify-center">
              <span className="text-xs font-normal">JD</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-normal truncate">John Doe</div>
              <div className="text-xs text-muted-foreground truncate">john@example.com</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1 px-0  bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 