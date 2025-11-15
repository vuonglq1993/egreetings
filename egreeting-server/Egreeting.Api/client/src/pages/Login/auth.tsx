import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./auth.css";

// ✅ Lấy API URL từ biến môi trường
const API_URL = import.meta.env.VITE_API_URL as string;

const LOGIN_URL = `${API_URL}/auth/login`;
const REGISTER_URL = `${API_URL}/auth/register`;

interface SignUpData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface Errors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const Auth: React.FC = () => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const navigate = useNavigate();

  const [signUpData, setSignUpData] = useState<SignUpData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [signInData, setSignInData] = useState<SignInData>({
    email: "",
    password: "",
  });

  const [errorsSignUp, setErrorsSignUp] = useState<Errors>({});
  const [errorsSignIn, setErrorsSignIn] = useState<Errors>({});
  const [message, setMessage] = useState<string>("");
  const [statusType, setStatusType] = useState<"success" | "error">("success");

  // ===== Validate Sign Up =====
  const validateSignUp = (): Errors => {
    const newErrors: Errors = {};
    if (!signUpData.fullName) newErrors.fullName = "Full Name is required";
    else if (!/^[a-zA-ZÀ-ỹ\s]+$/.test(signUpData.fullName))
      newErrors.fullName = "Full Name must contain only letters";
    else if (signUpData.fullName.length < 3)
      newErrors.fullName = "Full Name must be at least 3 characters";

    if (!signUpData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(signUpData.email))
      newErrors.email = "Invalid email format";

    if (!signUpData.password) newErrors.password = "Password is required";
    else if (signUpData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";

    if (!signUpData.confirmPassword)
      newErrors.confirmPassword = "Please confirm your password";
    else if (signUpData.password !== signUpData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    return newErrors;
  };

  // ===== Validate Sign In =====
  const validateSignIn = (): Errors => {
    const newErrors: Errors = {};
    if (!signInData.email) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(signInData.email))
      newErrors.email = "Invalid email format";

    if (!signInData.password) newErrors.password = "Password is required";
    else if (signInData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    return newErrors;
  };

  // ===== Handle Sign Up =====
  const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateSignUp();
    if (Object.keys(newErrors).length > 0) {
      setErrorsSignUp(newErrors);
      setStatusType("error");
      return;
    }
    try {
      const res = await axios.post(REGISTER_URL, signUpData);
      setMessage(res.data.message || "Sign Up Successful!");
      setStatusType("success");
      setErrorsSignUp({});
      setTimeout(() => {
        setMessage("");
        setIsActive(false);
      }, 2000);
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Sign Up Failed!");
      setStatusType("error");
    }
  };

  // ===== Handle Sign In =====
  const handleSignIn = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newErrors = validateSignIn();
    if (Object.keys(newErrors).length > 0) {
      setErrorsSignIn(newErrors);
      setStatusType("error");
      return;
    }
    try {
      const res = await axios.post(LOGIN_URL, signInData, {
        withCredentials: true,
      });
      setMessage(res.data.message || "Sign In Successful!");
      setStatusType("success");
      setErrorsSignIn({});

      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.location.href = "/";
    } catch (err: any) {
      setMessage(err.response?.data?.message || "Sign In Failed!");
      setStatusType("error");
    }
  };

  // ===== Input Change =====
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<any>>
  ) => {
    const { name, value } = e.target;
    setState((prevState: any) => ({ ...prevState, [name]: value }));
  };

  return (
    <section className="login-page">
      <div className={`container ${isActive ? "active" : ""}`}>
        {/* ==== Sign Up ==== */}
        <div className="form-container sign-up">
          <form onSubmit={handleSignUp}>
            <h1>Create Account</h1>
            <span>or use your email for registration</span>
            {/* Input fields */}
            <div className="input-group">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={signUpData.fullName}
                onChange={(e) => handleInputChange(e, setSignUpData)}
                className={errorsSignUp.fullName ? "input-error" : ""}
              />
              {errorsSignUp.fullName && (
                <div className="error-wrapper">
                  <span className="error-icon">!</span>
                  <span className="error-text">{errorsSignUp.fullName}</span>
                </div>
              )}
            </div>
            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signUpData.email}
                onChange={(e) => handleInputChange(e, setSignUpData)}
                className={errorsSignUp.email ? "input-error" : ""}
              />
              {errorsSignUp.email && (
                <div className="error-wrapper">
                  <span className="error-icon">!</span>
                  <span className="error-text">{errorsSignUp.email}</span>
                </div>
              )}
            </div>
            {/* Password */}
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signUpData.password}
                onChange={(e) => handleInputChange(e, setSignUpData)}
                className={errorsSignUp.password ? "input-error" : ""}
              />
              {errorsSignUp.password && (
                <div className="error-wrapper">
                  <span className="error-icon">!</span>
                  <span className="error-text">{errorsSignUp.password}</span>
                </div>
              )}
            </div>
            {/* Confirm Password */}
            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Enter Password Again"
                value={signUpData.confirmPassword}
                onChange={(e) => handleInputChange(e, setSignUpData)}
                className={errorsSignUp.confirmPassword ? "input-error" : ""}
              />
              {errorsSignUp.confirmPassword && (
                <div className="error-wrapper">
                  <span className="error-icon">!</span>
                  <span className="error-text">
                    {errorsSignUp.confirmPassword}
                  </span>
                </div>
              )}
            </div>
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* ==== Sign In ==== */}
        <div className="form-container sign-in">
          <form onSubmit={handleSignIn}>
            <h1>Sign In</h1>
            <span>or use your email password</span>
            {/* Email */}
            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={signInData.email}
                onChange={(e) => handleInputChange(e, setSignInData)}
                className={errorsSignIn.email ? "input-error" : ""}
              />
              {errorsSignIn.email && (
                <div className="error-wrapper">
                  <span className="error-icon">!</span>
                  <span className="error-text">{errorsSignIn.email}</span>
                </div>
              )}
            </div>
            {/* Password */}
            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={signInData.password}
                onChange={(e) => handleInputChange(e, setSignInData)}
                className={errorsSignIn.password ? "input-error" : ""}
              />
              {errorsSignIn.password && (
                <div className="error-wrapper">
                  <span className="error-icon">!</span>
                  <span className="error-text">{errorsSignIn.password}</span>
                </div>
              )}
            </div>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* ==== Toggle ==== */}
        <div className="toggle-container">
          <div className="toggle">
            <div className="toggle-panel toggle-left">
              <h1>Welcome Back!</h1>
              <p>Enter your personal details to use all of site features</p>
              <button
                className="hidden"
                id="login"
                onClick={(e) => {
                  e.preventDefault();
                  setIsActive(false);
                }}
              >
                Sign In
              </button>
            </div>
            <div className="toggle-panel toggle-right">
              <h1>Hello, Friend!</h1>
              <p>Register with your personal details to use all of site features</p>
              <button
                className="hidden"
                id="register"
                onClick={(e) => {
                  e.preventDefault();
                  setIsActive(true);
                }}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>

        {/* Status Message */}
        {message && <p className={`status-msg ${statusType}`}>{message}</p>}
      </div>
    </section>
  );
};

export default Auth;