import React from 'react';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <h1 className="text-2xl font-bold tracking-tight">
            File Uploader
          </h1>

          {/* Links */}
          <ul className="flex space-x-6">
            <li>
              <a
                href="/"
                className="hover:bg-blue-500 px-3 py-2 rounded-md transition-colors duration-200"
              >
                Home
              </a>
            </li>
            <li>
              <a
                href="/upload"
                className="hover:bg-blue-500 px-3 py-2 rounded-md transition-colors duration-200"
              >
                Upload
              </a>
            </li>
            <li>
              <a
                href="/files"
                className="hover:bg-blue-500 px-3 py-2 rounded-md transition-colors duration-200"
              >
                Files
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
