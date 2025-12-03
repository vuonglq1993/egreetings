import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
  
    try {
      const decoded = jwtDecode(token);
      console.log("Token đã decode (kiểu .NET):", decoded);
  
      // Xử lý đúng các claim của .NET
      const userData = {
        token,
        isAuthenticated: true,
        id: decoded.fid || decoded.sub || decoded.nameidentifier || null,
        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || 
              decoded.name || 
              "User",
        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || 
               decoded.email || 
               null,
        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || 
              decoded.role || 
              "User",
        // để nguyên các field khác nếu cần
        ...decoded,
      };
  
      console.log("User object đã set:", userData);
      setUser(userData);
  
    } catch (err) {
      console.error("Token không hợp lệ:", err);
      localStorage.removeItem("token");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email,
        password,
      });

      const { token, user: userData } = res.data;
      localStorage.setItem("token", token);
      const decoded = jwtDecode(token);
      setUser({ ...decoded, ...userData, token }); // gộp cả thông tin từ token + backend trả thêm
      toast.success("Đăng nhập thành công!");
      return true;
    } catch (err) {
      toast.error(err.response?.data?.message || "Sai email hoặc mật khẩu");
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    toast.info("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};