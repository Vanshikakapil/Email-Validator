import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

const HeroSection = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200 });
  }, []);

  const handleTryNow = (e) => {
    e.preventDefault();
    navigate('/signup');
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#0a192f] to-[#1e2a47] text-white pt-[120px] pb-36 px-6 md:px-10 z-0">

      {/* Glowing Background Blobs */}
      <div className="absolute top-[-8rem] left-[-8rem] w-[400px] h-[400px] bg-blue-700 opacity-30 blur-3xl rounded-full animate-pulse -z-10"></div>
      <div className="absolute bottom-[-6rem] right-[-6rem] w-[500px] h-[500px] bg-purple-600 opacity-20 blur-2xl rounded-full animate-ping -z-10"></div>

      {/* Decorative SVG Waves */}
      <svg className="absolute top-0 left-0 w-full opacity-5 -z-10" viewBox="0 0 1440 320">
        <path
          fill="#ffffff"
          d="M0,64L60,74.7C120,85,240,107,360,106.7C480,107,600,85,720,101.3C840,117,960,171,1080,176C1200,181,1320,139,1380,117.3L1440,96L1440,0L1380,0C1320,0,1200,0,1080,0C960,0,840,0,720,0C600,0,480,0,360,0C240,0,120,0,60,0L0,0Z"
        ></path>
      </svg>

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1
          className="text-5xl font-extrabold leading-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500"
          data-aos="fade-down"
        >
          Validate Emails with Precision
        </h1>

        <p
          className="text-lg text-gray-300 mb-10 max-w-2xl mx-auto"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Upload your CSV files and clean your email lists instantly. Improve deliverability. Protect your sender reputation.
        </p>

        {/* Your Original Form (unchanged button) */}
        <form
          onSubmit={handleTryNow}
          className="flex flex-col md:flex-row justify-center items-center max-w-md mx-auto"
          data-aos="zoom-in"
          data-aos-delay="400"
        >
          <div className="flex w-full overflow-hidden rounded-full shadow-lg bg-white transition hover:scale-105">
            <input
              type="text"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow px-5 py-3 text-gray-900 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 text-white font-medium transition"
            >
              Try Now
            </button>
          </div>
        </form>
      </div>

      {/* Bottom Glass Strip */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-white/5 backdrop-blur-sm border-t border-white/10 z-0 pointer-events-none"></div>
    </div>
  );
};

export default HeroSection;
