// src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import axios from "axios";

export default function PaymentSuccess() {
  useEffect(() => {
    const url = new URL(window.location.href);

    // ===== TEMPLATE FLOW =====
    const templatePaymentId = url.searchParams.get("paymentId");
    const templateId = parseInt(url.searchParams.get("templateId") || "0");

    // ===== PACKAGE FLOW =====
    const packagePaymentId = url.searchParams.get("packagePaymentId");
    const packageId = parseInt(url.searchParams.get("packageId") || "0");
    const subscriptionId = parseInt(url.searchParams.get("subId") || "0");

    const token = localStorage.getItem("token");

    // If nothing is present → error
    if (!templatePaymentId && !packagePaymentId) {
      alert("Missing payment ID.");
      return;
    }

    // ============================
    // TEMPLATE PAYMENT EXECUTION
    // ============================
    if (templateId && templatePaymentId) {
      axios.post(
        `${import.meta.env.VITE_API_URL}/paypal/execute`,
        {
          paymentId: templatePaymentId,
          templateId,
          recipientEmail: "",
          subject: "",
          message: ""
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        // Mark paid for editor
        sessionStorage.setItem(`paid_template_${templateId}`, "true");

        // Tell editor to auto-export
        sessionStorage.setItem(`template_${templateId}_auto_export`, "true");

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
      if (!subscriptionId) {
        console.error("Missing subscriptionId from redirect URL");
        alert("Missing subscription info.");
        return;
      }

      axios.post(
        `${import.meta.env.VITE_API_URL}/paypal/execute-package`,
        {
          paymentId: packagePaymentId,
          packageId,
          subscriptionId
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
