import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Account from "./components/Account";
import Login from "./components/Login";
import DataProcess from "./components/DataProcess";
import History from "./components/History";

function App() {
  return (
    <>
      <div className="w-full min-h-screen p-5 flex justify-center items-center bg-[#DBE8F4]">
        <Router>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/data-process" element={<DataProcess />} />
            <Route path="/history" element={<History />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </Router>
      </div>
    </>
  );
}

export default App;
