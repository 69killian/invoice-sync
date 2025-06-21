import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { BarChart2, Users2, Cog, FileText, Settings2, Smartphone } from "lucide-react";

const Layout = () => {
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const navigation = [
    { name: "Dashboard", href: "/", icon: BarChart2 },
    { name: "Clients", href: "/clients", icon: Users2 },
    { name: "Services", href: "/services", icon: Cog },
    { name: "Invoices", href: "/invoices", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings2 },
  ];

  if (isMobile) {
    return (
      <div className="dark min-h-screen bg-background flex items-center justify-center p-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="flex justify-center">
            <Smartphone size={64} className="text-muted-foreground" />
          </div>
          <div className="space-y-4">
            <h1 className="text-2xl font-medium text-foreground" style={{fontFamily: 'Bricolage Grotesque, sans-serif'}}>
              Site non disponible sur mobile
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              InvoiceSync n'est actuellement pas optimisé pour les appareils mobiles. 
              Veuillez utiliser un ordinateur ou une tablette pour accéder à l'application.
            </p>
          </div>
          <div className="pt-4">
            <div className="w-full h-px bg-border"></div>
            <p className="text-xs text-muted-foreground mt-4">
              Merci de votre compréhension
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark min-h-screen bg-background flex">
      {/* Sidebar */}
      <div className="w-16 flex-shrink-0 relative  bg-background">
        {/* Sidebar Header */}
        <div className="flex justify-center py-3">
          <Link to="/" className="w-6 h-6 mb-8 flex items-center justify-center hover:opacity-80 transition-opacity">
            <img 
              src="/logosync.png" 
              alt="InvoiceSync Logo" 
              className="w-12 h-12 object-contain"
            />
          </Link>
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
        <main className="flex-1 bg-background">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 