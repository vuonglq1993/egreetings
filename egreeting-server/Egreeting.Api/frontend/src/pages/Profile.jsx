// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Tab, Tabs } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form data
  const [profileForm, setProfileForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(res.data);
      setProfileForm({ fullName: res.data.fullName, email: res.data.email });
    } catch (err) {
      setError("Please login again");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/update-profile`,
        { fullName: profileForm.fullName }, // chỉ gửi fullName
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Profile updated successfully!");
      const updatedUser = { ...user, fullName: profileForm.fullName };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("New passwords do not match");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/change-password`,
        {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Password changed successfully! Please login again.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });

      setTimeout(() => {
        localStorage.clear();
        window.location.href = "/login";
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Change password failed");
    }
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-amber-400"></div>
      </div>
    );

  return (
    <Container className="py-5">
      <div className="d-flex justify-content-center">
        <Card className="auth-card p-5" style={{ maxWidth: "600px", width: "100%" }}>
          <div className="text-center mb-5">
            <h2 className="auth-title">My Profile</h2>
            <p className="text-white opacity-80">Manage your account information</p>
          </div>

          {message && <Alert variant="success" className="mb-4">{message}</Alert>}
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          <Tabs defaultActiveKey="profile" className="mb-5 profile-tabs">
            {/* TAB: PROFILE */}
            <Tab eventKey="profile" title="Profile Info">
              <Form onSubmit={handleUpdateProfile}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-amber-300 fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm({ ...profileForm, fullName: e.target.value })}
                    className="form-control-custom"
                    required
                  />
                </Form.Group>

                <Button type="submit" className="btn-login w-100">
                  Update Profile
                </Button>
              </Form>
            </Tab>

            {/* TAB: CHANGE PASSWORD */}
            <Tab eventKey="password" title="Change Password">
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-amber-300 fw-semibold">Current Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showCurrent ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="form-control-custom"
                      required
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y me-4 text-amber-200 cursor-pointer"
                      onClick={() => setShowCurrent(!showCurrent)}>
                      {showCurrent ? <EyeOff size={22} /> : <Eye size={22} />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-amber-300 fw-semibold">New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showNew ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="form-control-custom"
                      required
                      minLength={8}
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y me-4 text-amber-200 cursor-pointer"
                      onClick={() => setShowNew(!showNew)}>
                      {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-amber-300 fw-semibold">Confirm New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="form-control-custom"
                      required
                    />
                    <span className="position-absolute top-50 end-0 translate-middle-y me-4 text-amber-200 cursor-pointer"
                      onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <EyeOff size={22} /> : <Eye size={22} />}
                    </span>
                  </div>
                </Form.Group>

                <Button type="submit" className="btn-login w-100">
                  Change Password
                </Button>
              </Form>
            </Tab>
          </Tabs>
        </Card>
      </div>
    </Container>
  );
}
