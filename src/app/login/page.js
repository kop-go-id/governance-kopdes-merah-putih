"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Image from "next/image";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Zod validation schema
const loginSchema = z.object({
  email: z.string().email("Email tidak valid").min(1, "Email harus diisi"),
  password: z.string().min(6, "Password minimal 6 karakter").min(1, "Password harus diisi"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    try {
      const token = await executeRecaptcha("login");
      setRecaptchaToken(token);
      console.log("Login data:", { ...data, recaptchaToken: token });
      // Handle login logic here
    } catch (error) {
      console.error("ReCaptcha error:", error);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-500 to-teal-700 items-center justify-center p-8">
        <div className="relative">
          {/* Floating bubbles */}
          <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/10 rounded-full"></div>
          <div className="absolute top-20 -right-16 w-16 h-16 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-8 left-16 w-12 h-12 bg-white/10 rounded-full"></div>
          <div className="absolute bottom-20 -right-8 w-8 h-8 bg-white/10 rounded-full"></div>
          
          {/* Main illustration */}
          <div className="relative z-10">
            <div className="w-80 h-80 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-64 h-64 bg-white/30 rounded-full flex items-center justify-center">
                {/* Person with laptop illustration */}
                <div className="text-center">
                  <div className="w-32 h-32 bg-white/40 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <div className="w-20 h-20 bg-orange-400 rounded-full"></div>
                  </div>
                  <div className="w-24 h-16 bg-gray-600 rounded-lg mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-gray-900">
              Masuk ke akun Untuk mengikuti
            </h1>
            <h2 className="text-2xl font-bold text-gray-900">
              Uji Kelayakan Dan Kepatutan
            </h2>
          </div>

          {/* Login Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Email atau Username
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        placeholder="Masukkan email atau username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      Kata Sandi
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Masukkan kata sandi"
                          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg
                            className="h-5 w-5 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {showPassword ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            )}
                          </svg>
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm" />
                  </FormItem>
                )}
              />

              {/* ReCaptcha Notice */}
              <div className="text-xs text-gray-500 text-center">
                Situs ini dilindungi oleh reCAPTCHA dan berlaku{" "}
                <a href="https://policies.google.com/privacy" className="text-teal-600 hover:text-teal-700">
                  Kebijakan Privasi
                </a>{" "}
                dan{" "}
                <a href="https://policies.google.com/terms" className="text-teal-600 hover:text-teal-700">
                  Persyaratan Layanan
                </a>{" "}
                Google.
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Ingat saya
                </label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
              >
                Masuk
              </Button>

              {/* Footer Links */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Belum punya akun?{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-700 font-medium">
                    Daftar di sini
                  </a>
                </p>
                <p className="text-xs text-gray-500">
                  Dengan masuk, Anda menyetujui{" "}
                  <a href="#" className="text-teal-600 hover:text-teal-700">
                    Syarat dan Ketentuan
                  </a>
                </p>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}