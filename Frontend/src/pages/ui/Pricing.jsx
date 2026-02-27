import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom"; // <-- import navigate

const creditOptions = [
  "2K", "5K", "10K", "25K", "50K", "100K", "250K", "500K", "1M", "2M", "5M", "5M+"
];

const Pricing = () => {
  const [credits, setCredits] = useState("2000");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const navigate = useNavigate(); // <-- initialize navigate

  const parseCredits = (value) => {
    if (value.endsWith("K")) return parseInt(value) * 1000;
    if (value.endsWith("M")) return parseInt(value) * 1000000;
    if (value.includes("+")) return parseInt(value) * 1000000;
    return parseInt(value);
  };

  const pricePerCredit = 0.01;
  const price = (parseCredits(credits) * pricePerCredit).toFixed(2);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const buttonHover = { scale: 1.05 };

  // handle button click
  const handleGetStarted = () => {
    navigate("/login");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-20">
      {/* SECTION 1: Pay-As-You-Go */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}>
        <h1 className="text-4xl font-bold mb-2">
          <span className="text-blue-600">Simple pricing</span> for everyone
        </h1>
        <p className="text-gray-600 mb-6">
          Get credits any time with Pay-As-You-Go or subscribe and save for ongoing email validation.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {["📧 Email Validation","🔢 Scoring","✉️ Email Finder","🌐 Domain Search"].map((tool, i) => (
            <motion.div 
              key={i} 
              className="flex items-center gap-2 p-2 rounded hover:bg-blue-50 cursor-pointer transition"
              whileHover={{ scale: 1.05 }}
            >
              <span className="p-2 bg-blue-100 rounded">{tool.split(" ")[0]}</span> {tool.split(" ").slice(1).join(" ")}
            </motion.div>
          ))}
        </div>

        {/* Pricing Card */}
        <motion.div className="border rounded-lg shadow p-6 flex flex-col md:flex-row justify-between items-center gap-6" variants={cardVariants} whileHover="hover">
          <div className="flex-1">
            <h2 className="text-blue-600 font-semibold mb-2">Pay-as-You-Go Credits</h2>
            <input
              type="text"
              value={credits}
              onChange={(e) => setCredits(e.target.value)}
              className="border border-blue-400 rounded px-3 py-2 w-full mb-4 focus:ring-2 focus:ring-blue-300 outline-none transition"
            />
            <p className="text-gray-500 mb-4">Our minimum purchase size is 2,000 credits</p>

            <div className="grid grid-cols-4 gap-2">
              {creditOptions.map((option) => (
                <motion.button
                  key={option}
                  className={`border rounded px-2 py-1 text-blue-600 hover:bg-blue-100 transition ${credits === option ? "bg-blue-100 font-semibold" : ""}`}
                  onClick={() => setCredits(option)}
                  whileHover={buttonHover}
                >
                  {option} Credits
                </motion.button>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center justify-center border-t pt-6 md:border-t-0 md:border-l md:pl-6">
            <span className="text-blue-600 font-semibold mb-2 text-center">
              Subscribe & <br /> Save 15%
            </span>
            <h3 className="text-4xl font-bold mb-1">${price}</h3>
            <p className="text-gray-500 mb-4 text-sm">${pricePerCredit.toFixed(2)}/credit</p>
            <motion.button
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
              whileHover={buttonHover}
              onClick={handleGetStarted} // <-- link to login
            >
              Get Started
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* SECTION 2: Subscription Plans */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={cardVariants}>
        <h2 className="text-4xl font-bold text-center mb-12">
          Increase your <span className="text-blue-600">email deliverability</span> with our advanced tools
        </h2>

        <div className="grid md:grid-cols-4 gap-10 items-start">
          <motion.div className="md:col-span-1 space-y-6" whileHover={{ scale: 1.02 }}>
            <div className="bg-blue-50 text-blue-700 border border-blue-200 px-4 py-2 rounded-lg w-fit rotate-[-6deg]">
              <span className="font-semibold">Subscribe &<br /> Save 15%</span>
            </div>

            <ul className="space-y-4 text-gray-700">
              {[
                "Save 15% on Pay-As-You-Go and Autopay",
                "Email Validation / Email Scoring",
                "Email Finder / Domain Searches",
                "Inbox Placement Tests"
              ].map((item,i)=>(
                <li key={i} className="flex items-center gap-2">
                  <span className="text-blue-600">🏷️</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="md:col-span-3 space-y-8">
            {/* Billing Toggle */}
            <div className="flex justify-center bg-gray-100 p-1 rounded-full w-fit mx-auto">
              {["monthly","annually"].map((cycle) => (
                <button
                  key={cycle}
                  onClick={() => setBillingCycle(cycle)}
                  className={`px-6 py-2 rounded-full font-medium ${billingCycle === cycle ? "bg-blue-600 text-white" : "text-gray-700"} transition`}
                >
                  {cycle === "monthly" ? "Monthly" : "Annually (Save 20%)"}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Pricing Cards */}
              {[{
                  title: "Freemium",
                  desc: "Test our product with zero risk",
                  price: "$0",
                  list: ["100","10","1"],
                  bg: "bg-white border"
                },
                {
                  title: "ZeroBounce ONE™",
                  desc: "All products for the price of ONE",
                  price: billingCycle === "monthly" ? "$99" : "$79",
                  list: ["25,000","10,000","100"],
                  bg: "bg-blue-50 border-2 border-blue-600 relative",
                  badge: "BEST VALUE"
                },
                {
                  title: "ZeroBounce ONE™ Custom",
                  desc: "Tailored to fit your needs",
                  price: billingCycle === "monthly" ? "$274" : "$219",
                  list: ["50,000/mo","10,000/mo","100/mo"],
                  bg: "bg-white border"
                }
              ].map((plan,i)=>(
                <motion.div
                  key={i}
                  className={`rounded-2xl p-6 shadow-sm hover:shadow-lg transition ${plan.bg}`}
                  whileHover={{ scale: 1.05 }}
                >
                  {plan.badge && <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-sm font-semibold px-3 py-1 rounded-full">{plan.badge}</span>}
                  <h3 className="text-xl font-semibold mb-2 text-center">{plan.title}</h3>
                  <p className="text-center text-gray-600 mb-4">{plan.desc}</p>
                  <p className="text-4xl font-bold text-center mb-6">{plan.price}<span className="text-lg">/mo</span></p>
                  <motion.button
                    className="w-full py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition"
                    whileHover={buttonHover}
                    onClick={handleGetStarted} // <-- link to login
                  >
                    Get Started
                  </motion.button>
                  <ul className="mt-6 space-y-2 text-center">
                    {plan.list.map((item,j)=>(<li key={j}>{item}</li>))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* INCLUDED FEATURES */}
      <section className="py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Included with all <span className="text-blue-600">Email Validator</span> Accounts
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto text-gray-700 px-6">
          {[{icon:"📆", text:"Credits never expire"},{icon:"⭐", text:"Priority validation speed"},{icon:"📑", text:"Detailed error reporting"},{icon:"📩", text:"Inbox placement insights"},{icon:"🌍", text:"Real-time IP & Geo checks"},{icon:"🔑", text:"Multiple API key support"},{icon:"💬", text:"24/7 live chat support"},{icon:"🎁", text:"100 free monthly validations"},{icon:"🛠️", text:"20+ validation tools included"}].map((item,i)=>(
            <motion.div key={i} className="flex items-center gap-3" whileHover={{ scale: 1.05 }}>
              <span className="text-blue-600 text-2xl">{item.icon}</span>
              <p>{item.text}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Pricing;
