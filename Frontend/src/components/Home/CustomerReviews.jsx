import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const CustomerReviews = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const reviews = [
    {
      name: 'Aditi Mehra',
      text: '“Super fast and accurate! Helped clean our email list before our campaign.”',
      img: 'https://i.pravatar.cc/150?img=3',
    },
    {
      name: 'Kunal Sharma',
      text: '“Very intuitive dashboard and easy CSV upload. Love the UI!”',
      img: 'https://i.pravatar.cc/150?img=5',
    },
    {
      name: 'Priya D.',
      text: '“We avoided 30% bounce rate thanks to this tool. Must-have for marketers.”',
      img: 'https://i.pravatar.cc/150?img=8',
    },
  ];

  return (
    <div id="reviews" className="bg-[#f9fafb] text-gray-800 py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2
          className="text-4xl md:text-5xl font-bold mb-16 tracking-tight"
          data-aos="fade-up"
        >
          What Our Users Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-3xl shadow-lg border border-gray-100 transition-transform transform hover:-translate-y-2 hover:shadow-xl duration-300"
              data-aos="zoom-in"
              data-aos-delay={i * 150}
            >
              <div className="flex justify-center mb-4">
                <img
                  src={review.img}
                  alt={review.name}
                  className="w-16 h-16 rounded-full border-4 border-white shadow-lg ring-2 ring-blue-500"
                />
              </div>
              <p className="italic text-gray-700 text-sm mb-4 leading-relaxed">"{review.text}"</p>
              <h4 className="text-sm font-semibold text-blue-600">{review.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerReviews;
