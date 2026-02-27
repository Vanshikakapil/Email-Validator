import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { FaLock, FaShieldAlt, FaKey, FaCheckCircle } from 'react-icons/fa';

const Security = () => {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-white text-blue-950 overflow-hidden">
      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold mb-6" data-aos="fade-down">
          Security & Compliance
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed" data-aos="fade-up">
          At Email Validator, your data security and privacy are our top priorities. We employ industry-leading safeguards at every level.
        </p>
      </section>

      {/* Certifications */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-2xl font-semibold mb-6">Certifications & Standards</h2>
            <ul className="space-y-3 text-gray-800">
              {[
                'SOC 2 Type II – annual internal control audits',
                'ISO‑27001:2013 – certified information security management',
                'HIPAA Compliant – privacy protection for health data',
                'PCI-DSS – secure credit card transactions',
                'GDPR & DPF – EU/Swiss‑US data transfer frameworks',
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <FaCheckCircle className="text-green-500 mt-1" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src="/images/security-certifications.svg"
            alt="Security Certifications"
            className="rounded-xl shadow-lg"
            data-aos="fade-left"
          />
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <img
            src="/images/protection.jpg"
            alt="Data Protection"
            className="rounded-xl shadow-lg"
            data-aos="zoom-in-right"
          />
          <div data-aos="zoom-in-left">
            <h2 className="text-2xl font-semibold mb-4">Data Protection & Encryption</h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-4">
              We use military-grade encryption to protect your data in motion and at rest. Files are encrypted with unique keys and automatically purged within 30 days.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Hosted on Cloudflare’s enterprise network with Web Application Firewall (WAF) and DDoS protection for high availability.
            </p>
          </div>
        </div>
      </section>

      {/* Account Security */}
      <section className="bg-blue-50 py-16 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div data-aos="fade-right">
            <h2 className="text-2xl font-semibold mb-4">Account Security Features</h2>
            <ul className="space-y-4 text-gray-800">
              {[
                ['Two‑Factor Authentication (2FA)', 'via email, SMS, or authenticator apps'],
                ['IP‑based Access Control', 'block unknown IPs & receive alerts'],
                ['Suspicious Activity Alerts', 'get instant login anomaly notifications'],
                ['Password‑Protected Downloads', 'ensure only authorized users access files'],
              ].map(([title, desc], i) => (
                <li key={i} className="flex items-start gap-3">
                  <FaShieldAlt className="text-blue-600 mt-1" />
                  <span><strong>{title}</strong> – {desc}</span>
                </li>
              ))}
            </ul>
          </div>
          <img
            src="/images/acc.jpg"
            alt="Account Security"
            className="rounded-xl shadow-lg"
            data-aos="fade-left"
          />
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 text-white text-center py-20 px-6 relative">
        <h2 className="text-3xl font-bold mb-4" data-aos="zoom-in">
          Start Validating with Confidence
        </h2>
        <p className="text-lg mb-6" data-aos="fade-up">
          Join organizations that rely on secure, accurate email verification every day.
        </p>
        <a
          href="/signup"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-full hover:bg-blue-100 transition"
          data-aos="fade-up"
        >
          Create Secure Account
        </a>

        {/* Decorative Bottom Wave */}
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1440 200" className="w-full h-auto">
            <path
              fill="#0f172a"
              d="M0,96L48,106.7C96,117,192,139,288,160C384,181,480,203,576,202.7C672,203,768,181,864,186.7C960,192,1056,224,1152,224C1248,224,1344,192,1392,176L1440,160L1440,320L0,320Z"
              fillOpacity="1"
            />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Security;
