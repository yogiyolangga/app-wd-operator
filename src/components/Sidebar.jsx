import { HiUserGroup } from "react-icons/hi";
import { BiSolidHome } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { TbDatabaseCog } from "react-icons/tb";
import { BsDatabaseFillCheck } from "react-icons/bs";

import { useLocation, useNavigate } from "react-router-dom";

export function Sidebar() {
  const path = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userOperator");
    localStorage.removeItem("tokenOperator");
    navigate("/login");
  };

  return (
    <>
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-[55px] h-[300px] rounded-[47px] bg-[#602BF8] drop-shadow-md flex flex-col items-center justify-evenly">
        <a href="/">
          <BiSolidHome
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/data-process">
          <TbDatabaseCog
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/data-process" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/history">
          <BsDatabaseFillCheck
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/history" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/account">
          <HiUserGroup
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/account" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <div className="cursor-pointer">
          <HiOutlineLogout
            className="w-[24px] h-[24px] hover:text-white text-zinc-400"
            onClick={handleLogout}
          />
        </div>
      </div>
    </>
  );
}
