import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Menu() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  const menuItems = [
    { text: "Dashboard", path: "/Student/Dashboard", hasSubmenu: false },
    {
      text: "Active Works",
      path: "/Student/ActiveWorks",
      hasSubmenu: true,
      subItems: [
        { text: "Assigned Works", path: "/Student/ActiveWorks/Assigned" },
        { text: "Pending Reviews", path: "/Student/ActiveWorks/PendingReviews" },
      ],
    },
    { text: "Archived Projects", path: "/Student/ArchivedProjects", hasSubmenu: false },
    {
      text: "Campus Projects",
      path: "/Student/CampusProjects",
      hasSubmenu: true,
      subItems: [
        { text: "Ongoing Projects", path: "/Student/CampusProjects/Ongoing" },
        { text: "Completed Projects", path: "/Student/CampusProjects/Completed" },
      ],
    },
  ];

  const handleClick = (item, index) => {
    if (item.hasSubmenu) {
      setExpanded(expanded === index ? null : index); // Toggle expansion
    } else {
      navigate(item.path); // Navigate only for non-expandable items
    }
  };

  return (
    <div className="flex flex-col bg-[#82001A] text-white p-6 space-y-4 ">
      {menuItems.map((item, index) => (
        <div key={index} className="flex flex-col">
          <div
            className="flex justify-between items-center py-3 border-b bg-[#82001A] border-neutral-400 hover:text-yellow-400 font-bold cursor-pointer"
            onClick={() => handleClick(item, index)}
          >
            <span className="font-bold">{item.text}</span>
            <span
              className={`text-yellow-400 text-2xl transform transition-transform duration-300 ${
                item.hasSubmenu ? (expanded === index ? "rotate-90" : "rotate-0") : ""
              }`}
            >
              ›
            </span>
          </div>

          {/* Sub-menu items (if expanded) */}
          {item.hasSubmenu && expanded === index && (
            <div className="pl-6 space-y-2 transition-all duration-300 ease-in-out">
              {item.subItems.map((subItem, subIndex) => (
                <Link
                  key={subIndex}
                  to={subItem.path}
                  className="block py-2 text-sm hover:text-yellow-400"
                >
                  <span className="font-semibold">{subItem.text}  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Menu;
