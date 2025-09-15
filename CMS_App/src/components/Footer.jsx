import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white md:px-5 px-3 mt-3 py-4 rounded-t-md shadow-md text-center text-sm text-gray-700">
      © {currentYear}, by Anna Institute of Management
    </footer>
  )
}

export default Footer;
