'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from "next/navigation";
import { sidebarMenuAdmin } from "@/lib/data/sidebar-menu-admin";
import { 
  Home, 
  Map, 
  Image, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  FileText,
  Target,
  ChevronDown
} from 'lucide-react';
import LogoutConfirmationModal from '@/components/ui/logout-confirmation-modal';
import toast from "react-hot-toast";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [adminUsername, setAdminUsername] = useState('Admin');
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    // Load username dari localStorage
    const storedUsername = localStorage.getItem('vtourAdminUsername') || 'Admin';
    setAdminUsername(storedUsername);
  }, []);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const confirmLogout = () => {
    if (isLoggingOut) return;
    
    setIsLoggingOut(true);
    // Hapus token dan redirect seperti di settings
    localStorage.removeItem("vtourAdminToken");
    localStorage.removeItem("vtourAdminTokenTimestamp");
    localStorage.removeItem("vtourAdminUsername");
    toast.success("Berhasil logout");
    router.push("/admin/sign-in");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-blue-600 text-white p-2 rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl flex flex-col overflow-hidden z-40 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <span className="text-lg sm:text-xl font-bold">VT</span>
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-white">Virtual Tour</h1>
              <p className="text-xs sm:text-sm text-blue-200">Admin Panel</p>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-2 sm:px-4 flex-1 py-4 sm:py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-800">
          <ul className="space-y-1 sm:space-y-2">
            {sidebarMenuAdmin.map((item) => (
              <li key={item.label}>
                {item.children ? (
                  <>
                    <button
                      onClick={() => setOpen(open === item.label ? null : item.label)}
                      className="flex w-full items-center justify-between px-3 sm:px-4 py-2 sm:py-3 text-left text-xs sm:text-sm font-medium text-white rounded-lg hover:bg-white/10 transition-all duration-200"
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {item.icon && <item.icon size={18} className="text-blue-200 sm:w-5 sm:h-5" />}
                        <span className="truncate">{item.label}</span>
                      </div>
                      <ChevronDown
                        className={`h-3 w-3 sm:h-4 sm:w-4 transform transition-transform duration-200 text-blue-200 ${
                          open === item.label ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {open === item.label && (
                      <ul className="ml-4 sm:ml-6 mt-1 sm:mt-2 space-y-1 border-l border-blue-700 pl-3 sm:pl-4">
                        {item.children.map((child) => (
                          <li key={child.label}>
                            <Link
                              href={child.href}
                              onClick={() => setSidebarOpen(false)}
                              className={`flex items-center gap-2 sm:gap-3 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium transition-all duration-200 ${
                                pathname.startsWith(child.href)
                                  ? "bg-white/20 text-white shadow-sm"
                                  : "text-blue-200 hover:bg-white/10 hover:text-white"
                              }`}
                            >
                              {child.icon && <child.icon size={14} className="sm:w-4 sm:h-4" />}
                              <span className="truncate">{child.label}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex w-full items-center gap-2 sm:gap-3 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all duration-200 ${
                      pathname.startsWith(item.href)
                        ? "bg-white/20 text-white shadow-sm"
                        : "text-blue-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.icon && <item.icon size={18} className="sm:w-5 sm:h-5" />}
                    <span className="truncate">{item.label}</span>
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer with User Info and Logout */}
        <div className="border-t border-blue-700 p-3 sm:p-4">
          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-full flex items-center justify-center">
              <User size={16} className="text-white sm:w-[18px] sm:h-[18px]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm font-medium text-white truncate">{adminUsername}</p>
              <p className="text-xs text-blue-200 truncate">Virtual Tour Manager</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm text-red-200 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-all duration-200 border border-red-400/30 hover:border-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut size={14} className="sm:w-4 sm:h-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={confirmLogout}
        title="Konfirmasi Logout"
        message="Apakah Anda yakin ingin keluar dari sistem? Semua data yang belum disimpan akan hilang."
        confirmText="Ya, Logout"
        cancelText="Batal"
      />
    </>
  );
}
