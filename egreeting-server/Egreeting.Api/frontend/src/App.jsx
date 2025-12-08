import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";

// Pages\
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Category from "./pages/Category";
import EditCard from "./pages/EditCard";
import SendCard from "./pages/SendCard";
import Subscribe from "./pages/Subscribe";
import Feedback from "./pages/Feedback";
import Search from "./pages/Search";
import Snowfall from "./components/Snowfall";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyOTP from "./pages/VerifyOTP";
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import PaymentSuccess from "./pages/payment-success";
import PackagesPage from "./pages/PackagesPage";
import MySub from "./pages/MySub";

// Optional: future flags để tránh warning v7
const futureFlags = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter future={futureFlags}>
        <Snowfall />
        {/* Header cố định ở trên */}
        <Header />

        {/* Main layout */}
        <main className="flex-grow-1 py-4">
          <div className="container">
            <Routes>
              {/* Trang chính */}
              <Route path="/" element={<Home />} />

              {/* Search */}
              <Route path="/search" element={<Search />} />

              {/* Category */}
              <Route path="/category/:categoryName" element={<Category />} />

              {/* Template edit/send */}
              <Route path="/edit/:id" element={<EditCard />} />
              <Route path="/send/:id" element={<SendCard />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              {/* Subscribe / Feedback */}
              <Route path="/subscribe" element={<Subscribe />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/packages" element={<PackagesPage />} />
              <Route path="/my-subscription" element={<ProtectedRoute><MySub /></ProtectedRoute>} />

              {/* 404 fallback */}
              <Route path="*" element={<h2 className="text-center py-5">Page not found</h2>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/verify-otp" element={<VerifyOTP />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>

        {/* Footer cố định ở dưới */}
        <Footer />
      </BrowserRouter>
    </AuthProvider>
  );
}
