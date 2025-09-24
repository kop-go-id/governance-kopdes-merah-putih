'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './DashboardLayout';

const LayoutWrapper = ({ children }) => {
  const pathname = usePathname();

  // Pages that should not use the dashboard layout
  const publicPages = ['/login', '/register', '/'];

  const shouldUseDashboardLayout = !publicPages.includes(pathname);

  if (shouldUseDashboardLayout) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return children;
};

export default LayoutWrapper;
