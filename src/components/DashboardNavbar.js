'use client';

import { Dropdown, Avatar, Button } from 'antd';
import {
  UserOutlined,
  DownOutlined,
  LogoutOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { useAuth } from '@/contexts/AuthContext';
import Card from 'antd/es/card/Card';

const DashboardNavbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Settings',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="h-16 flex items-center justify-between py-12 px-4">
      {/* Page Title */}
      <div className="flex items-center">
        <h1 className="text-3xl font-semibold text-primary">Simkopdes</h1>
      </div>

      {/* User Profile Section */}
      <Card
        style={{ borderRadius: '20px !important' }}
        styles={{ body: { padding: '12px 8px' } }}
      >
        <Dropdown
          menu={{ items: userMenuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <Button
            type="text"
            className="flex items-center gap-2 px-3 py-2 rounded-lg"
          >
            <Avatar
              size="small"
              icon={<UserOutlined />}
              className="bg-primary"
            />
            <div className="flex flex-col items-start">
              <span className="text-sm font-medium text-primary">
                {user?.name || 'User Name'}
              </span>
              <span className="text-xs text-gray-500">
                {user?.roles?.[0]?.role_position || 'User'}
              </span>
            </div>
            <DownOutlined className="text-xs text-gray-400" />
          </Button>
        </Dropdown>
      </Card>
    </div>
  );
};

export default DashboardNavbar;
