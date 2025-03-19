import React, { useState } from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import { Outlet, useLocation } from "react-router-dom";

const AdminLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes("/Student/Profile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <Navbar 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen} 
      />

      <div className="flex flex-1 overflow-hidden pt-16">
        <Menu 
          isProfilePage={isProfilePage} 
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        
        <div className={`flex-1 p-4 bg-gray-100 overflow-auto ${
          isMobileMenuOpen ? 'opacity-50' : 'opacity-100'
        } transition-opacity duration-300`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
