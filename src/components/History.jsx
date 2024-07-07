import { useEffect, useState } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import { Sidebar } from "./Sidebar";
import Loading from "./Loading";
import moment from 'moment-timezone';

import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { TbListDetails } from "react-icons/tb";
import { FaSort } from "react-icons/fa6";

export default function History() {
  const apiUrl = import.meta.env.VITE_API_URL;
  const userLogin = localStorage.getItem("userOperator");
  const token = localStorage.getItem("tokenOperator");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fullname, setFullname] = useState("");
  const [dataHistory, setDataHistory] = useState([]);
  const [agentName, setAgentName] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    if (!userLogin || !token) {
      navigate("/login");
    }
  }, []);

  const getOperatorData = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 200));
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

  const getDataHistory = async () => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      const response = await Axios.get(`${apiUrl}/adminwd/history`);
      if (response.data.success) {
        setDataHistory(response.data.result);
      } else if (response.data.error) {
        console.log(response.data.error);
      } else {
        console.log("Failed to get history data");
      }

      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getOperatorData();
    getDataHistory();
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
      <div className="relative bg-white dark:bg-zinc-700 w-full max-w-[863px] lg:w-3/4 min-h-96 rounded-[18px] flex flex-col gap-6 p-8 pb-14">
        <Header
          fullname={fullname}
          agentName={agentName}
          profilePic={profilePic}
        />
        <Sidebar />
        <div>
          <Data loading={loading} dataHistory={dataHistory} />
        </div>
      </div>
    </>
  );
}

const Data = ({ loading, dataHistory }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [postPerPage, setPostPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });

  console.log(dataHistory);

  const filteredData = dataHistory.filter((item) => {
    const searchTermLower = searchTerm.toLowerCase();

    const fieldsToFilter = [item.closed_timestamp];

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

  const totalPages = Math.ceil(dataHistory.length / postPerPage);

  const [maxPagesToShow] = useState(4);

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

  // Fungsi untuk memformat tanggal dengan zona waktu Jakarta
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
          <div className="relative overflow-x-auto shadow-md rounded-md w-3/4 mx-auto">
            <div className="flex-1 flex justify-start px-2 items-center">
              <span className="text-sm kanit-medium dark:text-zinc-200">
                {today}
              </span>
            </div>
            <div className="flex flex-col md:flex-row px-2 py-1 justify-between items-center gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Cari Tanggal..."
                  className="border p-1 rounded-md outline-none w-full max-w-80 min-w-52 dark:bg-zinc-600"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                  }}
                />
              </div>
            </div>
            <table className="w-full text-left">
              <thead className="bg-zinc-200 dark:bg-zinc-600 dark:text-zinc-50">
                <tr>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                  >
                    <div className="flex items-center">
                      <span>No.</span>
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("closed_timestamp")}
                  >
                    <div className="flex items-center">
                      <span>Time</span> <FaSort />
                    </div>
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3 kanit-medium cursor-pointer"
                    onClick={() => handleSort("admin_closed")}
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
                    <td className="px-3 py-3">{index + 1}</td>
                    <td className="px-3 py-3">
                      {formatDate(item.closed_timestamp)}
                    </td>
                    <td className="px-3 py-3">{item.admin_closed}</td>
                    <td className="px-3 py-3">
                      <div className={`flex justify-center gap-1`}>
                        <a
                          href={`/history/${item.closed_id}`}
                          className="py-1 px-2 rounded-md bg-[#602BF8] hover:bg-opacity-80"
                          title="Details"
                        >
                          <TbListDetails className="text-zinc-100" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <nav
              className="flex p-2 items-center justify-between pt-4"
              aria-label="Table navigation"
            >
              <span className="dark:text-zinc-100">
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
