'use client';

import {
  AuditOutlined,
  FileTextOutlined,
  HomeFilled,
  SendOutlined,
} from '@ant-design/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const Sidebar = () => {
  const pathname = usePathname();

  // Routes configuration
  const routes = [
    {
      name: 'Formulir Pengawasan',
      href: '/formulir-pengawasan',
      icon: HomeFilled,
    },
    {
      name: 'Dokumen Pendukung',
      href: '/dokumen-pendukung',
      icon: SendOutlined,
    },
    {
      name: 'Temuan dan Rekomendasi',
      href: '/temuan-rekomendasi',
      icon: AuditOutlined,
    },
  ];

  return (
    <div className="p-3 h-screen">
      <div className="h-screen w-64 bg-primary text-white flex flex-col transition-all duration-300 rounded-[30px]">
        {/* Logo Section */}
        <div className="p-6">
          <div className="flex items-center gap-3">
            {/* Kementerian Koperasi Logo */}
            <Image
              src="/assets/logo/kopdes-merahputih-bw.png"
              alt="Logo Kementerian Koperasi"
              width={200}
              height={200}
              loading="lazy"
            />
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 py-4">
          <div className="space-y-1">
            {routes.map((route) => {
              const IconComponent = route.icon;
              const isSelected = pathname.includes(route.href);
              return (
                <Link
                  key={route.href}
                  href={route.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isSelected
                      ? 'bg-white text-primary border-s-8 border-success'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <IconComponent className="text-lg flex-shrink-0" />
                  <span
                    className={`text-sm${
                      isSelected ? 'text-primary font-semibold' : 'font-normal'
                    }`}
                  >
                    {route.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
