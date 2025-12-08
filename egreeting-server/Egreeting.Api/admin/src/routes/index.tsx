// src/routes/index.tsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

//Protected route
import ProtectedRoute from '@/components/ProtectedRoute';
// Layout
import AdminLayout from '@/components/layout/AdminLayout';

// Pages
import DashboardPage from '@/pages/Dashboard';
import CategoriesPage from '@/pages/Categories';
import FeedbacksPage from '@/pages/Feedbacks/feedback';
import PackagesPage from '@/pages/Packages';
import ReportsPage from '@/pages/Reports';
import SettingsPage from '@/pages/Settings';
import TemplatesPage from '@/pages/Templates';
import UsersPage from '@/pages/Users';
import TransactionsPage from '@/pages/Transactions';
import SubscriptionsPage from '@/pages/Subscriptions';
import LoginPage from '@/pages/Login';

const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Public Route: Login */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Admin Routes - All use AdminLayout */}
            <Route
                element={
                    // <ProtectedRoute>
                        <AdminLayout />
                    // </ProtectedRoute>
                }
            >        {/* Default admin route */}
                <Route path="/admin" element={<DashboardPage />} />

                {/* Feature Routes */}
                <Route path="/admin/categories" element={<CategoriesPage />} />
                <Route path="/admin/feedbacks" element={<FeedbacksPage />} />
                <Route path="/admin/packages" element={<PackagesPage />} />
                <Route path="/admin/templates" element={<TemplatesPage />} />
                <Route path="/admin/users" element={<UsersPage />} />
                <Route path="/admin/transactions" element={<TransactionsPage />} />
                <Route path="/admin/subscriptions" element={<SubscriptionsPage />} />
                <Route path="/admin/reports" element={<ReportsPage />} />
                <Route path="/admin/settings" element={<SettingsPage />} />

                {/* Catch-all for unknown /admin/* routes → back to Dashboard */}
                <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
            </Route>

            {/* Root redirect */}
            <Route path="/" element={<Navigate to="/admin" replace />} />

            {/* Catch-all for any other routes (404) → redirect to Dashboard if logged in, else Login */}
            <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
    );
};

export default AppRoutes;