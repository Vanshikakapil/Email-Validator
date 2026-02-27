import { useState, useEffect } from 'react';
import { FaEye, FaEyeSlash, FaLock, FaCheckCircle } from 'react-icons/fa';
import AOS from 'aos';
import axios from 'axios';
import 'aos/dist/aos.css';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const togglePassword = () => setShowPassword(!showPassword);

  const validatePassword = (value) => {
    setPassword(value);
    const isValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(value);
    setPasswordError(
      isValid
        ? ''
        : 'Password must be at least 8 characters, include a capital letter, number, and special character'
    );
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

 const handleSubmit = async (e) => {
  e.preventDefault();
  if (passwordError) return;

  try {
    const response = await axios.post("http://localhost:8000/login", {
      email,
      password,
    });

    // Save all useful data in localStorage
    const token  = response.data.token;
   localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({
      id: response.data.id,
      role: response.data.role
    }));

    // Redirect to user dashboard
    navigate("/dashboard");

  } catch (error) {
    console.error("Login error:", error);
    setErrorMessage("Invalid email or password.");
  }
};


  return (
    <div className="relative min-h-screen bg-gradient-to-tr from-blue-100 to-white flex items-center justify-center px-4 py-12 font-inter overflow-hidden">

      {/* Blob Backgrounds */}
      <div className="absolute top-[-80px] left-[-100px] w-[300px] h-[300px] bg-blue-400 opacity-20 rounded-full animate-pulse blur-3xl z-0" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] bg-purple-400 opacity-20 rounded-full animate-pulse blur-3xl z-0" />
      <FaLock className="absolute top-20 left-10 text-blue-400 text-3xl animate-bounce-slow z-0" />
      <FaCheckCircle className="absolute bottom-20 right-10 text-green-400 text-3xl animate-spin-slow z-0" />

      {/* Card */}
      <div
        className="relative z-0 flex flex-col md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.1)] border border-blue-200 bg-white/70 backdrop-blur-md transition-all duration-500 hover:scale-[1.015] hover:shadow-blue-200 group"
        data-aos="zoom-in"
      >
        {/* Left */}
        <div className="md:w-1/2 p-10 text-white bg-gradient-to-br from-blue-800 to-blue-600 flex flex-col justify-center" data-aos="fade-right">
          <h1 className="text-5xl font-black leading-tight mb-6 drop-shadow-md">Secure Email<br /> Validation</h1>
          <p className="text-xl text-blue-100 tracking-wide">
            Upload lists, verify in bulk, and keep your emails bounce-free with secure technology.
          </p>
        </div>

        {/* Right */}
        <div className="md:w-1/2 bg-white p-12 flex flex-col justify-center" data-aos="fade-left">
          <h2 className="text-4xl font-extrabold mb-8 text-center text-[#0a192f]">Welcome Back</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email */}
            <div className="group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-5 py-3 rounded-xl border border-gray-300 bg-white text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300 hover:border-blue-400"
              />
            </div>

            {/* Password */}
            <div className="relative group">
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                className="w-full px-5 py-3 pr-12 rounded-xl border border-gray-300 bg-white text-base text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all duration-300 hover:border-blue-400"
              />
              <button
                type="button"
                onClick={togglePassword}
                className="absolute right-4 top-10 text-gray-500 hover:text-blue-600 transition"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            {errorMessage && (
              <p className="text-red-600 text-center text-sm">{errorMessage}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={!!passwordError}
              className="relative w-full py-3 rounded-xl text-white font-semibold text-lg bg-gradient-to-br from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 transition-all duration-300 hover:shadow-xl"
            >
              <span className="z-10 relative">Login</span>
              <span className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-20 transition duration-300" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/signup" className="text-blue-600 hover:underline font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
