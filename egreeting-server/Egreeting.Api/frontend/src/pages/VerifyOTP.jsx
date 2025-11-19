// src/pages/VerifyOTP.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "../styles/login.css";

export default function VerifyOTP() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = async () => {
    const code = otp.join("");
    if (code.length !== 6) return alert("Please enter full 6 digits");

    setIsLoading(true);
    try {
      // Gọi API verify OTP ở đây
      // await axios.post("/auth/verify-otp", { code });
      navigate("/reset-password");
    } catch (err) {
      alert("Invalid or expired code");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card p-5">
        <div className="text-center mb-5">
          <h2 className="auth-title">Verify Your Email</h2>
          <p className="text-white opacity-80 mt-2">Enter the 6-digit code sent to your email</p>
        </div>

        <div className="d-flex justify-content-center gap-3 mb-5">
          {otp.map((digit, idx) => (
            <input
              key={idx}
              id={`otp-${idx}`}
              type="text"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-8 h-8 text-center text-2xl font-bold bg-white/20 border-2 border-amber-400/50 rounded-xl text-white focus:border-amber-300 focus:outline-none"
            />
          ))}
        </div>

        <Button 
          className="btn-login w-100" 
          onClick={handleSubmit}
          disabled={isLoading || otp.join("").length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify & Continue"}
        </Button>

        <p className="text-center mt-4 text-white text-sm">
          Didn't receive the code? <span className="text-white font-bold cursor-pointer hover:text-amber-300">Resend</span>
        </p>
      </Card>
    </div>
  );
}