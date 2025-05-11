import { Outlet } from "react-router-dom";
import Sidebar from "../compenents/slidebar";
import Navbar from "../compenents/navbar";

export const Layout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-4 overflow-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
