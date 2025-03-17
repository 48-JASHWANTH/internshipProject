import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Menu from "./Menu";
import { Outlet, useLocation } from "react-router-dom";

const FacultyLayout = () => {
  const location = useLocation();
  const isProfilePage = location.pathname.includes("/Faculty/FacultyProfile");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Add effect to handle animation state when location changes
  useEffect(() => {
    setAnimating(true);
    const timer = setTimeout(() => {
      setAnimating(false);
    }, 300); // Match this with the transition duration

    return () => clearTimeout(timer);
  }, [isProfilePage]);

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
        
        <div className={`flex-1 p-4 bg-gray-100 overflow-auto transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'opacity-50' : 'opacity-100'
        }`}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default FacultyLayout;
