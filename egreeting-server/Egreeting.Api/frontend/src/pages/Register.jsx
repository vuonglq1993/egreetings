// src/pages/Register.jsx
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from "lucide-react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../styles/register.css"; // ← Tách riêng CSS

// Password schema (strong)
const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(30, "Password must not exceed 30 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

const schema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  passwordHash: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.passwordHash === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [emailStatus, setEmailStatus] = useState(null); // null | "checking" | "available" | "exists"

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const password = watch("passwordHash") || "";
  const email = watch("email") || "";

  // Reset email status khi thay đổi
  useEffect(() => {
    setEmailStatus(null);
    clearErrors("email");
  }, [email, clearErrors]);

  // Password strength
  useEffect(() => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    setPasswordStrength(checks.filter(Boolean).length);
  }, [password]);

  const getStrengthColor = () => {
    if (passwordStrength <= 2) return "bg-danger";
    if (passwordStrength <= 4) return "bg-warning";
    return "bg-success";
  };

  const checkEmail = async () => {
    if (!email) return;
    setEmailStatus("checking");
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/check-email?email=${email}`);
      setEmailStatus(res.data.exists ? "exists" : "available");
      if (res.data.exists) setError("email", { message: "This email is already registered" });
    } catch {
      setEmailStatus("error");
    }
  };

  const onSubmit = async (data) => {
    if (emailStatus === "exists") return;

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users`, {
        fullName: data.fullName,
        email: data.email,
        passwordHash: data.passwordHash,
        role: "User",
      });
      alert("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      if (err.response?.status === 409) {
        setError("email", { message: "This email is already registered" });
      }
    }
  };

  return (
    <div className="register-page">
      <Card className="register-card p-5">
        <div className="text-center mb-5">
          <h2 className="register-title">Create Your Account</h2>
          <p className="text-white opacity-80 mt-2">Join the ultimate greeting card experience</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Form.Group>
            <Form.Label className="text-white mt-2">Full Name</Form.Label>
            <Form.Control {...register("fullName")} className="form-control-custom" placeholder="John Doe" isInvalid={!!errors.fullName} />
            <Form.Control.Feedback type="invalid">{errors.fullName?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-white mt-2">Email Address</Form.Label>
            <div className="d-flex gap-2">
              <Form.Control {...register("email")} type="email" className="form-control-custom" placeholder="you@example.com" isInvalid={!!errors.email} />
              <Button variant="outline-warning" size="sm" onClick={checkEmail} className="btn-check-email">
                {emailStatus === "checking" ? <Loader2 size={18} className="spin" /> : "Check"}
              </Button>
            </div>
            {emailStatus === "exists" && <small className="text-danger d-block mt-1">Email already taken</small>}
            {emailStatus === "available" && <small className="text-success d-block mt-1">Email available!</small>}
            <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-white mt-2">Password</Form.Label>
            <div className="position-relative">
              <Form.Control {...register("passwordHash")} type={showPassword ? "text" : "password"} className="form-control-custom" placeholder="••••••••" isInvalid={!!errors.passwordHash} />
              <span className="position-absolute top-50 end-0 translate-middle-y me-3 text-white cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </span>
            </div>
            <Form.Control.Feedback type="invalid">{errors.passwordHash?.message}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group>
            <Form.Label className="text-white mt-2">Confirm Password</Form.Label>
            <Form.Control {...register("confirmPassword")} type={showPassword ? "text" : "password"} className="form-control-custom" placeholder="Re-enter password" isInvalid={!!errors.confirmPassword} />
            <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
          </Form.Group>

          {password && (
            <div>
              <div className="d-flex justify-content-between text-sm text-amber-200">
                <span>Password strength</span>
                <strong className={passwordStrength >= 5 ? "text-success" : passwordStrength >= 3 ? "text-warning" : "text-danger"}>
                  {passwordStrength === 5 ? "Strong" : passwordStrength >= 3 ? "Medium" : "Weak"}
                </strong>
              </div>
              <div className="progress-strength mt-2">
                <div className={`h-100 transition-all duration-500 ${getStrengthColor()}`} style={{ width: `${(passwordStrength / 5) * 100}%` }} />
              </div>
            </div>
          )}

          <Button type="submit" className="btn-register w-100 mt-4" disabled={isSubmitting || passwordStrength < 4}>
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </Button>
        </Form>

        <p className="text-center mt-4 text-white">
          Already have an account?{" "}
          <Link to="/login" className="text-white font-bold hover:text-white mt-2 underline">
            Sign In
          </Link>
        </p>
      </Card>
    </div>
  );
}