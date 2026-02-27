import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const DetailsSection = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const steps = [
    {
      title: "Step 1: Upload CSV",
      desc: "Easily drag and drop or browse to upload your email list in CSV format.",
    },
    {
      title: "Step 2: Intelligent Scanning",
      desc: "We automatically scan for syntax errors, invalid domains, disposable emails, and spam traps.",
    },
    {
      title: "Step 3: Real-Time Validation",
      desc: "Our system connects with mail servers (MX) to verify inbox availability in real-time.",
    },
    {
      title: "Step 4: Clean CSV Output",
      desc: "You’ll get a downloadable CSV with only valid, safe-to-send emails — ready for campaigns.",
    },
  ];

  const benefits = [
    "Boost email deliverability and open rates effortlessly.",
    "Protect your sender reputation and avoid blacklists.",
  ];

  return (
    <div id="details" className="bg-[#f9fafb] text-gray-900 py-24 px-6 relative overflow-hidden">
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-bold mb-16 tracking-tight"
          data-aos="fade-up"
        >
          How It Works
        </h2>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 text-left">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-1 border border-gray-100"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="text-blue-600 font-semibold text-sm mb-2">STEP {index + 1}</div>
              <h3 className="text-xl font-bold mb-2 text-[#0a192f]">{step.title}</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        {/* Benefits */}
        <div
          className="bg-gradient-to-r from-[#0a192f]/90 to-[#1f2e45]/90 text-white p-10 rounded-3xl shadow-2xl md:flex md:items-center md:justify-around gap-10 space-y-6 md:space-y-0"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          {benefits.map((benefit, index) => (
            <div key={index} className="flex items-start gap-4">
              <CheckCircle className="text-green-400 w-6 h-6 mt-1 drop-shadow" />
              <p className="text-base leading-relaxed">{benefit}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DetailsSection;
