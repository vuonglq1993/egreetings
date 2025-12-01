// src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import axios from "axios";

export default function PaymentSuccess() {

    useEffect(() => {
        const url = new URL(window.location.href);

        // Template flow
        const paymentId = url.searchParams.get("paymentId");
        const templateId = parseInt(url.searchParams.get("templateId") || "0");

        // Package flow
        const packagePaymentId = url.searchParams.get("paymentId");
        const packageId = parseInt(url.searchParams.get("packageId") || "0");

        const token = localStorage.getItem("token");

        if (!paymentId && !packagePaymentId) {
            alert("Missing payment ID.");
            return;
        }

        // ============================
        // TEMPLATE PAYMENT EXECUTION
        // ============================
        if (templateId && paymentId) {
            axios.post(
                `${import.meta.env.VITE_API_URL}/paypal/execute`,
                {
                    paymentId,
                    templateId,
                    recipientEmail: "",
                    subject: "",
                    message: ""
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                localStorage.setItem("paid", "true");
                window.location.href = `/edit/${templateId}`;
            })
            .catch(err => {
                console.error("Payment execution failed:", err.response?.data || err);
                alert(err.response?.data?.message || "Payment execution failed.");
            });

            return;
        }

        // ============================
        // PACKAGE PAYMENT EXECUTION
        // ============================
        if (packageId && packagePaymentId) {
            axios.post(
                `${import.meta.env.VITE_API_URL}/paypal/execute-package`,
                {
                    paymentId: packagePaymentId,
                    packageId
                },
                { headers: { Authorization: `Bearer ${token}` } }
            )
            .then(() => {
                alert("Subscription activated!");
                window.location.href = "/my-subscription";
            })
            .catch(err => {
                console.error("Subscription payment failed:", err.response?.data || err);
                alert(err.response?.data?.message || "Payment execution failed.");
            });
        }

    }, []);

    return null;
}
