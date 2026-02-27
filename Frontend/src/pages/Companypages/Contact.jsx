import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Contact = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="min-h-screen bg-blue-50 py-20 px-4 md:px-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-xl grid md:grid-cols-2 overflow-hidden">
        
        {/* Left Side - Info */}
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-10 md:p-12" data-aos="fade-right">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-blue-950">Contact Our Support Team</h2>
          <p className="text-gray-700 mb-6 leading-relaxed">
            We’re here to help! Let us know your query and our team will get in touch shortly.
          </p>

          <hr className="my-6 border-gray-300" />

          <div className="space-y-6 text-base">
            <div className="flex items-start gap-4">
              <span className="text-blue-600 text-2xl">📧</span>
              <div>
                <p className="font-semibold">Email</p>
                <p className="text-gray-700">support@emailvalidator.com</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-blue-600 text-2xl">📘</span>
              <div>
                <p className="font-semibold">Facebook</p>
                <p className="text-gray-700">facebook.com/EmailValidator</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <span className="text-blue-600 text-2xl">📍</span>
              <div>
                <p className="font-semibold">Address</p>
                <p className="text-gray-700">Sector 21, Noida, India - 201301</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-10 md:p-12" data-aos="fade-left">
          <h3 className="text-2xl font-semibold mb-2">Send Us A Message</h3>
          <p className="text-gray-600 mb-6 text-sm">
            Have questions or need help? Fill out the form below and we’ll be happy to assist you.
          </p>

          <form className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full rounded-full px-5 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full rounded-full px-5 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <select
                className="w-full rounded-full px-5 py-3 border border-gray-300 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option disabled selected>Choose a service</option>
                <option>Email Verification</option>
                <option>API Integration</option>
                <option>Bulk Validation</option>
                <option>Other</option>
              </select>
            </div>
            <div>
              <textarea
                rows="5"
                placeholder="Your Message"
                className="w-full rounded-2xl px-5 py-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                required
              ></textarea>
            </div>

            {/* Mocked reCAPTCHA */}
            <div className="bg-white border border-gray-300 rounded-xl px-4 py-3 flex items-center justify-between">
              <span className="text-sm">☑️ I'm not a robot</span>
              <img
                src="https://www.gstatic.com/recaptcha/api2/logo_48.png"
                alt="reCAPTCHA"
                className="h-6"
              />
            </div>
            <p className="text-xs text-gray-500 ml-1">
              reCAPTCHA · <a href="#" className="underline">Privacy</a> · <a href="#" className="underline">Terms</a>
            </p>

            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 mt-4 rounded-full font-semibold hover:bg-blue-700 transition duration-300"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
