import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import Loading from "./Loading";
import moment from 'moment-timezone';

import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { GiConfirmed, GiCancel } from "react-icons/gi";
import { PiHandCoinsFill } from "react-icons/pi";
import { BiLoaderCircle } from "react-icons/bi";
import { FaSort } from "react-icons/fa6";
import { TbListDetails } from "react-icons/tb";

export default function HistoryDetails() {
  const closedId = useParams();
  const [dataDetails, setDataDetails] = useState(false);
  const [idDetail, setIdDetail] = useState();
  const [loading, setLoading] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userOperator");
  const token = localStorage.getItem("tokenOperator");
  const navigate = useNavigate();

  const [fullname, setFullname] = useState("");

  const [dataHistoryDetails, setDataHistoryDetails] = useState([]);
  const [agentName, setAgentName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  const getDataWdHistory = async (agen) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const response = await Axios.get(
        `${apiUrl}/op/history/${closedId.id}/${agen}`
      );
      if (response.data.success) {
        setDataHistoryDetails(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get data wd from db");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  const getOperatorData = async () => {
    setLoading(true);
    try {
      const response = await Axios.get(`${apiUrl}/operator/agent/${userLogin}`);
      if (response.data.success) {
        setFullname(response.data.result[0].fullname);
        setAgentName(response.data.result[0].name);
        setProfilePic(response.data.result[0].profile);
        getDataWdHistory(response.data.result[0].agent_id);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get operator agent data");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOperatorData();
  }, []);

  useEffect(() => {
    // Function to handle the escape key event
    const handleKeydown = (event) => {
      if (event.key === "Escape") {
        setDataDetails(false); // Set state to false when Escape is pressed
      }
    };

    // Add event listener to the window
    window.addEventListener("keydown", handleKeydown);

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("keydown", handleKeydown);
    };
  }, []); // Empty dependency array means this effect runs only on mount and unmount

  const rupiah = new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return (
    <>
      <div className="relative bg-white dark:bg-zinc-700 w-full max-w-[90%]  min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header
          fullname={fullname}
          agentName={agentName}
          profilePic={profilePic}
        />
        <Sidebar />
        <div>
          <Data
            setDataDetails={setDataDetails}
            setIdDetail={setIdDetail}
            dataHistoryDetails={dataHistoryDetails}
            loading={loading}
            rupiah={rupiah}
            apiUrl={apiUrl}
            getOperatorData={getOperatorData}
            getDataWdHistory={getDataWdHistory}
            userLogin={userLogin}
          />
        </div>
      </div>
      <div
        className={`${
          dataDetails ? "flex" : "hidden"
        } fixed min-w-full min-h-screen top-0 justify-center bg-zinc-800 bg-opacity-30 backdrop-blur-sm items-center z-10`}
      >
        <DataDetails
          setDataDetails={setDataDetails}
          dataHistoryDetails={dataHistoryDetails}
          idDetail={idDetail}
          rupiah={rupiah}
          fullname={fullname}
          apiUrl={apiUrl}
        />
      </div>
    </>
  );
}

const Data = ({
  setDataDetails,
  setIdDetail,
  dataHistoryDetails,
  loading,
  rupiah,
  apiUrl,
  getDataWdHistory,
  userLogin,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [byStatusData, setByStatusData] = useState([]);
  const [statusData, setStatusData] = useState("all");
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    const filtered = dataHistoryDetails.filter(
      (item) => item.status != "pulled"
    );
    setByStatusData(filtered);
  }, [dataHistoryDetails]);

  const handleFilterByStatus = (status) => {
    if (status === "all") {
      const filtered = dataHistoryDetails.filter(
        (item) => item.status != "pulled"
      );
      setByStatusData(filtered);
      setStatusData(status);
      setCurrentPage(1);
    } else {
      const filtered = dataHistoryDetails.filter(
        (item) => item.status === status
      );
      setByStatusData(filtered);
      setStatusData(status);
      setCurrentPage(1);
    }
  };

  const filteredData = byStatusData.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();

    const fieldsToFilter = [
      item.agent_name,
      item.member_username,
      item.account_name,
      item.bank_name,
      item.account_number,
      item.nominal,
      item.admin_name,
    ];

    return fieldsToFilter.some((value) => {
      if (value === null || value === undefined) {
        return false;
      }
      return value.toString().toLowerCase().includes(searchTermLower);
    });
  });

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;
  const currentData = sortedData.slice(firstPostIndex, lastPostIndex);

  const totalPages = Math.ceil(byStatusData.length / postPerPage);

  const [maxPagesToShow] = useState(5);

  const getPageNumbers = () => {
    let pageNumbers = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 2) {
        // Jika halaman saat ini di awal (1, 2, 3, ...)
        for (let i = 1; i <= maxPagesToShow; i++) {
          pageNumbers.push(i);
        }
        if (totalPages > maxPagesToShow) {
          pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman lebih lanjut
          pageNumbers.push(totalPages);
        }
      } else if (currentPage >= totalPages - 1) {
        // Jika halaman saat ini di akhir (..., 98, 99, 100)
        pageNumbers.push(1);
        pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman sebelumnya
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Jika halaman saat ini di tengah (misalnya 6, 7, 8, ..., 95, 96, 97)
        pageNumbers.push(1);
        pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman sebelumnya

        // Menentukan range halaman sebelum dan sesudah currentPage
        const startPage = currentPage - 1;
        const endPage = currentPage + 1;

        for (let i = startPage; i <= endPage; i++) {
          pageNumbers.push(i);
        }

        pageNumbers.push("..."); // Tambahkan elipsis untuk menunjukkan halaman lebih lanjut
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePostPerPage = (value) => {
    setPostPerPage(value);
    setCurrentPage(1);
  };

  const handleSelectAllChange = () => {
    setSelectAll(!selectAll);
    if (!selectAll) {
      // Select all filtered items
      setSelectedItems(currentData.map((item) => item.data_wd_id));
    } else {
      // Deselect all items
      setSelectedItems([]);
    }
  };

  useEffect(() => {
    // Update select all checkbox status based on filtered data and selected items
    if (
      filteredData.length > 0 &&
      selectedItems.length === currentData.length
    ) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [filteredData, selectedItems]);

  const handleCheckboxChange = (data_wd_id) => {
    setSelectedItems((prevSelectedItems) => {
      if (prevSelectedItems.includes(data_wd_id)) {
        // Hapus id dari selectedItems jika sudah ada
        return prevSelectedItems.filter((id) => id !== data_wd_id);
      } else {
        // Tambah id ke selectedItems jika belum ada
        return [...prevSelectedItems, data_wd_id];
      }
    });
  };

  const handleClickDetail = (id) => {
    setIdDetail(id);
    setDataDetails(true);
  };

  const cancelDataGrab = async (id) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/cancelwd/${id}`);
      if (response.data.success) {
        getDataWdHistory();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmDataGrab = async (id) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/confirmwd/${id}`);
      if (response.data.success) {
        getDataWdHistory();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  const rejectDataGrab = async (id) => {
    setLoadingAction(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const response = await Axios.put(`${apiUrl}/adminwd/rejectwd/${id}`);
      if (response.data.success) {
        getDataWdHistory();
        setSelectedItems([]);
      } else if (response.data.error) {
        alert("Error from server!");
        console.log(response.data.error);
      } else {
        console.log("Something error");
      }
      setLoadingAction(false);
    } catch (error) {
      console.log(error);
    }
  };

  const dataCanUserProcess = dataHistoryDetails.filter(
    (item) => item.admin_username === userLogin
  );

  // Mengambil semua nilai id dari data1
  const idsInDataUserCanProcess = dataCanUserProcess.map(
    (item) => item.data_wd_id
  );

  // Mengecek jika ada angka dalam selectedData yang tidak ada di data1
  const invalidIds = selectedItems.filter(
    (id) => !idsInDataUserCanProcess.includes(id)
  );

  function getToday() {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, "0");
    let mm = today.getMonth(); // getMonth() returns 0-11
    let yyyy = today.getFullYear();

    // Array nama bulan
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Mengambil nama bulan dari array
    let month = monthNames[mm];

    return dd + "-" + month + "-" + yyyy;
  }

  const today = getToday();

  function StringTruncate(string, maxLength = 15) {
    if (string.length <= maxLength) {
      return string;
    } else {
      return string.substring(0, maxLength) + "...";
    }
  }

  const formatDate = (dbTimeString) => {
    // Buat objek moment dari string waktu database dan atur ke zona waktu Jakarta
    const date = moment.tz(dbTimeString, "Asia/Jakarta");

    // Ambil tahun, bulan, dan hari di zona waktu Jakarta
    const year = date.year();
    const month = String(date.month() + 1).padStart(2, "0"); // month() dimulai dari 0
    const day = String(date.date()).padStart(2, "0");

    // Ambil jam, menit, dan detik di zona waktu Jakarta
    const hours = String(date.hour()).padStart(2, "0");
    const minutes = String(date.minute()).padStart(2, "0");
    const seconds = String(date.second()).padStart(2, "0");

    // Gabungkan menjadi format yang diinginkan
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      <div className="w-full py-2 flex flex-col gap-1 px-6">
        {loading ? (
          <div className="pt-2">
            <Loading />
          </div>
        ) : (
          <div className="relative overflow-x-auto shadow-md rounded-md">
            <div className="flex justify-between px-2 items-center">
              <span className="text-sm kanit-medium dark:text-zinc-100">
                {today}
              </span>
              <div>
                <span className="kanit-regular dark:text-zinc-100">
                  Closing Time :{" "}
                </span>
                <span className="text-sm kanit-medium underline dark:text-zinc-100">
                  {dataHistoryDetails.length < 1
                    ? "time"
                    : formatDate(dataHistoryDetails[0].closed_timestamp)}
                </span>
              </div>
            </div>
            <div className="flex flex-col md:flex-row px-2 py-1 justify-between items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="border p-1 rounded-md outline-none w-full max-w-80 min-w-52"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
              <div className="flex flex-col md:flex-row flex-wrap w-full gap-2 p-1 rounded-md border flex-1 justify-center">
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-blue-300 dark:bg-zinc-500 dark:text-zinc-50"
                  onClick={() => handleFilterByStatus("all")}
                >
                  All
                </button>
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-green-300 dark:bg-zinc-700 dark:text-zinc-50"
                  onClick={() => handleFilterByStatus("success")}
                >
                  Success
                </button>
                <button
                  className="w-20 flex justify-center items-center border p-1 rounded-md shadow-md bg-red-600 text-white dark:bg-zinc-950"
                  onClick={() => handleFilterByStatus("reject")}
                >
                  Reject
                </button>
              </div>
            </div>
            <div className="px-2 dark:text-zinc-50">
              <h1>Menampilkan Data : {statusData}</h1>
            </div>
            <table className="w-full text-left">
              <thead className="bg-zinc-200 dark:bg-zinc-600 dark:text-zinc-50">
                <tr>
                  <th scope="col" className="px-3 py-4">
                    <div className="flex items-center">
                      <input
                        id="checkbox-all-search"
                        type="checkbox"
                        className="cursor-pointer w-4 h-4"
                        checked={selectAll}
                        onChange={handleSelectAllChange}
                      />
                      <label htmlFor="checkbox-all-search" className="sr-only">
                        checkbox
                      </label>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span></span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="pl-1 pr-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("member_username")}
                  >
                    <div className="flex items-center">
                      <span>Username</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("account_name")}
                  >
                    <div className="flex items-center">
                      <span>Nama Rekening</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("bank_name")}
                  >
                    <div className="flex items-center">
                      <span>Bank Tujuan</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("nominal")}
                  >
                    <div className="flex items-center">
                      <span>Nominal</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className={`px-3 py-3 kanit-medium cursor-pointer`}
                    onClick={() => handleSort("admin_name")}
                  >
                    <div className="flex items-center">
                      <span>Admin</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                  ></th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-zinc-100 dark:hover:bg-zinc-600 dark:text-zinc-50"
                  >
                    <td className="w-4 px-3 py-2">
                      <div className="flex items-center">
                        <input
                          name={item.data_wd_id}
                          id={item.data_wd_id}
                          type="checkbox"
                          className="w-4 h-4 cursor-pointer"
                          checked={selectedItems.includes(item.data_wd_id)}
                          onChange={() => handleCheckboxChange(item.data_wd_id)}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2">
                      <div className="p-1 rounded-md bg-blue-500 hover:opacity-80 w-fit">
                        <TbListDetails
                          className="text-lg text-white cursor-pointer"
                          onClick={() => handleClickDetail(item.data_wd_id)}
                          title="Details"
                        />
                      </div>
                    </td>
                    <td className="pl-1 pr-3 py-2">{item.member_username}</td>
                    <td className="px-3 py-2">
                      {StringTruncate(item.account_name)}
                    </td>
                    <td className="px-3 py-2 flex flex-col">
                      <div>{item.bank_name}</div>
                      <div>{item.account_number}</div>
                    </td>
                    <td className="px-3 py-2 kanit-medium text-xl">
                      {rupiah.format(item.nominal)}
                    </td>
                    <td className={`px-3 py-2`}>
                      {item.admin_name === null ? "-" : item.admin_name}
                    </td>
                    <td className="px-3 py-2">
                      {loadingAction ? (
                        <BiLoaderCircle className="text-2xl animate-spin" />
                      ) : (
                        <div
                          className={`flex justify-center gap-1 ${
                            userLogin === item.admin_username ? "" : "hidden"
                          }`}
                        >
                          <button
                            className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                            title="Confirm"
                            onClick={() => {
                              const confirm = window.confirm(
                                "Withdraw sudah diproses ?"
                              );
                              if (confirm) {
                                confirmDataGrab(item.data_wd_id);
                              }
                            }}
                          >
                            <GiConfirmed className="text-zinc-100" />
                          </button>
                          <button
                            className="py-1 px-2 rounded-md bg-[#2bf83c] hover:bg-opacity-80"
                            title="Cancel"
                            onClick={() => {
                              const confirm = window.confirm(
                                "Yakin ingin cancel ?"
                              );
                              if (confirm) {
                                cancelDataGrab(item.data_wd_id);
                              }
                            }}
                          >
                            <PiHandCoinsFill className="text-zinc-900" />
                          </button>
                          <button
                            className="py-1 px-2 rounded-md bg-[#f82b2b] hover:bg-opacity-80"
                            title="Reject"
                            onClick={() => {
                              const confirm = window.confirm(
                                "Yakin ingin reject ?"
                              );
                              if (confirm) {
                                rejectDataGrab(item.data_wd_id);
                              }
                            }}
                          >
                            <GiCancel className="text-zinc-100" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex p-2 items-center justify-between pt-4"
              aria-label="Table navigation"
            >
              <span className="dark:text-zinc-50">
                Menampilkan{" "}
                <span className="">{`${firstPostIndex + 1} - ${
                  lastPostIndex <= filteredData.length
                    ? lastPostIndex
                    : filteredData.length
                }`}</span>{" "}
                dari <span className="">{filteredData.length}</span>
              </span>
              <ul className="inline-flex gap-1 -space-x-px text-sm h-8">
                <select
                  name="post-per-page"
                  id="post-per-page"
                  className="outline-none border rounded-md dark:bg-zinc-600 dark:text-zinc-50"
                  value={postPerPage}
                  onChange={(e) => handlePostPerPage(e.target.value)}
                >
                  <option value="5">5 / page</option>
                  <option value="10">10 / page</option>
                  <option value="20">20 / page</option>
                  <option value="30">30 / page</option>
                  <option value="40">40 / page</option>
                  <option value="50">50 / page</option>
                  <option value="100">100 / page</option>
                </select>
                <li>
                  <div
                    className="flex items-center justify-center px-3 h-8 ms-0 leading-tight text-gray-500 bg-white dark:bg-zinc-600 dark:text-zinc-50 border border-gray-300 rounded-s-lg cursor-pointer"
                    onClick={handlePrevPage}
                  >
                    <TbPlayerTrackPrevFilled />
                  </div>
                </li>
                {getPageNumbers().map((page, index) => (
                  <li key={index}>
                    <div
                      className={`flex items-center justify-center px-3 h-8 leading-tight cursor-pointer border border-gray-300 ${
                        page == currentPage
                          ? "bg-[#602BF8] text-white dark:bg-zinc-950"
                          : "bg-white text-gray-500"
                      }`}
                      onClick={() => {
                        if (page !== "...") setCurrentPage(page);
                      }}
                    >
                      {page}
                    </div>
                  </li>
                ))}
                <li>
                  <div
                    className="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white dark:bg-zinc-600 dark:text-zinc-50 border border-gray-300 rounded-e-lg cursor-pointer"
                    onClick={handleNextPage}
                  >
                    <TbPlayerTrackNextFilled />
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        )}
      </div>
    </>
  );
};

