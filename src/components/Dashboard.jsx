import Header from "./Header";
import { Sidebar } from "./Sidebar";

import { useEffect, useState } from "react";
import Axios from "axios";

import { BsSignDoNotEnterFill } from "react-icons/bs";
import { MdToday } from "react-icons/md";
import { MdOutlinePendingActions } from "react-icons/md";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { PiCopySimpleFill } from "react-icons/pi";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userOperator");
  const token = localStorage.getItem("tokenOperator");
  const navigate = useNavigate();

  const [opProvider, setOpProvider] = useState("");
  const [fullname, setFullname] = useState("");
  const [operatorId, setOperatorId] = useState("");
  const [agentId, setAgentId] = useState("");
  const [agentName, setAgentName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  const [dataWdFromDb, setDataWdFromDb] = useState([]);

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  const getDataWdFromDb = async (id) => {
    try {
      const response = await Axios.get(`${apiUrl}/operator/datawd/${id}`);
      if (response.data.success) {
        setDataWdFromDb(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get data wd from db");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getOperatorAgentData = async () => {
    try {
      const response = await Axios.get(`${apiUrl}/operator/agent/${userLogin}`);
      if (response.data.success) {
        setOpProvider(response.data.result[0].provider);
        setFullname(response.data.result[0].fullname);
        setOperatorId(response.data.result[0].user_id);
        setAgentId(response.data.result[0].agent_id);
        setAgentName(response.data.result[0].name);
        setProfilePic(response.data.result[0].profile);
        getDataWdFromDb(response.data.result[0].agent_id);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get operator agent data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pendingRequest = dataWdFromDb.filter(
    (item) => item.status === "pending"
  );

  const rejectRequest = dataWdFromDb.filter((item) => item.status === "reject");

  const processRequest = dataWdFromDb.filter(
    (item) => item.status != "reject" && item.status != "pulled"
  );

  const todayRequest = dataWdFromDb.filter(
    (item) => item.status != "pulled" && item.status != "reject"
  );

  const totalWithdraw = processRequest.reduce(
    (total, item) => total + item.nominal,
    0
  );

  useEffect(() => {
    getOperatorAgentData();
  }, []);

  return (
    <>
      <div className="relative bg-white w-full max-w-[863px] lg:w-3/4 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header
          fullname={fullname}
          agentName={agentName}
          profilePic={profilePic}
        />
        <Sidebar />
        <Widget
          pendingRequest={pendingRequest}
          todayRequest={todayRequest}
          rejectRequest={rejectRequest}
          totalWithdraw={totalWithdraw}
        />
        <div className="w-full">
          <InputRequest
            apiUrl={apiUrl}
            opProvider={opProvider}
            operatorId={operatorId}
            agentId={agentId}
            getOperatorAgentData={getOperatorAgentData}
          />
        </div>
      </div>
    </>
  );
}

const Widget = ({
  pendingRequest,
  rejectRequest,
  totalWithdraw,
  todayRequest,
}) => {
  const [copiedTextStyle, setCopiedTextStyle] = useState(
    "opacity-5 scale-0 -top-0"
  );

  const rupiah = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  function copyText(value) {
    navigator.clipboard.writeText(value);
    setCopiedTextStyle("opacity-100 scale-100 -top-4");
    setTimeout(() => {
      setCopiedTextStyle("opacity-5 scale-0 -top-0");
    }, 2000);
  }

  return (
    <>
      <div className="w-full flex justify-end gap-8">
        <a
          href="/data-process"
          className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl"
        >
          <div className="flex justify-between px-6 items-center">
            <div className="text-[14px] kanit-regular">TODAY REQUEST</div>
            <div>
              <MdToday className="w-[24px] h-[24px]" />
            </div>
          </div>
          <div className="font-extrabold text-[40px] px-6">
            {todayRequest.length}
          </div>
          <hr className="w-full bg-[#DDDBE2] mt-3" />
          <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
            <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
          </div>
          <div className="px-6">
            <h1 className="text-[12px] font-bold text-black">
              Process Average
            </h1>
          </div>
        </a>
        <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
          <div className="flex justify-between px-6 items-center">
            <div className="text-[14px] kanit-regular">PENDING REQUEST</div>
            <div>
              <MdOutlinePendingActions className="w-[24px] h-[24px]" />
            </div>
          </div>
          <div className="font-extrabold text-[40px] px-6">
            {pendingRequest.length}
          </div>
          <hr className="w-full bg-[#DDDBE2] mt-3" />
          <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
            <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
          </div>
          <div className="px-6">
            <h1 className="text-[12px] font-bold text-black">Last Min Queue</h1>
          </div>
        </div>
        <div className="w-[238px] h-[174px] py-6 rounded-[14px] shadow-2xl">
          <div className="flex justify-between px-6 items-center">
            <div className="text-[14px] kanit-regular">REJECT REQUEST</div>
            <div>
              <BsSignDoNotEnterFill className="w-[24px] h-[24px] text-black" />
            </div>
          </div>
          <div className="font-extrabold text-[40px] px-6">
            {rejectRequest.length}
          </div>
          <hr className="w-full bg-[#DDDBE2] mt-3" />
          <div className="w-[188px] h-[7px] rounded-[31px] bg-[#C8C0DF] mx-auto mt-4">
            <div className="w-[133px] h-[7px] rounded-[31px] bg-[#602BF8]"></div>
          </div>
          <div className="px-6">
            <h1 className="text-[12px] font-bold text-black">Response Rate</h1>
          </div>
        </div>
      </div>
      <div className="relative w-full px-6 flex justify-end items-center gap-3 border-b">
        <h1 className="kanit-medium text-lg">Total :</h1>
        <div
          className="flex gap-1 items-center cursor-pointer"
          onClick={() => copyText(totalWithdraw)}
        >
          <h1 className="text-xl kanit-medium cursor-pointer">
            {rupiah.format(totalWithdraw)}
          </h1>
          <PiCopySimpleFill className="text-lg cursor-pointer text-[#602BF8]" />
        </div>
        <span
          className={`text-sm absolute font-semibold text-zinc-600 duration-200 ${copiedTextStyle}`}
        >
          Data Copied
        </span>
      </div>
    </>
  );
};

const InputRequest = ({
  apiUrl,
  opProvider,
  operatorId,
  agentId,
  getOperatorAgentData,
}) => {
  const [dataWd, setDataWd] = useState("");
  const [username, setUsername] = useState("");
  const [memberWdTime, setMemberWdTime] = useState("");
  const [bank, setBank] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [nominal, setNominal] = useState(0);
  const [lastBalance, setLastBalance] = useState(0);

  const [inputStatus, setInputStatus] = useState("");
  const [inputSuccessMessage, setInputSuccessMessage] = useState("");
  const [inputErrorMessage, setInputErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dataWd && opProvider === "IDNTOTO") {
      handleOnChangeDataWdIdnToto();
      setInputErrorMessage("");
      setInputSuccessMessage("");
    } else if (dataWd && opProvider === "IDNSPORT") {
      handleOnChangeDataWdIdnSport();
      setInputErrorMessage("");
      setInputSuccessMessage("");
    }
  }, [dataWd]);

  const handleOnChangeDataWdIdnToto = () => {
    const lines = dataWd
      .trim()
      .split("\n")
      .map((line) => line.trim());

    // Memastikan bahwa data memiliki cukup baris sebelum mencoba mengaksesnya
    if (lines.length < 4 || lines.length > 4) {
      setInputStatus("Format salah!");
      return;
    } else {
      setInputStatus("");
    }

    try {
      // Menentukan nilai-nilai dari dataWd
      const username = lines[0];
      const secondLineParts = lines[1].split("\t"); // Memisahkan berdasarkan tab
      const memberWdTime = secondLineParts[1];
      const nominal = secondLineParts[2];
      const lastBalance = secondLineParts[3];
      const bank = lines[3];
      const [bankName, accountNumber, accountName] = bank
        .split(", ")
        .map((part) => part.trim());

      // Mengatur state
      setUsername(username);
      setMemberWdTime(memberWdTime);
      setBank(bankName);
      setAccountName(accountName);
      setAccountNumber(accountNumber);
      setNominal(nominal.replace(/,|\s+$/g, ""));
      setLastBalance(lastBalance.replace(/,|\s+$/g, ""));
    } catch (error) {
      console.error("Error parsing data: ", error);
    }
  };

  const handleOnChangeDataWdIdnSport = () => {
    const lines = dataWd
      .trim()
      .split("\t")
      .map((line) => line.trim());

    if (lines.length < 5 || lines > 5) {
      setInputStatus("Format salah!");
      return;
    } else {
      setInputStatus("");
    }

    try {
      const username = lines[0];
      const secondLineParts = lines[1].split(" ");
      const bank = secondLineParts[0];
      const accountNumber = secondLineParts[1].split("-").join("");
      const accountName = secondLineParts.slice(2).join(" ");
      const nominal = lines[2].replace(/,|\s+$/g, "");
      const lastBalance = lines[3].replace(/,|\s+$/g, "");

      const memberWdTime = lines[4];
      const [date, timeOfDay] = memberWdTime.split(" ");
      const [day, month, year] = date.split("/");
      const formattedTime = `${year}-${month}-${day} ${timeOfDay}`;

      setUsername(username);
      setMemberWdTime(formattedTime);
      setBank(bank);
      setAccountName(accountName);
      setAccountNumber(accountNumber);
      setNominal(parseInt(nominal, 10));
      setLastBalance(parseInt(lastBalance, 10));
    } catch (error) {
      console.log(error);
    }
  };

  // console.log("username", username);
  // console.log("wd time", memberWdTime);
  // console.log("bank", bank);
  // console.log("nama", accountName);
  // console.log("norek", accountNumber);
  // console.log("nominal", nominal);
  // console.log("last balance", lastBalance);

  const handleClickReset = () => {
    setUsername("");
    setMemberWdTime("");
    setBank("");
    setAccountName("");
    setAccountNumber("");
    setNominal("");
    setLastBalance("");
    setDataWd("");
    setInputStatus("");
  };

  const rupiah = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const response = await Axios.post(`${apiUrl}/operator/input`, {
        operatorId,
        agentId,
        username,
        memberWdTime,
        bank,
        accountName,
        accountNumber,
        nominal,
        lastBalance,
      });
      if (response.data.success) {
        setInputSuccessMessage(response.data.message);
        handleClickReset();
        getOperatorAgentData();
      } else if (response.data.error) {
        console.log(response.data.error);
        setInputErrorMessage(response.data.message);
      } else {
        console.log("Something Error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="px-6">
        <div className="w-full flex justify-between px-3 pb-2">
          <h1 className="kanit-medium">Paste Disini</h1>
          <h1 className="kanit-medium">Split Result</h1>
        </div>
        <div className="flex justify-between gap-2 min-h-64">
          <div className="w-1/3 flex flex-col">
            <span className="text-sm text-red-500 px-2">{inputStatus}</span>
            <textarea
              name="data-wd"
              id="data-wd"
              placeholder="Paste Disini..."
              className="border rounded-md outline-none w-full text-sm min-h-72 p-2"
              value={dataWd}
              onChange={(e) => setDataWd(e.target.value)}
            ></textarea>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex-1 flex flex-col gap-2 min-h-64 h-auto justify-between"
          >
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="username" className="text-sm w-1/4">
                Username
              </label>
              <input
                type="text"
                id="username"
                placeholder="Username"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="wdtime" className="text-sm w-1/4">
                Date Time
              </label>
              <input
                type="text"
                id="wdtime"
                placeholder="Date Time"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={memberWdTime}
                onChange={(e) => setMemberWdTime(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="bank" className="text-sm w-1/4">
                Bank
              </label>
              <input
                type="text"
                id="bank"
                placeholder="Bank"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="account-number" className="text-sm w-1/4">
                Nomor Rekening
              </label>
              <input
                type="text"
                id="account-number"
                placeholder="Nomor Rekening"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="account-name" className="text-sm w-1/4">
                Nama Rekening
              </label>
              <input
                type="text"
                id="account-name"
                placeholder="Nama Rekening"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="nominal" className="text-sm w-1/4">
                Nominal
              </label>
              <input
                type="text"
                id="nominal"
                placeholder="Nominal"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={nominal}
                onChange={(e) => setNominal(e.target.value)}
              />
            </div>
            <div className="w-full flex items-center justify-between gap-2">
              <label htmlFor="last-balance" className="text-sm w-1/4">
                Sisa Saldo
              </label>
              <input
                type="text"
                id="last-balance"
                placeholder="Sisa Saldo"
                className="border-2 rounded-md flex-1 p-1 text-sm outline-none"
                value={lastBalance}
                onChange={(e) => setLastBalance(e.target.value)}
              />
            </div>
            <span className="text-sm text-red-500 px-2 mx-auto">
              {inputErrorMessage}
            </span>
            <span className="text-sm text-green-500 px-2 mx-auto">
              {inputSuccessMessage}
            </span>
            <div className="w-full flex justify-center gap-2">
              <button
                type="submit"
                className="w-20 h-8 py-1 rounded-md bg-[#602BF8] text-white flex justify-center items-center"
              >
                {loading ? (
                  <AiOutlineLoading3Quarters className="animate-spin text-lg" />
                ) : (
                  "Submit"
                )}
              </button>
              <button
                type="reset"
                className="w-20 h-8 py-1 rounded-md bg-[#333333] text-white flex justify-center items-center"
                onClick={() => handleClickReset()}
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};
