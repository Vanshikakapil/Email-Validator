import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaRocket, FaUserCheck, FaLock } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

const faqs = [
  {
    question: "Is Email Validator free to use?",
    answer: "Yes! We offer a free plan with limited validations to get you started. Upgrade anytime for more features."
  },
  {
    question: "How accurate is the email validation?",
    answer: "Our system uses SMTP, DNS, and pattern recognition to provide up to 98% accuracy in real-time."
  },
  {
    question: "Is my data secure?",
    answer: "Absolutely. We follow GDPR compliance and never store or share your email data."
  },
  {
    question: "Can I upload email lists in bulk?",
    answer: "Yes, you can upload CSV files through the dashboard and validate thousands of emails instantly."
  },
  {
    question: "Do you support real-time API verification?",
    answer: "Yes, we offer a robust API you can integrate into your sign-up forms and CRMs."
  }
];

const WhyUs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(index === openIndex ? null : index);
  };

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="text-blue-950 bg-white overflow-hidden">
      
      {/* Intro Section */}
      <section className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div data-aos="fade-right">
          <h2 className="text-4xl font-extrabold mb-4">Why Choose Email Validator?</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are dedicated to providing the most accurate, reliable, and lightning-fast email verification service trusted by thousands worldwide.
          </p>
        </div>
        <img src="/images/whyus.jpg" alt="Why Us" className="rounded-3xl shadow-xl" data-aos="fade-left" />
      </section>

      {/* Client Logos */}
      <section className="bg-gradient-to-br from-blue-50 to-white py-14 px-6 text-center">
        <h2 className="text-3xl font-semibold mb-2">#1 Email Verifier for 50,000+ Clients</h2>
        <p className="text-lg mb-8 text-gray-600">Trusted by startups, agencies, and enterprise-level brands.</p>
        <div className="flex flex-wrap justify-center gap-10 grayscale hover:grayscale-0 transition duration-300">
          {['client1', 'client2', 'client3', 'client4', 'client5'].map((client, i) => (
            <img key={i} src={`/logos/${client}.svg`} alt={client} className="h-12" />
          ))}
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-16">Why People Choose Email Validator</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: <FaShieldAlt />, title: 'Reliable', desc: 'We guarantee consistent, high-quality results you can trust.' },
            { icon: <FaRocket />, title: 'Fast Verification', desc: 'Validate thousands of emails in seconds with our smart engine.' },
            { icon: <FaUserCheck />, title: 'User-Friendly', desc: 'Easy to use interface and seamless integrations for everyone.' },
            { icon: <FaLock />, title: 'Secure', desc: 'We protect your data with the highest security and privacy standards.' },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white bg-opacity-60 backdrop-blur-md border border-gray-100 p-6 rounded-2xl text-center shadow-xl hover:shadow-2xl transition transform hover:-translate-y-2"
              data-aos="zoom-in"
              data-aos-delay={index * 100}
            >
              <div className="text-4xl text-blue-600 mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
              <p className="text-gray-700 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-blue-50 py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-xl shadow transition-all"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left px-6 py-4 text-lg font-semibold flex justify-between items-center"
                >
                  {faq.question}
                  <span className="text-blue-600 text-2xl">
                    {openIndex === index ? '−' : '+'}
                  </span>
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-5 text-gray-700 transition-all duration-300 ease-in-out">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-blue-600 text-white text-center py-24 px-6 overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-bold mb-4">Experience the Most Reliable Email Validation</h2>
          <p className="text-lg mb-8">Sign up today and clean your email lists with confidence.</p>
          <Link
            to="/signup"
            className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-100 transition"
          >
            Start for Free
          </Link>
        </div>

        {/* Decorative background */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg className="w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path fill="white" fillOpacity="1" d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"></path>
          </svg>
        </div>
      </section>
    </div>
  );
};

export default WhyUs;
