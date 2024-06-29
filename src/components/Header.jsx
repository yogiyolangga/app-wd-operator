import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { FaUserCircle } from "react-icons/fa";
import { FaRegLightbulb } from "react-icons/fa";

export default function Header({ fullname, agentName, profilePic }) {
  const [theme, setTheme] = useState(null);
  const path = useLocation();
  const navigate = useNavigate();
  const apiUrl = import.meta.env.VITE_API_URL;

  const role = localStorage.getItem("roleOperator");

  const handleLogout = () => {
    localStorage.removeItem("userOperator");
    localStorage.removeItem("tokenOperator");
    localStorage.removeItem("roleOperator");
    navigate("/login");
  };

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      setTheme("dark");
    } else if (localStorage.getItem("theme") === "light") {
      setTheme("light");
    } else if (window.matchMedia("(prefers-color-scheme : dark)").matches) {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  const handleThemeSwitch = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("theme", "light");
    } else {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
    }
  };
  return (
    <>
      <div className="w-full flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div
            className="py-0.5 px-1 w-[50px] bg-zinc-200 rounded-xl cursor-pointer border-2 border-black group"
            onClick={handleThemeSwitch}
          >
            <div className="w-[20px] h-[20px] flex justify-center items-center rounded-full border-2 border-black bg-yellow-400 dark:bg-zinc-600 dark:translate-x-full duration-300 group-hover:scale-105">
              <FaRegLightbulb className="text-sm" />
            </div>
          </div>
          <h1 className="font-bold text-[21px] dark:text-zinc-200">Dashboard</h1>
          <h1 className="font-bold text-[21px] dark:text-zinc-200">{agentName}</h1>
        </div>
        <div className="flex items-center gap-3">
          <a
            href="/"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname === "/" ? "underline" : ""
            }`}
          >
            home
          </a>
          <a
            href="/data-process"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname.includes("data-process") ? "underline" : ""
            }`}
          >
            on-process
          </a>
          <a
            href="/history"
            className={`dark:text-zinc-200 hover:underline ${
              path.pathname.includes("history") ? "underline" : ""
            }`}
          >
            history
          </a>
          <a
            href="/account"
            className={`dark:text-zinc-200 hover:underline ${
              role != "administrator" ? "hidden" : ""
            } ${path.pathname.includes("account") ? "underline" : ""}`}
          >
            user
          </a>
          <a
            href="/profile"
            className={`flex items-center gap-1 dark:text-zinc-200 hover:underline ${
              path.pathname.includes("profile") ? "underline" : ""
            }`}
          >
            <span>{fullname}</span>
          </a>
          <div className="relative group cursor-pointer">
            {profilePic ? (
              <img
                src={`${apiUrl}/${profilePic}`}
                alt="Profile"
                className="w-[28px] h-[28px] rounded-full"
              />
            ) : (
              <FaUserCircle className="text-[28px]" />
            )}
            <span
              className="absolute w-20 text-center p-1 bg-zinc-300 left-1/2 -translate-x-1/2 rounded-md top-7 kanit-medium cursor-pointer scale-0 group-hover:scale-100 text-zinc-700"
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
