// src/pages/ForgotPassword.jsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import "../styles/login.css";

const schema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/forgot-password`, {
        email: data.email
      });
      setSuccess(true);
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page">
        <Card className="auth-card p-5 text-center">
          <h2 className="auth-title mb-4">Check Your Email</h2>
          <p className="text-white opacity-90 mb-4">
            We have sent a 6-digit verification code to your email.
          </p>
          <Button 
            className="btn-login"
            onClick={() => navigate("/verify-otp")}
          >
            Continue to Verify
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <Card className="auth-card p-5">
        <div className="text-center mb-5">
          <h2 className="auth-title">Forgot Password?</h2>
          <p className="text-white opacity-80 mt-2">Enter your email to receive a verification code</p>
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

          <Button type="submit" className="btn-login w-100" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Verification Code"}
          </Button>
        </Form>

        <p className="text-center mt-4 text-white">
          Remember your password?{" "}
          <Link to="/login" className="text-white font-bold hover:text-white underline">
            Back to Login
          </Link>
        </p>
      </Card>
    </div>
  );
}