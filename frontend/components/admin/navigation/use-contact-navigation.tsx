"use client";

import { useEffect, useState } from "react";

export interface NavigationItem {
  label: string;
  href: string;
}

export default function useContactNavigation() {
  const [contactNav, setContactNav] = useState<NavigationItem>({
    label: "Contact Us", // default fallback
    href: "/contact",
  });

  useEffect(() => {
    const fetchNav = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about-us/1`);
        if (!res.ok) throw new Error("Gagal fetch data navigation");
        const data = await res.json();

        setContactNav({
          label: data?.navigation_contact_us || "Contact Us",
          href: "/contact",
        });
      } catch (error) {
        console.error("Error fetching contact navigation:", error);
      }
    };

    fetchNav();
  }, []);

  return contactNav;
}
