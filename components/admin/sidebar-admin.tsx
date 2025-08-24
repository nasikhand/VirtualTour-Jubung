'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { sidebarMenuAdmin } from "@/lib/data/sidebar-menu-admin";
import { ChevronDown, LogOut, User } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState<string | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("vtourAdminToken");
    toast.success("Berhasil logout");
    router.push("/admin/sign-in");
  };



  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-xl flex flex-col overflow-hidden z-40 transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-xl font-bold">VT</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">Virtual Tour</h1>
            <p className="text-sm text-blue-200">Admin Panel</p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="px-4 flex-1 py-6 overflow-y-auto scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-blue-800">
        <ul className="space-y-2">
          {sidebarMenuAdmin.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setOpen(open === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between px-4 py-3 text-left text-sm font-medium text-white rounded-lg hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon size={20} className="text-blue-200" />}
                      <span>{item.label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transform transition-transform duration-200 text-blue-200 ${
                        open === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open === item.label && (
                    <ul className="ml-6 mt-2 space-y-1 border-l border-blue-700 pl-4">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                              pathname.startsWith(child.href)
                                ? "bg-white/20 text-white shadow-sm"
                                : "text-blue-200 hover:bg-white/10 hover:text-white"
                            }`}
                          >
                            {child.icon && <child.icon size={16} />}
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  href={item.href}
                  className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    pathname.startsWith(item.href)
                      ? "bg-white/20 text-white shadow-sm"
                      : "text-blue-200 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {item.icon && <item.icon size={20} />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with User Info and Logout */}
      <div className="border-t border-blue-700 p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-white">Admin</p>
            <p className="text-xs text-blue-200">Virtual Tour Manager</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-200 hover:bg-red-500/20 hover:text-red-100 rounded-lg transition-all duration-200 border border-red-400/30 hover:border-red-300"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
