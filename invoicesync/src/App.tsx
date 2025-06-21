import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import LoadingSpinner from "./components/LoadingSpinner";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ClientsPage from "./pages/ClientsPage";
import ClientFormPage from "./pages/ClientFormPage";
import ClientDetailPage from "./pages/ClientDetailPage";
import ServicesPage from "./pages/ServicesPage";
import ServiceFormPage from "./pages/ServiceFormPage";
import ServiceDetailPage from "./pages/ServiceDetailPage";
import InvoicesPage from "./pages/InvoicesPage";
import InvoiceFormPage from "./pages/InvoiceFormPage";
import InvoiceDetailPage from "./pages/InvoiceDetailPage";
import NotFoundPage from "./pages/NotFoundPage";
import SettingsPage from "./pages/SettingsPage";

// Lazy load Dashboard page
const DashboardPage = React.lazy(() => import("./pages/DashboardPage"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <DashboardPage />
            </Suspense>
          } />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/new" element={<ClientFormPage />} />
          <Route path="clients/:id/edit" element={<ClientFormPage edit />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="services/new" element={<ServiceFormPage />} />
          <Route path="services/:id/edit" element={<ServiceFormPage edit />} />
          <Route path="services/:id" element={<ServiceDetailPage />} />
          <Route path="invoices" element={<InvoicesPage />} />
          <Route path="invoices/new" element={<InvoiceFormPage />} />
          <Route path="invoices/:id" element={<InvoiceDetailPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
