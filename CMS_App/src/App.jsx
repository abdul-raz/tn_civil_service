import './index.css';
import LoginPage from './pages/LoginPage';
import SideBar from './components/SideBar';
import Dashboard from './pages/Dashboard';
import Header from './components/Header';
import QuestionBank from './pages/QuestionBank';
import Gallery from './pages/Gallery';
import AnswerKey from './pages/AnswerKey';
import WithExplanation from './pages/WithExplanation';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notification from './pages/Notification';
import { useState, useEffect } from 'react';
import Footer from './components/Footer';
import axios from "axios";

function App() {
  const [log, setLog] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/auth/me");
        if (res.data) {
          setLog(true); // user is authenticated
        }
      } catch (err) {
        console.error("Auth check failed:", err.response?.data || err.message);
        setLog(false); // not logged in
      }
    };
    checkAuth();
  }, []);

  return (
    <Router>
      <main className="bg-[#f0eff5] min-h-screen flex flex-col">
        {!log ? (
          <LoginPage setLog={setLog} />
        ) : (
          <div className="flex flex-1">
            <SideBar
              isSideBarOpen={isSideBarOpen}
              setIsSideBarOpen={setIsSideBarOpen}
            />
            <div className="md:pt-[2%] md:px-[3%] p-[2%] w-full flex flex-col md:ml-[18%]">
              <Header
                setIsSideBarOpen={setIsSideBarOpen}
                isSideBarOpen={isSideBarOpen}
                setLog={setLog}
              />

              <div className="flex-grow mt-3">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/questionbank" element={<QuestionBank />} />
                  <Route path="/answerkey" element={<AnswerKey />} />
                  <Route path="/withexplanation" element={<WithExplanation />} />
                  <Route path="/gallery" element={<Gallery />} />
                  <Route path="/notification" element={<Notification />} />
                </Routes>
              </div>
              <Footer />
            </div>
          </div>
        )}
      </main>
    </Router>
  );
}

export default App;
