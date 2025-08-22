// lib/data/sidebar-menu-admin.ts
import { LayoutDashboard, Camera, MapPin, Settings, Image, Menu } from "lucide-react";

export const sidebarMenuAdmin = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Manajemen Virtual Tour",
    icon: Camera,
    children: [
      {
        label: 'Manajemen Scene',
        href: '/admin/virtual-tour-section',
        icon: Image
      },
      {
        label: 'Manajemen Menu',
        href: '/admin/virtual-tour-hotspots',
        icon: Menu
      }
    ]
  },
  {
    label: "Pengaturan",
    href: "/admin/settings",
    icon: Settings,
  },
];
