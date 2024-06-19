import { useEffect, useState } from "react";
import Axios from "axios";

import heroImg from "../assets/hero-img-login.jpg";
import facebook from "../assets/fb.png";
import google from "../assets/google.png";

import { FaRegUser } from "react-icons/fa6";
import { TfiLock } from "react-icons/tfi";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  return (
    <>
      <div className="bg-white w-full max-w-[969px] min-h-[544px] rounded-[50px] flex items-center p-14">
        <LoginForm apiUrl={apiUrl} />
      </div>
    </>
  );
}

const LoginForm = ({ apiUrl }) => {
  const [passwordType, setPasswordType] = useState("password");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginMessage, setLoginMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLoginMessage("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const response = await Axios.post(`${apiUrl}/operator/login`, {
        username: username,
        password: password,
      });

      if (response.data.success) {
        localStorage.setItem("tokenOperator", response.data.token);
        localStorage.setItem("userOperator", response.data.username);
        navigate("/");
      } else if (response.data.error) {
        setLoginMessage(response.data.error);
        setLoading(false);
      } else {
        setLoginMessage("An error occurred. Please try again later.");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const isLoggedIn = () => {
    const token = localStorage.getItem("tokenOperator");
    return !!token;
  };

  useEffect(() => {
    if (isLoggedIn()) {
      navigate("/");
    }
  }, []);

  return (
    <>
      <div className="flex flex-col gap-3 md:flex-row md:gap-0 w-full">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 gap-3 justify-center items-center"
        >
          <div className="flex items-center justify-center flex-col">
            <h1 className="smooch-sans-bold text-[90px] leading-[50px]">
              Welcome
            </h1>
            <p className="smooch-sans-regular text-[15px]">
              We are glad to see your back with us
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-[13px] bg-[#F2F2F2] p-1 w-full md:w-3/4">
            <FaRegUser className="text-[#1c1c1c] w-[20px]" />
            <input
              type="text"
              className="bg-transparent flex-1 outline-none h-[32px] px-1"
              placeholder="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-1 rounded-[13px] bg-[#F2F2F2] p-1 w-full md:w-3/4">
            <TfiLock className="w-[20px] text-[#1c1c1c]" />
            <input
              type={passwordType}
              id="password"
              className="bg-transparent flex-1 outline-none h-[32px] px-1"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <GoEyeClosed
              className={`w-[24px] h-[24px] text-zinc-700 cursor-pointer ${
                passwordType === "password" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("text")}
            />
            <GoEye
              className={`w-[24px] h-[24px] text-zinc-700 cursor-pointer ${
                passwordType === "text" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("password")}
            />
          </div>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="py-2 flex justify-center bg-[#1C1C1C] w-full md:w-3/4 text-white rounded-[13px] h-10 items-center"
            >
              {loading ? (
                <AiOutlineLoading3Quarters className="text-white animate-spin" />
              ) : (
                "NEXT"
              )}
            </button>
          </div>
          <div className="text-red-500 text-xs">{loginMessage}</div>
          <div className="w-[80%] flex justify-center border-t my-6 relative">
            <h1 className="text-[16px] absolute bg-white -top-[12px] px-1.5">
              <span className="font-semibold">Login</span> with Others
            </h1>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-[13px] bg-[#FFFFFF] p-1 w-full md:w-3/4 border border-black h-10 cursor-pointer">
            <img src={google} alt="Google" className="h-[28px]" />
            <p className="text-xs">
              Login with <span className="font-semibold">Google</span>
            </p>
          </div>
          <div className="flex items-center justify-center gap-1 rounded-[13px] bg-[#FFFFFF] p-1 w-full md:w-3/4 border border-black h-10 cursor-pointer">
            <img src={facebook} alt="Google" className="h-[28px]" />
            <p className="text-xs">
              Login with <span className="font-semibold">Facebook</span>
            </p>
          </div>
        </form>
        <div className="flex flex-1 justify-center items-center">
          <img
            src={heroImg}
            alt="Login"
            className="w-full min-w-52 h-auto rounded-[50px]"
          />
        </div>
      </div>
    </>
  );
};
