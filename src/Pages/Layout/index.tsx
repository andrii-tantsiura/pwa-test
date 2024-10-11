import { Outlet } from "react-router-dom";

import { CustomNavbar } from "../../components/Navbar";

import "./index.css";

export const Layout = () => {
  return (
    <>
      <CustomNavbar />

      <div className="Page-Content">
        <Outlet />
      </div>
    </>
  );
};
