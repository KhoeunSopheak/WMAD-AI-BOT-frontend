import React from "react";
import {
  Bell,
  LogOut,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="flex items-center justify-between px-6 py-4">
      <div className="flex items-center space-x-32">
        <div className="text-[#184f71] font-bold">
          <h1>WMAD GPT</h1>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button type="button" className="w-8 h-8 flex items-center justify-center text-[#184f71] hover:text-blue-600">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
          <UserCircle className="w-6 h-6" />
        </div>
        <Link to="/">
          <button
            type="button"
            className="w-8 h-8 flex items-center justify-center text-[#184f71] hover:text-blue-600"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Navbar;