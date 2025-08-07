"use client";

import { useEffect, useState } from "react";

export interface NavigationItem {
  label: string;
  href: string;
}

export default function useDestinationNavigation() {
  const [destinationNav, setDestinationNav] = useState<NavigationItem>({
    label: "Destinations", // fallback default
    href: "/destinations",
  });

  useEffect(() => {
    const fetchDestinationNav = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/destination/hero`);
        if (!res.ok) throw new Error("Gagal fetch destination navigation");
        const data = await res.json();

        setDestinationNav({
          label: data?.navigation_items || "Destinations",
          href: "/destinations",
        });
      } catch (error) {
        console.error("Error fetching destination navigation:", error);
      }
    };

    fetchDestinationNav();
  }, []);

  return destinationNav;
}
