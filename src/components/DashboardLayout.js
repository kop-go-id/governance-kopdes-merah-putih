'use client';

import { Layout } from 'antd';
import Sidebar from './Sidebar';
import DashboardNavbar from './DashboardNavbar';
import Card from 'antd/es/card/Card';

const { Content } = Layout;

const DashboardLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen dashboard-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Layout */}
      <div className="flex-1 flex flex-col">
        {/* Navbar */}
        <DashboardNavbar />

        {/* Main Content */}
        <Content className="flex-1 bg-secondary dashboard-content px-4">
          <Card
            className="h-[calc(100vh-88px)] overflow-y-auto"
            style={{ borderRadius: '20px !important' }}
          >
            {children}
          </Card>
        </Content>
      </div>
    </div>
  );
};

export default DashboardLayout;
