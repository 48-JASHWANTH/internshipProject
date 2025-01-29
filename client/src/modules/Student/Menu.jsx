import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";

function Menu() {
  return (
    <div className="flex flex-col bg-maroon text-white p-6 space-y-4">
      {[
        { text: "Dashboard", path: "/Student/Dashboard" },
        { text: "Active Works", path: "/Student/ActiveWorks" },
        { text: "Archived Projects", path: "/Student/ArchivedProjects" },
        { text: "Campus Projects", path: "/Student/CampusProjects"}
      ].map((item, index) => (
        <Link
          key={index}
          to={item.path}
          className="flex justify-between items-center py-3 border-b border-maroon hover:text-yellow-400"
        >
          <span className="font-semibold">{item.text}</span>
          <FaArrowRight className="text-yellow-400" />
        </Link>
      ))}
    </div>
  );
}

export default Menu;
