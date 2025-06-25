import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider, RequireAuth } from './contexts/AuthContext';
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginPage from "./pages/LoginPage";
import NotFoundPage from "./pages/NotFoundPage";

// Lazy load all pages
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));
const ClientsPage = React.lazy(() => import("./pages/ClientsPage"));
const ServicesPage = React.lazy(() => import("./pages/ServicesPage"));
const InvoicesPage = React.lazy(() => import("./pages/InvoicesPage"));
const SettingsPage = React.lazy(() => import("./pages/SettingsPage"));

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<RequireAuth><Layout /></RequireAuth>}>
            <Route index element={
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardPage />
              </Suspense>
            } />
            <Route path="clients" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ClientsPage />
              </Suspense>
            } />
            <Route path="services" element={
              <Suspense fallback={<LoadingSpinner />}>
                <ServicesPage />
              </Suspense>
            } />
            <Route path="invoices" element={
              <Suspense fallback={<LoadingSpinner />}>
                <InvoicesPage />
              </Suspense>
            } />
            <Route path="settings" element={
              <Suspense fallback={<LoadingSpinner />}>
                <SettingsPage />
              </Suspense>
            } />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
