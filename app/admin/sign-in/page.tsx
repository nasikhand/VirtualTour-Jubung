"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { authAPI } from "@/lib/api-client";

export default function AdminSignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    captcha: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [captchaQuestion, setCaptchaQuestion] = useState("");
  const [captchaAnswer, setCaptchaAnswer] = useState(0);

  // Generate captcha
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];
    
    let answer;
    switch (operator) {
      case '+':
        answer = num1 + num2;
        break;
      case '-':
        answer = num1 - num2;
        break;
      case '*':
        answer = num1 * num2;
        break;
      default:
        answer = num1 + num2;
    }
    
    setCaptchaQuestion(`${num1} ${operator} ${num2} = ?`);
    setCaptchaAnswer(answer);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validasi captcha terlebih dahulu
      if (parseInt(formData.captcha) !== captchaAnswer) {
        toast.error("Captcha salah! Silakan coba lagi.");
        generateCaptcha(); // Generate captcha baru
        setFormData(prev => ({ ...prev, captcha: "" })); // Reset captcha input
        setIsLoading(false);
        return;
      }

      // Login menggunakan API backend
      try {
        const response = await authAPI.login(formData.username, formData.password);
        
        // Simpan token dari response
        localStorage.setItem("adminToken", response.access_token);
        toast.success("Login berhasil!");
        
        // Redirect ke admin dashboard
        setTimeout(() => {
          window.location.href = "/admin";
        }, 1000);
      } catch (apiError: any) {
        const errorMessage = apiError.response?.data?.message || "Username atau password salah!";
        toast.error(errorMessage);
        generateCaptcha(); // Generate captcha baru setelah login gagal
        setFormData(prev => ({ ...prev, captcha: "" })); // Reset captcha input
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat login");
      generateCaptcha(); // Generate captcha baru setelah error
      setFormData(prev => ({ ...prev, captcha: "" })); // Reset captcha input
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
          <p className="text-gray-600">Virtual Tour Kebun Jubung</p>
          <p className="text-sm text-gray-500 mt-2">PMM Jember</p>
        </div>

        <div className="bg-white shadow-lg rounded-lg">
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="captcha" className="block text-sm font-medium text-gray-700">Captcha</label>
                <div className="flex items-center space-x-3">
                  <div className="bg-gray-100 px-4 py-2 rounded-md border font-mono text-lg font-bold text-gray-800 min-w-[120px] text-center">
                    {captchaQuestion}
                  </div>
                  <input
                    id="captcha"
                    name="captcha"
                    type="number"
                    placeholder="Jawaban"
                    value={formData.captcha}
                    onChange={handleInputChange}
                    required
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      generateCaptcha();
                      setFormData(prev => ({ ...prev, captcha: "" }));
                    }}
                    className="px-3 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded-md transition-colors"
                    title="Generate captcha baru"
                  >
                    🔄
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Login"}
              </button>
            </form>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 font-medium mb-2">Demo Credentials:</p>
              <p className="text-xs text-gray-500">Username: admin</p>
              <p className="text-xs text-gray-500">Password: admin123</p>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Nanti akan terintegrasi dengan sistem login web utama
              </p>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}