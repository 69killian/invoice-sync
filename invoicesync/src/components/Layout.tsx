import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { BarChart2, Users2, Cog, FileText, Settings2 } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart2 },
    { name: "Clients", href: "/clients", icon: Users2 },
    { name: "Services", href: "/services", icon: Cog },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings2 },
  ];

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-16 flex-shrink-0 relative  bg-background">
        {/* Sidebar Header */}
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-black rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="px-2">
          <nav className="space-y-2">
            {navigation.map((item) => {
              const IconComponent = item.icon;
              const isActive = location.pathname === item.href || (item.href !== "/" && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-none transition-colors ${
                    isActive ? 'bg-muted text-foreground' : ''
                  }`}
                  style={isActive ? {border: '1px solid #374151'} : {}}
                >
                  <IconComponent size={25} />
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="absolute bottom-0 left-0 right-0 p-2">
          <div className="flex justify-center">
            <div className="w-8 h-8 bg-muted rounded-none flex items-center justify-center">
              <span className="text-xs font-normal">AC</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <main className="flex-1  bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 