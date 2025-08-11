"use client";

import { useEffect, useState } from "react";

export interface NavigationItem {
  label: string;
  href: string;
}

export default function useEventNavigation() {
  const [eventNav, setEventNav] = useState<NavigationItem>({
    label: "Events", // fallback default
    href: "/events",
  });

  useEffect(() => {
    const fetchEventNav = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/events/1`);
        if (!res.ok) throw new Error("Gagal fetch event navigation");
        const data = await res.json();

        setEventNav({
          label: data?.navigation_items || "Events",
          href: "/events",
        });
      } catch (error) {
        console.error("Error fetching event navigation:", error);
      }
    };

    fetchEventNav();
  }, []);

  return eventNav;
}
