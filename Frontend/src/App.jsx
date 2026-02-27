import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/global/Navbar';
import Home from './pages/ui/Home';
import Login from './pages/ui/Login';
import Signup from './pages/ui/Signup';
import Dashboard from './pages/ui/Dashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from "./pages/admin/AdminDashboard";

import 'react-toastify/dist/ReactToastify.css';

import Users from "./pages/admin/Users";

import Pricing from './pages/ui/Pricing';
import AboutUs from './pages/Companypages/AboutUs';
import WhyUs from './pages/Companypages/WhyUs';
import Contact from './pages/Companypages/Contact';
import Security from './pages/Companypages/Security';
import Reviews from './pages/Companypages/Reviews';
import Footer from './components/global/Footer';
import ProtectedAdminRoute from './components/ProtectedadminRoute';
import ErrorPage from './pages/Error';
import ProtectedUserRoute from './components/ProtectedUserRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path="/dashboard" element={
            <ProtectedUserRoute>
            <Dashboard />
            </ProtectedUserRoute>
            } />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/Aboutus" element={<AboutUs />} />
          <Route path="/WhyUs" element={<WhyUs />} />
          <Route path="/Contact" element={<Contact />} />
          <Route path="/Security" element={<Security/>} /> 
          <Route path="/Reviews" element={<Reviews />} />    
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={
            <ProtectedAdminRoute>
              <AdminDashboard/>
            </ProtectedAdminRoute>
          }
          />
          <Route path="/admin/users" element={<Users />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;


