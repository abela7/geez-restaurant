
import React from 'react';
import Dashboard from '@/components/Dashboard';
import Layout from '@/components/Layout';
import { useLanguage, T } from '@/contexts/LanguageContext';

const AdminDashboard: React.FC = () => {
  return (
    <Layout>
      <h1 className="text-2xl font-bold mb-4">
        <T text="Ge'ez Restaurant Dashboard" />
      </h1>
      <Dashboard />
    </Layout>
  );
};

export default AdminDashboard;
