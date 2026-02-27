import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash, FaTimesCircle, FaCheckCircle, FaExclamationTriangle } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [alert, setAlert] = useState({ msg: "", isError: false, visible: false });

  useEffect(() => {
    AOS.init({ duration: 800 });
  }, []);

  useEffect(() => {
    if (alert.visible) {
      const timer = setTimeout(() => setAlert({ ...alert, visible: false }), 5000);
      return () => clearTimeout(timer);
    }
  }, [alert]);

  const togglePassword = () => setShowPassword((prev) => !prev);

  const validatePassword = (val) => {
    setPassword(val);
    const valid = /^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(val);
    setPasswordError(
      valid ? "" : "Minimum 8 chars, 1 uppercase, 1 number, 1 special character"
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password || passwordError) return;

    try {
      const res = await axios.post("http://localhost:8000/signup", {
        name,
        email,
        password,
        role: "user",
      });
      setAlert({ msg: res.data.message || "Signup successful!", isError: false, visible: true });
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      const message = err.response?.data?.detail || "Server error. Please try again.";
      setAlert({ msg: message, isError: true, visible: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-200 px-4 py-10 relative">
      {/* Toast Alert */}
      {alert.visible && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg border transition-all duration-500 ${
            alert.isError
              ? "bg-red-100 text-red-700 border-red-300"
              : "bg-green-100 text-green-700 border-green-300"
          }`}
          data-aos="fade-down"
        >
          {alert.isError ? (
            <FaExclamationTriangle className="text-xl" />
          ) : (
            <FaCheckCircle className="text-xl" />
          )}
          <span className="font-medium">{alert.msg}</span>
          <button
            className="ml-2 text-xl hover:text-black transition"
            onClick={() => setAlert({ ...alert, visible: false })}
          >
            <FaTimesCircle />
          </button>
        </div>
      )}

      {/* Signup Box */}
      <div
        className="flex flex-col md:flex-row w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl bg-white bg-opacity-95 backdrop-blur-lg border border-blue-200"
        data-aos="zoom-in"
      >
        {/* Left Panel */}
        <div className="md:w-1/2 p-10 bg-gradient-to-br from-blue-700 to-blue-900 text-white flex flex-col justify-center">
          <h1 className="text-4xl font-bold mb-6 leading-tight">Join Our Community</h1>
          <p className="text-lg mb-4 text-gray-200">
            Create your account and get verified by our admin to unlock premium features.
          </p>
          <p className="text-sm italic text-blue-100">Verification is quick and secure.</p>
        </div>

        {/* Form Panel */}
        <div className="md:w-1/2 p-12">
          <h2 className="text-3xl font-semibold text-blue-900 text-center mb-8">Create an Account</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            <div className="relative">
              <label className="block mb-1 text-sm font-medium text-gray-700">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => validatePassword(e.target.value)}
                required
                className="w-full px-5 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
              <button
                type="button"
                className="absolute top-10 right-4 text-gray-600"
                onClick={togglePassword}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {passwordError && (
                <p className="text-red-600 text-sm mt-1">{passwordError}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-lg transition duration-300 shadow hover:shadow-lg"
              disabled={!!passwordError}
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline font-medium">
              Login here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
