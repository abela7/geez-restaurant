
import React from 'react';
import Layout from '@/components/Layout';
import Dashboard from '@/components/Dashboard';

const AdminDashboard: React.FC = () => {
  return (
    <Layout interface="admin">
      <Dashboard />
    </Layout>
  );
};

export default AdminDashboard;
