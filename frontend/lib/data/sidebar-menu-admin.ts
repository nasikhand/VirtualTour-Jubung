// lib/data/sidebar-menu-admin.ts

export const sidebarMenuAdmin = [
  {
    label: "Settings",
    href: "/admin/settings",
    icon: "settings", // optional, jika kamu pakai icon
  },
  {
    label: "Dashboard",
    href: "/admin",
    icon: "dashboard", // ganti sesuai ikon yang kamu pakai
  },
  {
    label: "Manage Content",
    children: [
      {
        label: "Welcome Section",
        href: "/admin/welcome-section",
      },
      {
        label: "Culinary Section",
        href: "/admin/culinary-section",
      },
      {
        label: "Event Section",
        href: "/admin/event-section",
      },
      {
        label: "Travel Map Section",
        href: "/admin/travel-map-section",
      },
      {
        label: "Articles Section",
        href: "/admin/articles-section",
      },
      {
        label: "Destinations Section",
        href: "/admin/destination-section",
      },
      {
        label: "About Us Section",
        href: "/admin/about-us-section",
      },
      {
        label: "Review Section",
        href: "/admin/review-section",
      },
      {
        label: "Gallery Section",
        href: "/admin/gallery-section",
      },
      {
        label: "Footer Section",
        href: "/admin/footer-section",
      },
    ],
  },
  {
    label: "Virtual Tour Section",
    children: [
      {
        label: 'Manajemen Spot',
        href: '/admin/virtual-tour-section'
      },
      {
        label: 'Manajemen Tur',
        href: '/admin/virtual-tour-hotspots'
      }
    ]
  },
];
