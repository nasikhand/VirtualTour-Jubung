'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenuAdmin } from "@/lib/data/sidebar-menu-admin";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function SidebarAdmin() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);

  return (
    <aside className="h-screen w-64 bg-white border-r shadow-sm">
      <div className="p-4 text-xl font-bold text-blue-700">Admin Panel</div>
      <nav className="px-2">
        <ul className="space-y-1">
          {sidebarMenuAdmin.map((item) => (
            <li key={item.label}>
              {item.children ? (
                <>
                  <button
                    onClick={() => setOpen(open === item.label ? null : item.label)}
                    className="flex w-full items-center justify-between px-3 py-2 text-left text-sm font-medium text-gray-700 rounded hover:bg-gray-100"
                  >
                    {item.label}
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
                            className={`block rounded px-3 py-2 text-xs font-medium ${
                              pathname.startsWith(child.href)
                                ? "bg-blue-100 text-blue-700"
                                : "text-gray-600 hover:bg-gray-50"
                            }`}
                          >
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
                  className={`flex w-full items-center rounded px-3 py-2 text-sm font-medium ${
                    pathname.startsWith(item.href)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
