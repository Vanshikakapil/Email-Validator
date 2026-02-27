import React from 'react';
import Slider from 'react-slick';
import { FaQuoteLeft, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const reviews = [
  {
    name: 'Jane Doe',
    company: 'TechStart',
    text: 'Email Validator saved us tons of time. The accuracy is impressive and easy to integrate!',
    rating: 5,
    img: 'https://i.pravatar.cc/150?img=12'
  },
  {
    name: 'John Smith',
    company: 'MarketPro',
    text: 'Fast, reliable, and great customer support. Highly recommend for any email campaigns.',
    rating: 4,
    img: 'https://i.pravatar.cc/150?img=7'
  },
  {
    name: 'Emily Johnson',
    company: 'GrowthHub',
    text: 'The dashboard is clean and intuitive. We saw a 30% reduction in bounce rates after switching.',
    rating: 4.5,
    img: 'https://i.pravatar.cc/150?img=9'
  },
  {
    name: 'Arjun Mehta',
    company: 'ListBoost',
    text: 'Their bulk validation saved our team a week’s work. Love the speed and simplicity!',
    rating: 5,
    img: 'https://i.pravatar.cc/150?img=33'
  
  },
  {
    name: 'Fatima R.',
    company: 'EmailNinja',
    text: 'Our delivery rates improved drastically. This tool is a must-have for all marketers.',
    rating: 4,
    img: 'https://i.pravatar.cc/150?img=21'
  }
];

const sliderSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  pauseOnHover: true,
  responsive: [
    { breakpoint: 1024, settings: { slidesToShow: 2 } },
    { breakpoint: 768, settings: { slidesToShow: 1 } }
  ]
};

const getStarIcons = (rating) => {
  const stars = [];
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  for (let i = 0; i < full; i++) stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" />);
  if (half) stars.push(<FaStarHalfAlt key="half" className="text-yellow-400" />);
  for (let i = 0; i < empty; i++) stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-400" />);
  return stars;
};

const Reviews = () => (
  <div className="bg-white dark:bg-gray-900 text-blue-950 dark:text-white relative overflow-hidden">
    
    {/* Top Wave */}
    <div className="absolute top-0 left-0 w-full z-0">
      <svg viewBox="0 0 1440 150" className="w-full h-auto">
        <path
          fill="#0f172a"
          d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160V0H0Z"
          fillOpacity="1"
        />
      </svg>
    </div>

    {/* Section Header */}
    <section className="relative z-0 text-center py-20 px-4 bg-gradient-to-b from-blue-50 dark:from-gray-800 to-white dark:to-gray-900">
      <h2 className="text-4xl font-extrabold mb-4">Customer Reviews</h2>
      <p className="text-lg text-gray-700 dark:text-gray-300">
        Here's what our clients say about Email Validator.
      </p>
    </section>

    {/* Slider */}
    <section className="relative z-10 max-w-7xl mx-auto px-6 py-12 min-h-[380px]">
      <Slider {...sliderSettings}>
        {reviews.map((review, index) => (
          <div key={index} className="px-4">
            <div className="bg-blue-50 dark:bg-gray-800 rounded-3xl p-8 h-full shadow-lg hover:shadow-2xl transition duration-500 transform hover:-translate-y-1 hover:scale-[1.02]">
              <div className="flex items-center gap-4 mb-4">
                <img src={review.img} alt={review.name} className="w-12 h-12 rounded-full shadow-md border-2 border-white" />
                <div>
                  <p className="font-bold text-lg">{review.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{review.company}</p>
                </div>
              </div>
              <FaQuoteLeft className="text-xl text-blue-600 dark:text-cyan-400 mb-3" />
              <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200 mb-4">"{review.text}"</p>
              <div className="flex gap-1">{getStarIcons(review.rating)}</div>
            </div>
          </div>
        ))}
      </Slider>
    </section>

    {/* CTA Section */}
    <section className="relative z-10 bg-blue-600 py-20 px-6 text-center text-white overflow-hidden">
      <h2 className="text-4xl font-bold mb-4">Join 50,000+ Happy Customers</h2>
      <p className="text-lg mb-6">Experience trusted, secure, and accurate email verification — just like they did.</p>
      <Link
        to="/signup"
        className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-100 transition duration-300"
      >
        Start for Free
      </Link>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 150" className="w-full h-auto">
          <path
            fill="#0f172a"
            d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160V320H0Z"
            fillOpacity="1"
          />
        </svg>
      </div>
    </section>
  </div>
);

export default Reviews;
