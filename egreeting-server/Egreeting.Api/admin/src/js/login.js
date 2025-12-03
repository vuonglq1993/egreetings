const loginForm = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const errorText = errorMsg.querySelector("span");

loginForm.addEventListener("submit", async (e) => {
e.preventDefault();


errorMsg.style.display = "none";  
errorText.textContent = "";  

const email = document.getElementById("email").value.trim();  
const password = document.getElementById("password").value.trim();  

try {  
    const res = await fetch("http://localhost:5288/api/auth/login", {  
        method: "POST",  
        headers: { "Content-Type": "application/json" },  
        body: JSON.stringify({ email, password })  
    });  
  
    // Kiểm tra content-type trước khi parse JSON
    const contentType = res.headers.get("content-type");
    let data;
    
    if (contentType && contentType.includes("application/json")) {
        data = await res.json();
    } else {
        // Nếu không phải JSON, đọc text
        const text = await res.text();
        console.error("Non-JSON response:", text);
        errorText.textContent = "Server error: " + (text.substring(0, 100) || "Unknown error");
        errorMsg.style.display = "flex";
        return;
    }
    
    console.log("Response from API:", data);

    if (!res.ok) {  
        errorText.textContent = data.message || "Sai email hoặc mật khẩu!";  
        errorMsg.style.display = "flex";  
        return;  
    }  

    // Kiểm tra token và role có tồn tại  
    if (!data.token || !data.role) {  
        errorText.textContent = "Server không trả đầy đủ thông tin đăng nhập!";  
        errorMsg.style.display = "flex";  
        return;  
    }  

    // So sánh role đúng (chữ thường)  
    if (data.role.toLowerCase() !== "admin") {  
        errorText.textContent = "Bạn không có quyền Admin!";  
        errorMsg.style.display = "flex";  
        return;  
    }  

    // Lưu token và role vào localStorage  
    localStorage.setItem("token", data.token);  
    localStorage.setItem("role", data.role);  

    // Điều hướng tới trang admin dashboard  
    window.location.href = "index.html";  

} catch (err) {  
    console.error("Login error:", err);  
    if (err.message && err.message.includes("Failed to fetch")) {
        errorText.textContent = "Không thể kết nối đến server! Vui lòng kiểm tra server có đang chạy không.";
    } else {
        errorText.textContent = "Lỗi kết nối server: " + (err.message || "Unknown error");
    }
    errorMsg.style.display = "flex";  
}  


});
