import React from "react";
import Navbar from "./Navbar";
import Sidemenu from "./sidemenu";
import { Outlet, useLocation } from "react-router-dom";


function StudentLayout() {
  const location = useLocation();
  const isProfilePage = location.pathname.includes("/Student/Profile");

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden pt-14"> 
        {/* Sidebar Menu - Shrinks on Profile Page */}
        <div className={`bg-[#82001A] text-white transition-all duration-300 ${isProfilePage ? "w-16" : "w-52"}`}>
          <Sidemenu isProfilePage={isProfilePage} />
        </div>


        {/* Main Content */}
        <div className="flex-1 p-4 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default StudentLayout;
