import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaShieldAlt, FaRocket, FaLock } from 'react-icons/fa';

const AboutUs = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-white text-blue-950 overflow-hidden">
      {/* Hero Section */}
      <section className="relative py-24 px-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div data-aos="fade-right">
            <h1 className="text-5xl font-extrabold mb-4 leading-tight">
              Fast. Reliable. Secure.
            </h1>
            <p className="text-lg mb-6">
              Email Validator helps businesses ensure that every email they send lands in a real inbox. With advanced validation technology, we reduce bounce rates and protect your sender reputation.
            </p>
            <Link
              to="/signup"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Get Started Free
            </Link>
          </div>

          <div data-aos="fade-left" className="relative">
            <img
              src="/images/about.png.jpg"
              alt="About Us"
              className="rounded-3xl shadow-2xl transform hover:scale-105 transition w-full max-w-md h-[260px] object-cover"
            />
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-200 rounded-full blur-xl opacity-40"></div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12" data-aos="fade-up">Why Choose Email Validator?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Enterprise-Grade Security",
                icon: <FaShieldAlt size={32} className="text-blue-600" />,
                desc: "Data is encrypted. Emails never stored. Your privacy is our priority."
              },
              {
                title: "Ultra Fast Verification",
                icon: <FaRocket size={32} className="text-blue-600" />,
                desc: "Our engine validates thousands of emails in seconds, saving your time."
              },
              {
                title: "Reliable Infrastructure",
                icon: <FaLock size={32} className="text-blue-600" />,
                desc: "Always up. Always accurate. Our cloud services are 99.99% available."
              }
            ].map((item, index) => (
              <div key={index} className="bg-blue-50 p-6 rounded-xl shadow hover:shadow-lg transition" data-aos="zoom-in" data-aos-delay={index * 100}>
                <div className="mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 via-white to-blue-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div data-aos="fade-right">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-lg">
              We are committed to improving email communication by filtering fake, disposable, and undeliverable addresses before they pollute your systems. Boosting your sender score and marketing ROI.
            </p>
          </div>
          <img
            src="/images/mission.jpg"
            alt="Our Mission"
            className="rounded-2xl shadow-lg w-full max-w-md h-[230px] object-cover"
            data-aos="fade-left"
          />
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative bg-blue-600 text-white text-center py-24 px-6 overflow-hidden z-10">
        <h2 className="text-4xl font-bold mb-4">Start Validating Emails Now</h2>
        <p className="text-lg mb-8">Join thousands of enterprises keeping their inbox reputation intact.</p>
        <Link
          to="/signup"
          className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-100 transition"
        >
          Try for Free
        </Link>

        {/* Optional Decorative Wave */}
        {/* You can keep this or remove if needed */}
      </section>
    </div>
  );
};

export default AboutUs;
