import React from 'react';
import Navbar from './Navbar';
import Menu from './Menu';
import { Outlet } from 'react-router-dom';

function InchargeLayout() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <div className="w-64 bg-red-950 text-white">
          <Menu />
        </div>
        <div className="flex-1 p-4 bg-gray-100 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default InchargeLayout;
