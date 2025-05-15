import { Outlet } from "react-router-dom";
import Sidebar from "../compenents/slidebar";
import Navbar from "../compenents/navbar";


export const Layout = () => {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Navbar />
        <main className="flex-1 overflow-auto bg-gray-50 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