const DataDetails = ({
  setDataDetails,
  dataHistoryDetails,
  idDetail,
  rupiah,
  apiUrl,
}) => {
  const dataCheck = dataHistoryDetails.find(
    (item) => item.data_wd_id === idDetail
  );

  const formatDate = (dbTimeString) => {
    // Buat objek moment dari string waktu database dan atur ke zona waktu Jakarta
    const date = moment.tz(dbTimeString, "Asia/Jakarta");

    // Ambil tahun, bulan, dan hari di zona waktu Jakarta
    const year = date.year();
    const month = String(date.month() + 1).padStart(2, "0"); // month() dimulai dari 0
    const day = String(date.date()).padStart(2, "0");

    // Ambil jam, menit, dan detik di zona waktu Jakarta
    const hours = String(date.hour()).padStart(2, "0");
    const minutes = String(date.minute()).padStart(2, "0");
    const seconds = String(date.second()).padStart(2, "0");

    // Gabungkan menjadi format yang diinginkan
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <>
      {idDetail === undefined || dataCheck === undefined ? (
        ""
      ) : (
        <div className="p-3 bg-white dark:bg-zinc-900 dark:text-zinc-50 shadow-md border rounded-md flex flex-col justify-center items-center gap-1">
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Agent</div>
            <div className="flex-1 px-2 kanit-medium">
              {dataCheck.agent_name}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Operator Input</div>
            <div className="flex-1 px-2">{dataCheck.operator_name}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Username Member</div>
            <div className="flex-1 px-2">{dataCheck.member_username}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Bank/e-Wallet</div>
            <div className="flex-1 px-2">{dataCheck.bank_name}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nama Rekening</div>
            <div className="flex-1 px-2">{dataCheck.account_name}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nomor Rekening</div>
            <div className="flex-1 px-2">{dataCheck.account_number}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Nominal Withdraw</div>
            <div className="flex-1 px-2">
              {rupiah.format(dataCheck.nominal)}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Sisa Saldo</div>
            <div className="flex-1 px-2">
              {rupiah.format(dataCheck.last_balance)}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Waktu Withdraw</div>
            <div className="flex-1 px-2">{dataCheck.wd_time}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Waktu Input</div>
            <div className="flex-1 px-2">
              {formatDate(dataCheck.input_date)}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Status</div>
            <div className="flex-1 px-2">{dataCheck.status}</div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 px-2 border-r">Bukti</div>
            <div className="flex-1 px-2">
              {dataCheck.evidence ? (
                <a
                  href={`${apiUrl}/${dataCheck.evidence}`}
                  target="_blank"
                  className="underline"
                >
                  lihat
                </a>
              ) : (
                <span>Tidak Tersedia</span>
              )}
            </div>
          </div>
          <div className="min-w-96 flex px-2 border-b">
            <div className="flex-1 flex items-center px-2 border-r">Admin</div>
            <div className="flex-1 flex gap-2 items-center px-2">
              <div>
                {dataCheck.admin_name === null ? "-" : dataCheck.admin_name}
              </div>
              <div>
                {dataCheck.profile ? (
                  <a href={`${apiUrl}/${dataCheck.profile}`} target="_blank">
                    <img
                      src={`${apiUrl}/${dataCheck.profile}`}
                      alt="Profile"
                      className="w-14 h-14 rounded-full"
                    />
                  </a>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="w-full flex justify-center items-center py-2">
            <button
              className="px-2 py-1 rounded-md bg-zinc-200 dark:bg-zinc-950 dark:text-zinc-50"
              onClick={() => setDataDetails(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
