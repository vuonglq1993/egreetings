// src/pages/Login.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../styles/login.css"; 
import { GoogleLogin } from "@react-oauth/google";

const schema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Please enter your password"),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Gọi API đăng nhập
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          email: data.email,
          password: data.password,
        }
      );

      const { token, user } = res.data;

      // Lưu token và user info vào localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("user-updated"));

      alert("Login successful! Welcome back!");
      navigate("/"); // Chuyển hướng sau khi đăng nhập
    } catch (err) {
      setError("root", {
        message: err.response?.data?.message || "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    // credentialResponse.credential là Google ID token (ko phải token app)
    const googleIdToken = credentialResponse?.credential;
    if (!googleIdToken) {
      alert("Google login failed: no credential returned.");
      return;
    }

    setIsLoading(true);
    try {
      // Gửi Google ID token cho BE, BE sẽ validate và trả về token app + user
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login-google`,
        { token: googleIdToken }
      );

      // Đặt tên rõ ràng để tránh nhầm lẫn
      const { token: appToken, user } = res.data;

      if (!appToken) {
        throw new Error("No token received from server");
      }

      localStorage.setItem("token", appToken);
      localStorage.setItem("user", JSON.stringify(user));
      window.dispatchEvent(new Event("user-updated"));

      alert("Logged in with Google!");
      navigate("/");
    } catch (err) {
      console.error("Google login error:", err);
      alert(err.response?.data?.message || "Google login failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card p-5">
        <div className="text-center mb-5">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="text-white opacity-80 mt-2">Log in to continue creating magic</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-4">
            <Form.Label className="text-white fw-semibold">Email Address</Form.Label>
            <Form.Control
              {...register("email")}
              type="email"
              placeholder="you@example.com"
              className="form-control-custom"
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="text-white fw-semibold">Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="form-control-custom"
                isInvalid={!!errors.password}
              />
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-4 text-white cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </span>
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
          </Form.Group>

          {errors.root && (
            <div className="alert alert-danger py-2 text-center">
              {errors.root.message}
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <Form.Check type="checkbox" label="Remember me" className="text-white" />
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            className="btn-login w-100"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>

          {/* --- GOOGLE LOGIN BUTTON --- */}
          <div className="mt-4 text-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => {
                console.log("Google Login Failed");
                alert("Google login failed.");
              }}
            />
          </div>
        </Form>

        <p className="text-center mt-5 text-white">
          Don't have an account?{" "}
          <Link to="/register" className="text-white font-bold hover:text-white underline">
            Create one now
          </Link>
        </p>
      </Card>
    </div>
  );
}
