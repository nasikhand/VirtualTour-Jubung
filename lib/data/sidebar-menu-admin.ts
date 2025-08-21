// lib/data/sidebar-menu-admin.ts

export const sidebarMenuAdmin = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: "dashboard",
  },
  {
    label: "Manajemen Virtual Tour",
    children: [
      {
        label: 'Manajemen Scene',
        href: '/admin/virtual-tour-section'
      },
      {
        label: 'Manajemen Hotspot',
        href: '/admin/virtual-tour-hotspots'
      }
    ]
  },
  {
    label: "Pengaturan",
    href: "/admin/settings",
    icon: "settings",
  },
];
