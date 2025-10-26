import { useNavigate } from "react-router";

import SpotifyLogo from "./SpotifyLogo";


const Navbar = () => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-0 inset-x-0 flex justify-start items-center gap-x-4 px-5 py-4">
      <div
        className="flex justify-start items-center gap-x-3 group cursor-pointer"
        onClick={() => navigate("/")}
      >
        <SpotifyLogo color="fill-primary-green" variant="navbar" />
        <p className="text-xl font-bold group-hover:text-primary-text/80 transition duration-200">Houseparty</p>
      </div>
    </div>
  );
};

export default Navbar;