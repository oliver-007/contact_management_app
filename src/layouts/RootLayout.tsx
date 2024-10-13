import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="  ">
      <Navbar />
      <div className=" flex justify-center ">
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
