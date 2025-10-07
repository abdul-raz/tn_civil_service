import './index.css';
import LoginPage from './pages/LoginPage';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import QuestionBank from './pages/QuestionBank';
import Gallery from './pages/Gallery';
import Notification from './pages/Notification';
import Result from './pages/Result';
import Footer from './components/Footer';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import axios from "axios";

// ✅ Protected Route
const ProtectedRoute = ({ log }) => {
  if (!log) return <Navigate to="/login" replace />;
  return <Outlet />; 
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
  const baseUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL ;
  const [log, setLog] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${baseUrl}/api/auth/me`);
        if (res.data) setLog(true);
        else setLog(false);
      } catch {
        setLog(false);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router basename="/cms">
      <main className="bg-[#f0eff5] min-h-screen flex flex-col">
        <Routes>
          {/* Login */}
          <Route
            path="/login"
            element={log ? <Navigate to="/" replace /> : <LoginPage setLog={setLog} />}
          />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute log={log} />}>
            <Route element={<Layout setLog={setLog} isSideBarOpen={isSideBarOpen} setIsSideBarOpen={setIsSideBarOpen} />}>
              <Route path="/" element={<Dashboard/>} />
              <Route path="/questionbank" element={<QuestionBank/>} />
              <Route path="/gallery" element={<Gallery/>} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/results" element={<Result />} />
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
