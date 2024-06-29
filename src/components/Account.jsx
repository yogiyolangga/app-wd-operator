import Header from "./Header";
import { Sidebar } from "./Sidebar";

import { useEffect, useState } from "react";
import Axios from "axios";

import { RiAccountPinCircleFill } from "react-icons/ri";
import { GoEyeClosed, GoEye } from "react-icons/go";
import { RiLockPasswordFill } from "react-icons/ri";
import { FaRegCircleUser } from "react-icons/fa6";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { ImPencil2 } from "react-icons/im";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { MdGroupAdd } from "react-icons/md";
import { TiCancelOutline } from "react-icons/ti";
import { CgWebsite } from "react-icons/cg";
import { FaUserFriends } from "react-icons/fa";

import Loading from "./Loading";
import { useNavigate } from "react-router-dom";

export default function Account() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userOperator");
  const token = localStorage.getItem("tokenOperator");
  const role = localStorage.getItem("roleOperator");
  const navigate = useNavigate();

  const [hideAddOperator, setHideAddOperator] = useState(true);
  const [editForm, setEditForm] = useState(false);
  const [operatorList, setOperatorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [getStatus, setGetStatus] = useState("");
  const [idEdit, setIdEdit] = useState();
  const [fullname, setFullname] = useState("");

  const [agentList, setAgentList] = useState([]);
  const [agentName, setAgentName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (role != "administrator") {
      alert("You can't access this page");
      navigate("/");
    }
  }, []);

  const getOperatorAgentData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await Axios.get(`${apiUrl}/operator/agent/${userLogin}`);
      if (response.data.success) {
        setFullname(response.data.result[0].fullname);
        setAgentName(response.data.result[0].name);
        setProfilePic(response.data.result[0].profile);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get operator agent data");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOperatorAgentData();
  }, []);

  const getAgent = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await Axios.get(`${apiUrl}/agent`);
      if (response.data.success) {
        setAgentList(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error, "Agent");
      } else {
        console.log("Something error, when getting agentlist");
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getOperator = async () => {
    setLoading(true);
    setGetStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const response = await Axios.get(`${apiUrl}/operator`);

      if (response.data.error) {
        setGetStatus(response.data.error);
      } else if (response.data.success) {
        setOperatorList(response.data.result);
      } else {
        setGetStatus("Something running error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Function to handle the escape key event
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setEditForm(false); // Set state to false when Escape is pressed
      }
    };

    // Add event listener to the window
    window.addEventListener("keydown", handleKeydown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []); // Empty dependency array means this effect runs only on mount and unmount

  return (
    <>
      <div className="relative bg-white dark:bg-zinc-700 dark:text-zinc-50 w-full max-w-[863px] lg:w-3/4 min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header
          fullname={fullname}
          agentName={agentName}
          profilePic={profilePic}
        />
        <Sidebar />
        <div
          className={`${
            hideAddOperator ? "hidden" : ""
          } duration-150 border-b pb-1`}
        >
          <AddOperator
            apiUrl={apiUrl}
            getOperator={getOperator}
            agentList={agentList}
            getAgent={getAgent}
          />
        </div>
        <div className="">
          <Operators
            apiUrl={apiUrl}
            setHideAddOperator={setHideAddOperator}
            hideAddOperator={hideAddOperator}
            operatorList={operatorList}
            loading={loading}
            getStatus={getStatus}
            getOperator={getOperator}
            setEditForm={setEditForm}
            setIdEdit={setIdEdit}
          />
        </div>
      </div>
      <div
        className={`${
          editForm ? "flex" : "hidden"
        } fixed min-w-full min-h-screen top-0 justify-center bg-zinc-800 bg-opacity-30 backdrop-blur-sm items-center z-10`}
      >
        <EditOperator
          setEditForm={setEditForm}
          idEdit={idEdit}
          operatorList={operatorList}
          apiUrl={apiUrl}
          getOperator={getOperator}
          agentList={agentList}
        />
      </div>
    </>
  );
}

const AddOperator = ({ apiUrl, getOperator, getAgent, agentList }) => {
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [agent, setAgent] = useState();
  const [role, setRole] = useState("");
  const [regisStatus, setRegisStatus] = useState("");

  useEffect(() => {
    getAgent();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setRegisStatus("");
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const spaceRegex = /\s/;

      if (username.length < 5) {
        setRegisStatus("Username minimal 5 karakter ya!");
      } else if (spaceRegex.test(username)) {
        setRegisStatus("Username Invalid!");
      } else if (fullname.length < 5) {
        setRegisStatus("Isi name lengkap yang lengkap :)");
      } else if (password.length < 8) {
        setRegisStatus("Password minimal 8 karakter ya!");
      } else if (agent.length < 1) {
        setRegisStatus("Pilih Agent!");
      } else if (role.length < 1) {
        setRegisStatus("Pilih role user!");
      } else {
        const response = await Axios.post(`${apiUrl}/operator/register`, {
          fullname: fullname,
          username: username,
          password: password,
          agent: agent,
          role: role,
        });

        if (response.data.success) {
          setRegisStatus(response.data.success);
          getOperator();
        } else if (response.data.error) {
          setRegisStatus(response.data.error);
        } else {
          console.log("Something Error");
        }
      }

      setLoading(false);
      setFullname("");
      setUsername("");
      setPassword("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="w-full px-6 flex flex-col justify-center items-center gap-1"
      >
        <div className="w-1/2">
          <label htmlFor="fullname" className="text-sm pl-2">
            Nama Lengkap
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiAccountPinCircleFill className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type="text"
              id="fullname"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Nama Lengkap"
              value={fullname}
              onChange={(e) => {
                setFullname(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="username" className="text-sm pl-2">
            Username
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaRegCircleUser className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type="text"
              id="username"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="password" className="text-sm pl-2">
            Password
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiLockPasswordFill className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type={passwordType}
              id="password"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
            <GoEyeClosed
              className={`w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50 cursor-pointer ${
                passwordType === "password" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("text")}
            />
            <GoEye
              className={`w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50 cursor-pointer ${
                passwordType === "text" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("password")}
            />
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="agent" className="text-sm pl-2">
            Agent
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <CgWebsite className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <select
              name="agent"
              id="agent"
              className="outline-none dark:bg-transparent flex-1"
              value={agent}
              onChange={(e) => {
                setAgent(e.target.value);
              }}
            >
              <option className="dark:bg-zinc-600" value="">Pilih Agent</option>
              {agentList.map((item, index) => (
                <option className="dark:bg-zinc-600" key={index} value={item.agent_id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="w-1/2">
          <label htmlFor="role" className="text-sm pl-2">
            Role
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaUserFriends className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <select
              name="role"
              id="role"
              className="outline-none dark:bg-transparent flex-1"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
              }}
            >
              <option className="dark:bg-zinc-600" value="">Pilih Role</option>
              <option className="dark:bg-zinc-600" value="administrator">Administrator</option>
              <option className="dark:bg-zinc-600" value="moderator">Moderator</option>
              <option className="dark:bg-zinc-600" value="staff">Staff</option>
            </select>
          </div>
        </div>
        <div className="w-1/2">
          <p className="text-red-500 text-sm text-center">{regisStatus}</p>
        </div>
        <div className="w-1/2">
          <button
            type="submit"
            className="w-full rounded-full flex justify-center items-center text-white bg-gradient-to-tl from-[#00E1FD] to-[#602BF8] h-10 hover:opacity-70 dark:from-zinc-900 dark:to-zinc-500"
          >
            {loading === true ? (
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
            ) : (
              "Submit"
            )}
          </button>
        </div>
      </form>
    </>
  );
};

const Operators = ({
  apiUrl,
  setHideAddOperator,
  hideAddOperator,
  operatorList,
  loading,
  getStatus,
  getOperator,
  setEditForm,
  setIdEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  useEffect(() => {
    getOperator();
  }, []);

  const handleDeleteOperator = async (id) => {
    const confirmation = window.confirm("Kamu yakin ?");
    if (confirmation) {
      try {
        const response = await Axios.delete(`${apiUrl}/operator/${id}`);

        if (response.data.success) {
          getOperator();
        } else if (response.data.error) {
          console.log(response.data.error);
        } else {
          console.log("Something Error!");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleClickEdit = (id) => {
    setEditForm(true);
    setIdEdit(id);
  };

  const filteredData = operatorList.filter((item) => {
    return Object.values(item).some((value) =>
      value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all filtered items
      setSelectedItems(filteredData.map((item) => item.user_id));
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    // Update select all checkbox status based on filtered data and selected items
    if (
      filteredData.length > 0 &&
      selectedItems.length === filteredData.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [filteredData, selectedItems]);

  const handleCheckboxChange = (user_id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(user_id)) {
        // Hapus user_id dari selectedItems jika sudah ada
        return prevSelectedItems.filter((id) => id !== user_id);
      } else {
        // Tambah user_id ke selectedItems jika belum ada
        return [...prevSelectedItems, user_id];
      }
    });
  };

  const handleDeleteMultipleOperator = async () => {
    setLoadingDelete(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.delete(`${apiUrl}/multiple/operator`, {
        data: { ids: selectedItems },
      });
      if (response.data.success) {
        alert("Hapus Berhasil!");
        getOperator();
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Something might error!");
      }

      setLoadingDelete(false);
      setSelectedItems([]);
    } catch (error) {
      console.log(error);
      setLoadingDelete(false);
    }
  };

  return (
    <>
      <div className="w-full px-6 flex flex-col">
        <div className="w-full flex justify-center">
          <p className="text-red-500 text-sm">{getStatus}</p>
        </div>

        {loading ? (
          <div className="pt-2">
            <Loading />
          </div>
        ) : (
          <div className="w-full">
            <div className="w-full flex justify-start gap-2 pb-1 items-center">
              {hideAddOperator ? (
                <button
                  className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                  onClick={() => setHideAddOperator(false)}
                >
                  <MdGroupAdd className="text-lg text-zinc-100" />
                </button>
              ) : (
                <button
                  className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80"
                  onClick={() => setHideAddOperator(true)}
                >
                  <TiCancelOutline className="text-lg text-zinc-100" />
                </button>
              )}
              <input
                type="text"
                placeholder="Cari Nama..."
                className="border p-1 rounded-md outline-none dark:bg-zinc-600"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
            <div className="w-full flex justify-evenly items-center gap-1 py-1 border">
              <div className="w-10 flex justify-center">
                <input
                  type="checkbox"
                  name="id"
                  id="id"
                  className="cursor-pointer"
                  checked={selectAll}
                  onChange={handleSelectAllChange}
                />
              </div>
              <div className="flex-1 flex justify-center kanit-medium">
                Name
              </div>
              <div className="flex-1 flex justify-center kanit-medium">
                Username
              </div>
              <div className="flex-1 flex justify-center kanit-medium">
                Agent
              </div>
              <div className="flex-1 flex justify-center kanit-medium">
                Role
              </div>
              <div className="w-20"></div>
            </div>
            {filteredData.map((item, index) => (
              <div
                key={index}
                className="w-full flex justify-evenly items-center gap-1 py-1 border"
              >
                <div className="w-10 flex justify-center">
                  <input
                    type="checkbox"
                    name={item.user_id}
                    id={item.user_id}
                    className="cursor-pointer"
                    checked={selectedItems.includes(item.user_id)}
                    onChange={() => handleCheckboxChange(item.user_id)}
                  />
                </div>
                <div className="flex-1 flex justify-center">
                  {item.fullname}
                </div>
                <div className="flex-1 flex justify-center">
                  {item.username}
                </div>
                <div className="flex-1 flex justify-center">
                  {item.agent_name}
                </div>
                <div className="flex-1 flex justify-center">{item.role}</div>
                <div className="w-20 flex justify-center gap-1">
                  <button
                    className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                    onClick={() => handleClickEdit(item.user_id)}
                  >
                    <ImPencil2 className="text-zinc-100" />
                  </button>
                  <button className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80">
                    <RiDeleteBin6Fill
                      className="text-zinc-100"
                      onClick={() => handleDeleteOperator(item.user_id)}
                    />
                  </button>
                </div>
              </div>
            ))}
            <button
              className={`px-2 py-1 rounded-md bg-[#f82b2b] text-zinc-100 my-1 hover:bg-opacity-80 ${
                selectedItems.length < 1 ? "opacity-10 cursor-not-allowed" : ""
              }`}
              disabled={selectedItems.length < 1 ? true : false}
              onClick={() => {
                const confirm = window.confirm("Kamu yakin menghapus data");
                if (confirm) {
                  handleDeleteMultipleOperator();
                }
              }}
            >
              {loadingDelete ? (
                <AiOutlineLoading3Quarters className="animate-spin" />
              ) : (
                "Delete"
              )}
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const EditOperator = ({
  setEditForm,
  idEdit,
  operatorList,
  apiUrl,
  getOperator,
  agentList,
}) => {
  const [loading, setLoading] = useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [operatorId, setOperatorId] = useState();
  const [newFullname, setNewFullname] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [newPass, setNewPass] = useState("");
  const [newAgent, setNewAgent] = useState();
  const [newRole, setnewRole] = useState("");
  const [status, setStatus] = useState("");

  const handleUpadateAdmin = async () => {
    setLoading(true);
    try {
      const response = await Axios.put(`${apiUrl}/operator`, {
        operatorId: operatorId,
        newFullname: newFullname,
        newUsername: newUsername,
        newPass: newPass,
        newAgent: newAgent,
        newRole: newRole,
      });
      if (response.data.success) {
        setEditForm(false);
        getOperator();
        setLoading(false);
        setNewPass("");
      } else if (response.data.error) {
        console.log(response.data.error);
        setStatus(response.data.error);
      } else {
        console.log("Something Error!");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (idEdit != undefined) {
      setNewFullname(dataCheck.fullname);
      setNewUsername(dataCheck.username);
      setNewPass("");
      setOperatorId(dataCheck.user_id);
      setNewAgent(dataCheck.agent_id);
      setnewRole(dataCheck.role);
    }
  }, [idEdit]);

  const dataCheck = operatorList.find((item) => item.user_id === idEdit);

  return (
    <>
      <div className="p-3 bg-white dark:bg-zinc-700 dark:text-zinc-50 shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
        <div className="">
          <label htmlFor="edit-fullname" className="text-sm pl-2">
            Nama Lengkap
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiAccountPinCircleFill className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type="text"
              id="edit-fullname"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Nama Lengkap"
              value={newFullname}
              onChange={(e) => {
                setNewFullname(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="">
          <label htmlFor="edit-username" className="text-sm pl-2">
            Username
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaRegCircleUser className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type="text"
              id="edit-username"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="Username"
              value={newUsername}
              onChange={(e) => {
                setNewUsername(e.target.value);
              }}
            />
          </div>
        </div>
        <div className="">
          <label htmlFor="edit-password" className="text-sm pl-2">
            Password
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <RiLockPasswordFill className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <input
              type={passwordType}
              id="edit-password"
              className="flex-1 h-full rounded-md outline-none dark:bg-transparent"
              placeholder="New Password"
              value={newPass}
              onChange={(e) => {
                setNewPass(e.target.value);
              }}
            />
            <GoEyeClosed
              className={`w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50 cursor-pointer ${
                passwordType === "password" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("text")}
            />
            <GoEye
              className={`w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50 cursor-pointer ${
                passwordType === "text" ? "" : "hidden"
              }`}
              onClick={() => setPasswordType("password")}
            />
          </div>
        </div>
        <div className="">
          <label htmlFor="agent" className="text-sm pl-2">
            Agent
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <CgWebsite className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <select
              name="agent"
              id="agent"
              className="outline-none flex-1 dark:bg-transparent"
              value={newAgent}
              onChange={(e) => {
                setNewAgent(e.target.value);
              }}
            >
              <option className="dark:bg-zinc-600" value="">Pilih Agent</option>
              {agentList.map((item, index) => (
                <option className="dark:bg-zinc-600" key={index} value={item.agent_id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="">
          <label htmlFor="role" className="text-sm pl-2">
            Role
          </label>
          <div className="min-w-64 h-10 flex justify-between items-center gap-2 rounded-full border px-2">
            <FaUserFriends className="w-[24px] h-[24px] text-zinc-700 dark:text-zinc-50" />
            <select
              name="role"
              id="role"
              className="outline-none flex-1 dark:bg-transparent"
              value={newRole}
              onChange={(e) => {
                setnewRole(e.target.value);
              }}
            >
              <option className="dark:bg-zinc-600" value="">Pilih Role</option>
              <option className="dark:bg-zinc-600" value="administrator">Administrator</option>
              <option className="dark:bg-zinc-600" value="moderator">Moderator</option>
              <option className="dark:bg-zinc-600" value="staff">Staff</option>
            </select>
          </div>
        </div>
        <div className="w-1/2">
          <p className="text-red-500 text-sm text-center">{status}</p>
        </div>
        <div className="w-full flex pt-2 justify-center gap-2">
          <button
            className="px-3 rounded-xl flex justify-center items-center text-white bg-gradient-to-tl from-[#00E1FD] to-[#602BF8] h-10 hover:opacity-70"
            onClick={handleUpadateAdmin}
          >
            {loading === true ? (
              <AiOutlineLoading3Quarters className="animate-spin text-lg" />
            ) : (
              "Update"
            )}
          </button>
          <button
            type="button"
            className="px-3 rounded-xl flex justify-center items-center text-white bg-gradient-to-tl from-[#f500fd] to-[#f82b2b] h-10 hover:opacity-70"
            onClick={() => setEditForm(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
