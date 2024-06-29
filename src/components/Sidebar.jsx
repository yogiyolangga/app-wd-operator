import { HiUserGroup } from "react-icons/hi";
import { BiSolidHome } from "react-icons/bi";
import { HiOutlineLogout } from "react-icons/hi";
import { TbDatabaseCog } from "react-icons/tb";
import { BsDatabaseFillCheck } from "react-icons/bs";

import { useLocation, useNavigate } from "react-router-dom";

export function Sidebar() {
  const path = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("roleOperator");

  const handleLogout = () => {
    localStorage.removeItem("userOperator");
    localStorage.removeItem("tokenOperator");
    localStorage.removeItem("roleOperator");
    navigate("/login");
  };

  return (
    <>
      <div className="absolute -left-6 top-1/2 -translate-y-1/2 w-[55px] h-[300px] rounded-[47px] bg-[#602BF8] dark:bg-zinc-950 drop-shadow-md flex flex-col items-center justify-evenly">
        <a href="/" title="Home">
          <BiSolidHome
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/data-process" title="On-Process">
          <TbDatabaseCog
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname == "/data-process" ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a href="/history" title="History">
          <BsDatabaseFillCheck
            className={`w-[24px] h-[24px] hover:text-white ${
              path.pathname.includes("history") ? "text-white" : "text-zinc-400"
            }`}
          />
        </a>
        <a
          href="/account"
          className={`${role != "administrator" ? "hidden" : ""}`}
          title="User"
        >
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
