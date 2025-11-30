// src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import axios from "axios";

export default function PaymentSuccess() {

    useEffect(() => {
        const url = new URL(window.location.href);

        const paymentId = url.searchParams.get("paymentId"); // PayPal paymentId
        const templateId = parseInt(url.searchParams.get("templateId") || "0"); // templateId

        if (!paymentId || !templateId) {
            alert("Payment ID or Template ID missing.");
            return;
        }

        const token = localStorage.getItem("token"); // JWT token đã lưu

        // Gọi API execute payment
        axios.post(
            `${import.meta.env.VITE_API_URL}/paypal/execute`,
            {
                paymentId,
                templateId,
                recipientEmail: "", 
                subject: "",
                message: ""
            },
            {
                headers: { Authorization: `Bearer ${token}` }
            }
        )
        .then(() => {
            localStorage.setItem("paid", "true");
            // Redirect về trang edit trước đó
            window.location.href = `/edit/${templateId}`; 
        })
        .catch(err => {
            console.error("Payment execution failed:", err.response?.data || err);
            alert(err.response?.data?.message || "Payment execution failed.");
        });

    }, []);

    return null; // không hiển thị gì cả, redirect ngay
}
