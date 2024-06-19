import { useNavigate } from "react-router-dom";

import { FaUserCircle } from "react-icons/fa";

export default function Header({ fullname, agentName }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userOperator");
    localStorage.removeItem("tokenOperator");
    navigate("/login");
  };
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-[21px]">Dashboard</h1>
          <h1 className="font-bold text-[21px]">{agentName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <a href="/">home</a>
          <a href="/data-process">active</a>
          <a href="/">history</a>
          <a href="/account">account</a>
          <span>{fullname}</span>
          <div className="relative group cursor-pointer">
            <FaUserCircle className="text-lg" />
            <span
              className="absolute w-20 text-center p-1 bg-zinc-300 left-1/2 -translate-x-1/2 rounded-md top-5 kanit-medium cursor-pointer scale-0 group-hover:scale-100 text-zinc-700"
              onClick={handleLogout}
            >
              Log out
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
