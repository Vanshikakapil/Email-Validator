import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const AdminLogin = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const togglePassword = () => setShowPassword(!showPassword);

  const validatePassword = (value) => {
    setPassword(value);
    setPasswordError(value.length >= 8 ? '' : 'Password must be at least 8 characters.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordError && email && password) {
      try {
        const res = await axios.post('http://localhost:8000/login', {
          email: email.trim(),       // 🚀 trim to avoid trailing/leading spaces
          password: password
        });

        const { role } = res.data;

        if (role === 'admin') {
          localStorage.setItem('role', role);
          alert("Login Successful");
          navigate("/admin/dashboard")
        } else {
          alert('You are not authorized as admin');
        }
      } catch (err) {
        console.error(err.response?.data || err.message);
        alert('Invalid admin credentials');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 p-6 animate-fade-in">
      <div
        className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
        data-aos="fade-up"
      >
        {/* Left Info */}
        <div
          className="md:w-1/2 p-10 bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col justify-center"
          data-aos="fade-right"
        >
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            Admin Access
          </h1>
          <p className="text-gray-200 text-lg leading-relaxed">
            Only authorized users can login and manage sensitive data securely.
          </p>
        </div>

        {/* Right Login Form */}
        <div
          className="md:w-1/2 p-10 bg-white flex flex-col justify-center"
          data-aos="fade-left"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-blue-900">Admin Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div className="group transition-all duration-300">
              <label className="text-gray-700 block mb-1 font-medium">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-5 py-3 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="admin@example.com"
              />
            </div>

            {/* Password */}
            <div className="relative group transition-all duration-300">
              <label className="text-gray-700 block mb-1 font-medium">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-5 py-3 pr-12 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-10 text-gray-500 hover:text-blue-600"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Login as Admin
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            <a href="/admin/forgot-password" className="text-blue-600 hover:underline font-medium">
              Forgot Password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
