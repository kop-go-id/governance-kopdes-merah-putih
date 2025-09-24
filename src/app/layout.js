'use client';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { usePathname } from 'next/navigation';
import { ConfigProvider } from 'antd';
import './globals.css';
import { AuthProvider } from '../contexts/AuthContext';
import LayoutWrapper from '../components/LayoutWrapper';

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ['latin'] });

// Ant Design theme configuration
const antdTheme = {
  token: {
    fontFamily: plusJakartaSans.style.fontFamily,
    colorPrimary: '#065366', // Teal Blue
    colorSuccess: '#a0ba3b', // Sushi
    colorWarning: '#e5a80e', // Gamboge
    colorError: '#d47800', // Mango Tango
    borderRadius: 6,
  },
  components: {
    Button: {
      borderRadius: 6,
    },
    Input: {
      borderRadius: 6,
    },
    Form: {
      itemMarginBottom: 24,
    },
  },
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="en">
      <body className={plusJakartaSans.className}>
        <AuthProvider>
          <ConfigProvider theme={antdTheme}>
            <LayoutWrapper>
              {children}
            </LayoutWrapper>
          </ConfigProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
