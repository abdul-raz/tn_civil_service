import React, { useEffect, useState } from "react";
import { FiUsers, FiBook, FiImage, FiBell } from "react-icons/fi";

const Dashboard = () => {
  const backendUrl = import.meta.env.VITE_REACT_APP_BACKEND_URL;

  const [counts, setCounts] = useState({
    questionBanks: { total: 0, active: 0 },
    galleries: { total: 0, active: 0 },
    results: { total: 0, active: 0 },
    notifications: { total: 0, active: 0 },
  });

  useEffect(() => {
    const fetchCount = async (url) => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        return data; // {total: x, active: y}
      } catch (error) {
        console.error(`Error fetching from ${url}`, error);
        return { total: 0, active: 0 };
      }
    };

    const loadCounts = async () => {
      const [galleries, questionBanks, results, notifications] =
        await Promise.all([
          fetchCount(`${backendUrl}/api/dashboard/gallery-count`),
          fetchCount(`${backendUrl}/api/dashboard/questionbank-count`),
          fetchCount(`${backendUrl}/api/dashboard/result-count`),
          fetchCount(`${backendUrl}/api/dashboard/notification-count`),
        ]);
        
      setCounts({
        galleries,
        questionBanks,
        results,
        notifications,
      });
    };

    loadCounts();
  }, []);

  const summaryData = [
    {
      id: 1,
      title: "Question Banks",
      count: counts.questionBanks,
      icon: <FiBook className="text-5xl primary" />,
    },
    {
      id: 2,
      title: "Galleries",
      count: counts.galleries,
      icon: <FiImage className="text-5xl primary" />,
    },
    {
      id: 4,
      title: "Notifications",
      count: counts.notifications,
      icon: <FiBell className="text-5xl primary" />,
    },
    {
      id: 3,
      title: "Results",
      count: counts.results,
      icon: <FiUsers className="text-5xl primary" />,
    },
  ];

  return (
    <section className="bg-white md:p-5 px-3 py-5 rounded-md shadow-md relative space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl text-[#002147] font-bold">Records</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {summaryData.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-2 bg-gray-300 items-center justify-center p-4 rounded-md shadow-xl primary"
          >
            <div>{item.icon}</div>
            <span className="text-lg">{item.title}</span>
            <div className="flex gap-5">
              <span className="text-md">
              Active: {item.count.active}
            </span>
            <span className="text-md">Total: {item.count.total}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
