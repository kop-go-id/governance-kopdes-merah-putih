'use client';

import { useState } from 'react';
import { Card, Button, Select, Table, Empty } from 'antd';
import {
  PlusOutlined,
  FileTextOutlined,
  CalendarOutlined,
  CalendarFilled,
} from '@ant-design/icons';
import Image from 'next/image';

const { Option } = Select;

const FormulirPengawasan = () => {
  const [selectedYear, setSelectedYear] = useState('2024');
  const [data, setData] = useState([]);

  // Table columns matching the design
  const columns = [
    {
      title: 'No',
      dataIndex: 'no',
      key: 'no',
      width: 60,
      align: 'center',
    },
    {
      title: 'Tahun',
      dataIndex: 'tahun',
      key: 'tahun',
      width: 100,
      align: 'center',
    },
    {
      title: 'Tanggal Pengisian',
      dataIndex: 'tanggalPengisian',
      key: 'tanggalPengisian',
      width: 150,
      align: 'center',
    },
    {
      title: 'Aspek Kelembagaan',
      dataIndex: 'aspekKelembagaan',
      key: 'aspekKelembagaan',
      width: 150,
      align: 'center',
    },
    {
      title: 'Aspek Keuangan',
      dataIndex: 'aspekKeuangan',
      key: 'aspekKeuangan',
      width: 150,
      align: 'center',
    },
    {
      title: 'Aspek Operasional',
      dataIndex: 'aspekOperasional',
      key: 'aspekOperasional',
      width: 150,
      align: 'center',
    },
    {
      title: 'Opsi',
      dataIndex: 'opsi',
      key: 'opsi',
      width: 100,
      align: 'center',
      render: () => (
        <Button type="link" size="small">
          Detail
        </Button>
      ),
    },
  ];

  const handleAddFormulir = () => {
    // Handle add new formulir logic
    console.log('Add new formulir');
  };

  // Get current year and generate array of past 5 years
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = 0; i <= 5; i++) {
      years.push((currentYear - i).toString());
    }
    return years;
  };

  const yearOptions = generateYearOptions();

  return (
    <div className="container mx-auto">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Formulir Pengawasan
        </h2>

        <div className="flex items-center gap-4">
          <Select
            value={selectedYear}
            onChange={setSelectedYear}
            className="w-100 border-0 font-bold shadow-md rounded-[8px] text-primary"
            bordered={false}
            showArrow={false}
            size="middle"
            prefix={<CalendarFilled className="mr-1 text-primary" />}
          >
            {yearOptions.map((year) => (
              <Option key={year} value={year}>
                Tahun {year}
              </Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            href="formulir-pengawasan/buat"
          >
            Isi Formulir
          </Button>
        </div>
      </div>

      {/* Main Content Card */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          pagination={true}
          locale={{
            emptyText: (
              <Empty
                image={
                  <div className="flex justify-center mb-10 w-full">
                    <Image
                      src="/assets/images/data-not-found.png"
                      alt="Empty State"
                      width={85}
                      height={85}
                    />
                  </div>
                }
                description={
                  <div className="text-center">
                    <h3 className="text-lg font-medium text-gray-600 mb-2">
                      Formulir Pengawasan Belum diisi
                    </h3>
                    <Button
                      type="primary"
                      onClick={handleAddFormulir}
                      className="bg-primary w-72"
                    >
                      Isi Formulir
                    </Button>
                  </div>
                }
              />
            ),
          }}
          className="rounded-[20px]"
        />
      </div>
    </div>
  );
};

export default FormulirPengawasan;
