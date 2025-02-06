import React from 'react';
import { Link } from 'react-router-dom';

function Menu() {
  return (
    <div className="flex flex-col p-4 space-y-2 py-6">
      <Link to="/Faculty/classProjects" className="hover:bg-gray-700 p-2 rounded">
        Done
      </Link>
    </div>
  );
}
export default Menu;
