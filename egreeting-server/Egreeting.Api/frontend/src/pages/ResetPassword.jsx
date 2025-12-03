// src/pages/ResetPassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../styles/login.css";

const schema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPassword() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      // Gọi API reset password
      // await axios.post("/auth/reset-password", { newPassword: data.newPassword });
      alert("Password changed successfully!");
      navigate("/login");
    } catch (err) {
      alert("Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card p-5">
        <div className="text-center mb-5">
          <h2 className="auth-title">Set New Password</h2>
          <p className="text-white opacity-80 mt-2">Your new password must be different from previous ones</p>
        </div>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Form.Group className="mb-4">
            <Form.Label className="text-amber-300 fw-semibold">New Password</Form.Label>
            <div className="position-relative">
              <Form.Control
                {...register("newPassword")}
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                className="form-control-custom"
                isInvalid={!!errors.newPassword}
              />
              <span
                className="position-absolute top-50 end-0 translate-middle-y me-4 text-amber-200 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
              </span>
            </div>
            <Form.Control.Feedback type="invalid">
              {errors.newPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label className="text-amber-300 fw-semibold">Confirm New Password</Form.Label>
            <Form.Control
              {...register("confirmPassword")}
              type={showPassword ? "text" : "password"}
              placeholder="Confirm your password"
              className="form-control-custom"
              isInvalid={!!errors.confirmPassword}
            />
            <Form.Control.Feedback type="invalid">
              {errors.confirmPassword?.message}
            </Form.Control.Feedback>
          </Form.Group>

          <Button type="submit" className="btn-login w-100" disabled={isLoading}>
            {isLoading ? "Saving..." : "Change Password"}
          </Button>
        </Form>
      </Card>
    </div>
  );
}