import React from 'react';
import { FiUsers, FiBook, FiImage, FiBell } from 'react-icons/fi';

const Dashboard = () => {
  const summaryData = [
    { id: 1, title: 'Question Banks', count: 56, icon: <FiBook className='text-5xl primary' /> },
    { id: 2, title: 'Galleries', count: 18, icon: <FiImage className='text-5xl primary' /> },
    { id: 3, title: 'Notifications', count: 23, icon: <FiBell className='text-5xl primary' /> },
    
  ];

  return (
    <section className='bg-white  md:p-5 px-3 py-5 rounded-md shadow-md relative space-y-6'>
      <div className='flex justify-between items-center'>
        <h1 className='text-xl text-[#002147] font-bold'>Records</h1>
      </div>

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
        {summaryData.map((item) => (
          <div key={item.id} className={`flex flex-col gap-2 bg-gray-300 items-center justify-center p-4 rounded-md shadow-xl primary`}>
            <div>{item.icon}</div>
            <span className='text-lg'>{item.title}</span>
            <span className='text-2xl font-bold'>{item.count}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Dashboard;
