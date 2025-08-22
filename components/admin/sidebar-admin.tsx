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
    localStorage.removeItem("adminToken");
    toast.success("Berhasil logout");
    router.push("/admin/sign-in");
  };



  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold text-blue-700">Virtual Tour</h1>
        <p className="text-sm text-gray-500">Admin Panel</p>
      </div>
      
      {/* Navigation */}
      <nav className="px-2 flex-1 py-4">
        <ul className="space-y-1">
          {sidebarMenuAdmin.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setOpen(open === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon && <item.icon size={18} />}
                      {item.label}
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transform transition ${
                        open === item.label ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {open === item.label && (
                    <ul className="ml-4 mt-1 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.label}>
                          <Link
                            href={child.href}
                            className={`flex items-center gap-3 rounded px-3 py-2 text-xs font-medium ${
                              pathname.startsWith(child.href)
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
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
                  className={`flex w-full items-center gap-3 rounded px-3 py-2 text-sm font-medium ${
                    pathname.startsWith(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.icon && <item.icon size={18} />}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer with User Info and Logout */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={16} className="text-blue-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">Admin</p>
            <p className="text-xs text-gray-500">Virtual Tour Manager</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}
