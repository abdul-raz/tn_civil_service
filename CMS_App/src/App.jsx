import './index.css';
import LoginPage from './pages/LoginPage';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import QuestionBank from './pages/QuestionBank';
import Gallery from './pages/Gallery';
import Notification from './pages/Notification';
import Footer from './components/Footer';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import axios from "axios";

// ✅ Protected Route
const ProtectedRoute = ({ log }) => {


  if (!log) return <Navigate to="/login" replace />;
  return <Outlet />; // renders child routes
};



// ✅ Layout for all protected pages
const Layout = ({ setLog, isSideBarOpen, setIsSideBarOpen }) => {
  return (
    <div className="flex flex-1">
      <SideBar isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />
      <div className="md:pt-[2%] md:px-[3%] p-[2%] w-full flex flex-col md:ml-[18%]">
        <Header
          setIsSideBarOpen={setIsSideBarOpen}
          isSideBarOpen={isSideBarOpen}
          setLog={setLog}
        />
        <div className="flex-grow mt-3">
          <Outlet /> {/* where child page renders */}
        </div>
        <Footer />
      </div>
    </div>
  );
};

function App() {
  const baseUrl = "http://localhost:3000";
  const [log, setLog] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  axios.defaults.withCredentials = true;

// for storing question banks
const [questionBankData, setQuestionBankData] = useState([]);
// Fetch all Question Bank entries on component mount
useEffect(() => {
  fetchQuestionBanks();
}, []);
const fetchQuestionBanks = async () => {
  try {
    const response = await axios.get(`${baseUrl}/api/questionBank`, {
      withCredentials: true, // same as fetch's credentials: 'include'
    });

    setQuestionBankData(response.data); // axios auto-parses JSON
  } catch (error) {
    if (error.response) {
      // Server responded with error
      alert(error.response.data.message || 'Failed to fetch question bank data.');
    } else {
      // Network or other error
      alert('Network error while fetching question bank data.');
    }
  }
};
  const [galleryData, setGalleryData] = useState([]);
  // Fetch gallery data
  const fetchGalleryData = async () => {
    try {
      const res = await axios.get(`${baseUrl}/api/gallery`, { withCredentials: true });
      setGalleryData(res.data);
    } catch (error) {
      console.error("Error fetching gallery data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/auth/me`);
        if (res.data) setLog(true);
      } catch {
        setLog(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <main className="bg-[#f0eff5] min-h-screen flex flex-col">
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={log ? <Navigate to="/" replace /> : <LoginPage setLog={setLog} />}
          />

          {/* Protected Routes with Layout */}
          <Route element={<ProtectedRoute log={log} />}>
            <Route element={<Layout setLog={setLog} isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />}>
              <Route path="/" element={<Dashboard galleryData={galleryData} questionBankData={questionBankData}/>} />
              <Route path="/questionbank" element={<QuestionBank fetchQuestionBanks={fetchQuestionBanks} setQuestionBankData={setQuestionBankData} questionBankData={questionBankData} />} />
              <Route path="/gallery" element={<Gallery fetchGalleryData={fetchGalleryData} galleryData={galleryData}/>} />
              <Route path="/notification" element={<Notification />} />
            </Route>
          </Route>
          {/* Fallback */}
          <Route path="*" element={<Navigate to={log ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
