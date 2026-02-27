import { Link } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isCompanyOpen, setIsCompanyOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const dropdownVariants = {
    hidden: { opacity: 0, y: -15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <header className="bg-white/90 backdrop-blur-md shadow-md sticky top-0 z-50">
      <nav className="max-w-screen-xl mx-auto px-8 py-4 flex justify-between items-center text-gray-900">
        {/* Logo */}
        <Link
          to="/"
          className="text-3xl md:text-4xl font-extrabold tracking-wide hover:text-blue-600 transition duration-300"
        >
          Email Validator
        </Link>

        {/* Menu */}
        <div className="flex items-center space-x-4 text-base font-medium">
          {/* Home */}
          <Link
            to="/"
            className="px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-300"
          >
            Home
          </Link>

          {/* Pricing (after Home, before Company) */}
          <Link
            to="/pricing"
            className="px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-300"
          >
            Pricing
          </Link>

          {/* Company Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsCompanyOpen(true)}
            onMouseLeave={() => setIsCompanyOpen(false)}
          >
            <button className="px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-300">
              Company ▾
            </button>
            <AnimatePresence>
              {isCompanyOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute top-12 left-0 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-30"
                >
                  {['About Us','Why Us','Contact','Security','Updates','Reviews'].map((item, idx) => (
                    <Link
                      key={idx}
                      to={`/${item.replace(/\s+/g,'')}`}
                      className="block px-4 py-2 hover:bg-blue-50 transition duration-200"
                    >
                      {item}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Login Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setIsLoginOpen(true)}
            onMouseLeave={() => setIsLoginOpen(false)}
          >
            <button className="px-4 py-2 rounded-lg hover:bg-blue-100 transition duration-300">
              Login ▾
            </button>
            <AnimatePresence>
              {isLoginOpen && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={dropdownVariants}
                  className="absolute top-12 left-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-30"
                >
                  <Link
                    to="/login"
                    className="block px-4 py-2 hover:bg-blue-50 transition duration-200"
                  >
                    Email Verifier Dashboard
                  </Link>
                  <Link
                    to="/subscriber/login"
                    className="block px-4 py-2 hover:bg-blue-50 transition duration-200"
                  >
                    Subscriptions (PayPro)
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Buttons */}
          <Link
            to="/signup"
            className="px-4 py-2 text-blue-700 font-semibold border border-blue-300 hover:bg-blue-50 rounded-3xl transition duration-300 hover:scale-105"
          >
            Free Signup
          </Link>

          <Link
            to="/admin/login"
            className="px-4 py-2 text-gray-700 font-semibold border border-gray-300 hover:bg-gray-100 rounded-3xl transition duration-300 hover:scale-105"
          >
            Admin Login
          </Link>

          <Link
            to="/subscriber/subscribe"
            className="px-5 py-2 bg-green-500 text-white font-bold rounded-3xl shadow-lg hover:shadow-xl transition duration-300 hover:scale-110"
          >
            Subscribe
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;