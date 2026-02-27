import React from 'react'

const Footer = () => {
  return (
    <>
        
      {/* Footer */}
      <footer className="bg-[#0a192f] text-white px-6 py-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + About */}
          <div>
            <h3 className="text-2xl font-bold mb-2">Email Validator</h3>
            <p className="text-gray-300 text-sm mb-4">
              We offer advanced email verification and professional tools to support your marketing success.
            </p>
            <p className="text-sm text-gray-400">Operating from: New Delhi, India</p>
            <div className="flex gap-4 mt-4">
              <a href="#"><i className="fab fa-facebook text-white text-xl"></i></a>
              <a href="#"><i className="fab fa-twitter text-white text-xl"></i></a>
              <a href="#"><i className="fab fa-youtube text-white text-xl"></i></a>
              <a href="#"><i className="fab fa-linkedin text-white text-xl"></i></a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Top Services</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>Email Validation</li>
              <li>Bulk Email Upload</li>
              <li>Real-time API</li>
              <li>SMTP Verification</li>
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/contact">Contact Us</a></li>
            </ul>
          </div>

          {/* Payments */}
          <div>
            <h4 className="text-lg font-semibold mb-2">Secure Payments</h4>
            <p className="text-sm text-gray-300 mb-2">
              All payments are securely processed through our partners.
            </p>
            <div className="text-2xl flex gap-3">
              💳 🟣 🟠 💰 🪙 🅿️
            </div>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center text-gray-500 text-sm mt-10 border-t border-gray-700 pt-6">
          &copy; {new Date().getFullYear()} Email Validator. All rights reserved.
        </div>
      </footer>
      
    </>
  )
}

export default Footer
