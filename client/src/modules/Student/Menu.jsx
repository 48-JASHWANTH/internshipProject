import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  MdHome,
  MdAdminPanelSettings,
  MdSchool,
  MdScience,
  MdWork,
  MdLocationCity,
  MdGroups,
  MdKeyboardArrowRight 
} from "react-icons/md";

function Menu() {
  const [expanded, setExpanded] = useState(null);
  const navigate = useNavigate();

  const menuItems = [
    { 
      text: "Home", 
      path: "/Student/Home", 
      icon: <MdHome size={24} />
    },
    {
      text: "Administration",
      path: "/Student/Administration",
      icon: <MdAdminPanelSettings size={24} />
    },
    { 
      text: "Academics", 
      path: "/Student/Academics", 
      icon: <MdSchool size={24} />
    },
    {
      text: "Research",
      path: "/Student/Research",
      icon: <MdScience size={24} />
    },
    {
      text: "Training & Placement",
      path: "/Student/Training",
      icon: <MdWork size={24} />
    },
    {
      text: "Campus",
      path: "/Student/Campus",
      icon: <MdLocationCity size={24} />
    },
    {
      text: "Campus Life",
      path: "/Student/CampusLife",
      icon: <MdGroups size={24} />
    }
  ];

  const handleClick = (item) => {
    navigate(item.path);
  };

  return (
    <div className="flex flex-col bg-[#82001A] text-white">
      {menuItems.map((item, index) => (
        <div 
          key={index} 
          className="flex flex-col border-b border-[#9b1a31]"
          onClick={() => handleClick(item)}
        >
          <div className="flex items-center justify-between py-4 hover:bg-[#9b1a31] cursor-pointer transition-all duration-200 ease-in-out">
            <div className="flex items-center gap-4 pl-6">
              <span className="text-white">{item.icon}</span>
              <span className="font-medium text-lg">{item.text}</span>
            </div>
            <MdKeyboardArrowRight 
              size={24} 
              className="text-yellow-400 mr-4"
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
