import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
    window.location.reload();
  };

  return (
    <div className=" bg-zinc-500 py-4 flex items-center justify-around z-50 top-0 sticky ">
      <p
        onClick={handleLogoClick}
        className="text-2xl text-white font-bold tracking-widest"
      >
        CMA
      </p>
      <div className=" uppercase text-white text-sm flex items-center gap-x-10 ">
        <NavLink
          className={({ isActive }) =>
            `pt-2 pb-1 ${isActive ? "border-b border-lime-500 " : ""} `
          }
          to="/"
        >
          all-contacts
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `pt-2 pb-1  ${isActive ? "border-b border-lime-500 " : ""} `
          }
          to="/create-contact"
        >
          add-contacts
        </NavLink>
      </div>
    </div>
  );
};

export default Navbar;
