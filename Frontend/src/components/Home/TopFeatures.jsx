import React, { useEffect } from 'react';
import { ShieldCheck, UploadCloud, Zap } from 'lucide-react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const TopFeatures = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const features = [
    {
      title: 'Accurate Validation',
      desc: 'Detect invalid, fake, and risky emails with powerful detection algorithms.',
      icon: <ShieldCheck className="w-6 h-6 text-white" />,
      bg: 'bg-blue-600',
      shadow: 'shadow-blue-200'
    },
    {
      title: 'CSV Upload Support',
      desc: 'Easily upload thousands of emails via drag-and-drop CSV support.',
      icon: <UploadCloud className="w-6 h-6 text-white" />,
      bg: 'bg-green-500',
      shadow: 'shadow-green-200'
    },
    {
      title: 'Real-Time Results',
      desc: 'Get fast, reliable results powered by intelligent server-side validation.',
      icon: <Zap className="w-6 h-6 text-white" />,
      bg: 'bg-purple-600',
      shadow: 'shadow-purple-200'
    },
  ];

  return (
    <div id="features" className="bg-[#f9fafb] text-gray-900 py-24 px-6 relative overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute top-[-80px] left-[-80px] w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-30 z-0"></div>
      <div className="absolute bottom-[-80px] right-[-80px] w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-30 z-0"></div>

      <div className="relative max-w-6xl mx-auto text-center z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-16" data-aos="fade-up">
          Why People Trust Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`bg-white border border-gray-200 p-8 rounded-3xl shadow-md hover:shadow-xl transition duration-300 transform hover:-translate-y-2`}
              data-aos="zoom-in"
              data-aos-delay={index * 150}
            >
              <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-5 ${feature.bg} ${feature.shadow}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-700 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TopFeatures;
