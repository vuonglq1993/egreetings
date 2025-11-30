// src/pages/Profile.jsx
import { useState, useEffect } from "react";
import { Container, Card, Form, Button, Alert, Tab, Tabs } from "react-bootstrap";
import { Eye, EyeOff, User, RefreshCw } from "lucide-react";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarLoading, setAvatarLoading] = useState(true);

  const [profileForm, setProfileForm] = useState({ fullName: "", email: "" });
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Tạo avatar random - FIXED: Sử dụng service đơn giản và ổn định
  const generateRandomAvatar = (seed, size = 120) => {
    // Cách 1: UI Avatars với random background
    const backgrounds = ['FF6B6B', '4ECDC4', '45B7D1', '96CEB4', 'FFEAA7', 'DDA0DD', '98D8C8', 'F7DC6F'];
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(seed)}&background=${randomBg}&color=000&size=${size}&bold=true&rounded=true`;
    
    // Hoặc cách 2: DiceBear với random style
    // const styles = ['adventurer', 'avataaars', 'bottts', 'fun-emoji', 'micah', 'miniavs'];
    // const randomStyle = styles[Math.floor(Math.random() * styles.length)];
    // return `https://api.dicebear.com/7.x/${randomStyle}/svg?seed=${seed}`;
  };

  // Lấy avatar ổn định dựa trên user data
  const getStableAvatar = (user) => {
    const seed = user?.fullName || user?.email || `user${user?.id}` || 'User';
    return generateRandomAvatar(seed, 120);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      // Ưu tiên dùng avatar đã có trong user object, nếu không thì tạo mới
      if (user.avatar) {
        setAvatarUrl(user.avatar);
        setAvatarLoading(false);
      } else {
        const stableAvatar = getStableAvatar(user);
        setAvatarUrl(stableAvatar);
        
        // Test load ảnh
        const img = new Image();
        img.onload = () => {
          setAvatarLoading(false);
          // Lưu avatar vào user object
          updateUserAvatar(stableAvatar);
        };
        img.onerror = () => {
          setAvatarLoading(false);
          // Nếu lỗi, thử tạo avatar với service khác
          const fallbackAvatar = `https://ui-avatars.com/api/?name=User&background=FFD700&color=000&size=120&bold=true`;
          setAvatarUrl(fallbackAvatar);
          updateUserAvatar(fallbackAvatar);
        };
        img.src = stableAvatar;
      }
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = res.data;
      setUser(userData);
      setProfileForm({ 
        fullName: userData.fullName || "", 
        email: userData.email || "" 
      });
    } catch (err) {
      console.error("Fetch user error:", err);
      setError("Please login again");
    } finally {
      setLoading(false);
    }
  };

  // Hàm cập nhật avatar vào user object và localStorage
  const updateUserAvatar = (avatarUrl) => {
    if (user) {
      const updatedUser = { ...user, avatar: avatarUrl };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      // Trigger event để Header update
      window.dispatchEvent(new Event('user-updated'));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setError("");

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${import.meta.env.VITE_API_URL}/users/update-profile`,
        { fullName: profileForm.fullName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage("Profile updated successfully!");
      const updatedUser = { 
        ...user, 
        fullName: profileForm.fullName,
        avatar: avatarUrl // Giữ nguyên avatar hiện tại
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      window.dispatchEvent(new Event('user-updated'));
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage(""); 
    setError("");

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
      await axios.put(
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

  // Function để refresh avatar mới - FIXED
  const refreshAvatar = () => {
    setAvatarLoading(true);
    
    // Tạo seed hoàn toàn ngẫu nhiên để đảm bảo avatar mới
    const randomString = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const newSeed = `user${Date.now()}${randomString}`;
    
    console.log("Generating new avatar with seed:", newSeed); // Debug
    
    const newAvatarUrl = generateRandomAvatar(newSeed, 120);
    console.log("New avatar URL:", newAvatarUrl); // Debug
    
    setAvatarUrl(newAvatarUrl);
    
    // Test load ảnh mới
    const img = new Image();
    img.onload = () => {
      console.log("New avatar loaded successfully");
      setAvatarLoading(false);
      // Cập nhật avatar mới cho cả user
      updateUserAvatar(newAvatarUrl);
    };
    img.onerror = (err) => {
      console.log("New avatar failed to load:", err);
      setAvatarLoading(false);
      // Fallback nếu lỗi
      const fallbackAvatar = `https://ui-avatars.com/api/?name=User${Date.now()}&background=FF6B6B&color=000&size=120&bold=true`;
      setAvatarUrl(fallbackAvatar);
      updateUserAvatar(fallbackAvatar);
    };
    img.src = newAvatarUrl;
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
            {/* Avatar Section */}
            <div className="position-relative d-inline-block mb-4">
              {avatarUrl && !avatarLoading ? (
                <img
                  src={avatarUrl}
                  alt="Profile Avatar"
                  className="rounded-circle border border-3 border-warning"
                  style={{
                    width: "120px",
                    height: "120px",
                    objectFit: "cover"
                  }}
                  onError={(e) => {
                    console.log("Image error, showing fallback");
                    e.target.style.display = 'none';
                  }}
                />
              ) : (
                <div
                  className="rounded-circle border border-3 border-warning d-flex align-items-center justify-content-center bg-dark"
                  style={{
                    width: "120px",
                    height: "120px"
                  }}
                >
                  {avatarLoading ? (
                    <div className="spinner-border spinner-border-sm text-warning" />
                  ) : (
                    <User size={48} className="text-warning" />
                  )}
                </div>
              )}
              
              {/* Refresh Avatar Button */}
              <Button
                variant="outline-warning"
                size="sm"
                className="position-absolute bottom-0 end-0 rounded-circle"
                style={{ width: "36px", height: "36px" }}
                onClick={refreshAvatar}
                title="Generate new avatar"
                disabled={avatarLoading}
              >
                {avatarLoading ? (
                  <div className="spinner-border spinner-border-sm" style={{ width: '12px', height: '12px' }} />
                ) : (
                  <RefreshCw size={16} />
                )}
              </Button>
            </div>

            <h2 className="auth-title">{user?.fullName || 'User'}</h2>
            <p className="text-white opacity-80">{user?.email}</p>
            <p className="text-white opacity-60 small">Manage your account information</p>
            
            {/* Debug info - có thể xóa sau */}
            <div className="mt-2">
              <small className="text-white-50">
                Click refresh button to generate new avatar
              </small>
            </div>
          </div>

          {message && <Alert variant="success" className="mb-4">{message}</Alert>}
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          <Tabs defaultActiveKey="profile" className="mb-5 profile-tabs">
            
            {/* TAB PROFILE */}
            <Tab eventKey="profile" title="Profile Info">
              <Form onSubmit={handleUpdateProfile}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-semibold">Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) =>
                      setProfileForm({ ...profileForm, fullName: e.target.value })
                    }
                    className="form-control-custom"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-semibold">Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={profileForm.email}
                    className="form-control-custom"
                    disabled
                    style={{ opacity: 0.7, cursor: 'not-allowed' }}
                  />
                  <Form.Text className="text-white-50">
                    Email cannot be changed
                  </Form.Text>
                </Form.Group>

                <Button type="submit" className="btn-login w-100">
                  Update Profile
                </Button>
              </Form>
            </Tab>

            {/* TAB CHANGE PASSWORD */}
            <Tab eventKey="password" title="Change Password">
              <Form onSubmit={handleChangePassword}>
                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-semibold">Current Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showCurrent ? "text" : "password"}
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                      }
                      className="form-control-custom"
                      required
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-4 text-white cursor-pointer"
                      onClick={() => setShowCurrent(!showCurrent)}
                    >
                      {showCurrent ? <EyeOff size={22} /> : <Eye size={22} />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-semibold">New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showNew ? "text" : "password"}
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                      }
                      className="form-control-custom"
                      required
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-4 text-white cursor-pointer"
                      onClick={() => setShowNew(!showNew)}
                    >
                      {showNew ? <EyeOff size={22} /> : <Eye size={22} />}
                    </span>
                  </div>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label className="text-white fw-semibold">Confirm New Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      type={showConfirm ? "text" : "password"}
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                      }
                      className="form-control-custom"
                      required
                    />
                    <span
                      className="position-absolute top-50 end-0 translate-middle-y me-4 text-white cursor-pointer"
                      onClick={() => setShowConfirm(!showConfirm)}
                    >
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