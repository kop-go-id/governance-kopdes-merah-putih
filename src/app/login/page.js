'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, message, Card } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import Captcha from '@/components/Captcha';
import Image from 'next/image';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [form] = Form.useForm();
  const [captchaText, setCaptchaText] = useState('');
  const [errorCount, setErrorCount] = useState(0);
  const router = useRouter();
  const { login, isAuthenticated, isLoading } = useAuth();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/'); // Redirect to dashboard or home page
    }
  }, [isAuthenticated, router]);

  const onFinish = async (values) => {
    if (values.captcha.toLowerCase() !== captchaText.toLowerCase()) {
      form.setFields([
        {
          name: 'captcha',
          errors: ['Kode yang anda masukkan salah. Silahkan masukkan kembali'],
        },
      ]);
      return;
    }

    try {
      await login(values);
      router.push('/'); // Redirect to dashboard after successful login
    } catch (error) {
      setErrorCount((prev) => prev + 1); // Refresh captcha on error
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    message.error('Mohon periksa kembali data yang dimasukkan');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:block lg:w-1/2 bg-[#f2f3f7] py-36 px-32">
        <div className="relative text-black">
          <div className="logo-wrapper flex items-center justify-start gap-4">
            <Image
              src="/assets/logo/kemenkop.png"
              alt="Logo Kementerian Koperasi"
              width={100}
              height={100}
              priority
              className="object-contain"
            />
            <Image
              src="/assets/logo/kopdes-merahputih.png"
              alt="Logo Kopdes Merah Putih"
              width={100}
              height={100}
              priority
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Lembar Kerja Internal Pengawasan Koperasi Desa/Kelurahan Merah Putih
          </h1>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          <Card className="bg-secondary rounded-[20px]">
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Masuk ke akun
            </h2>
            {/* Login Form */}
            <Form
              form={form}
              name="login"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              className="space-y-6"
            >
              {/* Email Field */}
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Email atau Username
                  </span>
                }
                name="email"
                rules={[
                  { required: true, message: 'Email harus diisi!' },
                  { type: 'email', message: 'Format email tidak valid!' },
                ]}
              >
                <Input
                  placeholder="Masukkan email atau username"
                  className="w-full text-sm"
                  size="large"
                />
              </Form.Item>

              {/* Password Field */}
              <Form.Item
                label={
                  <span className="text-sm font-medium text-gray-700">
                    Kata Sandi
                  </span>
                }
                name="password"
                rules={[
                  { required: true, message: 'Password harus diisi!' },
                  { min: 6, message: 'Password minimal 6 karakter!' },
                ]}
              >
                <Input.Password
                  placeholder="Masukkan kata sandi"
                  className="w-full text-sm"
                  size="large"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              {/* Captcha */}
              <Captcha onGenerate={setCaptchaText} refreshCount={errorCount} />
              <div className="text-sm text-left">
                Untuk menjamin keamanan, isikan kode diatas!
              </div>
              <Form.Item
                name="captcha"
                rules={[
                  {
                    required: true,
                    message: 'Masukkan kode anda terlebih dahulu',
                  },
                ]}
              >
                <Input
                  placeholder="Kode keamanan"
                  maxLength={6}
                  onInput={(e) =>
                    (e.target.value = e.target.value.toUpperCase())
                  }
                />
              </Form.Item>

              {/* Submit Button */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                  size="large"
                  className="w-full"
                >
                  Masuk
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </div>
      </div>
    </div>
  );
}
