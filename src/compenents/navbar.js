import React from "react";
import bell from "../assets/bell.png";
import logo from "../assets/wmadlogo.png";

export const Navbar = () => {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-20">
        <div className="flex items-center justify-center w-40 h-10 rounded">
          <img src={logo} alt="Logo" />
        </div>
        <div className="text-[#184f71] font-bold">
          <h1>WMAD GPT</h1>
        </div>
      </div>
      <div className="flex items-center">
        <button type="button" className="py-3 px-3 p-2">
          <div className="flex items-center justify-center w-6 h-5 rounded">
            <img src={bell} alt="bell" />
          </div>
        </button>
        <div className="h-8 w-8 overflow-hidden rounded-full bg-blue-600">
          <img
            src="/placeholder.svg"
            alt="Avatar"
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
