"use client";

import { useEffect, useState } from "react";

export interface NavigationItem {
  label: string;
  href: string;
}

export default function useCulinaryNavigation() {
  const [culinaryNav, setCulinaryNav] = useState<NavigationItem>({
    label: "Culinary", // default fallback
    href: "/culinary",
  });

  useEffect(() => {
    const fetchCulinaryNav = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/culinaries/1`);
        if (!res.ok) throw new Error("Gagal fetch culinary navigation");
        const data = await res.json();

        setCulinaryNav({
          label: data?.navigation_items || "Culinary",
          href: "/culinary",
        });
      } catch (error) {
        console.error("Error fetching culinary navigation:", error);
      }
    };

    fetchCulinaryNav();
  }, []);

  return culinaryNav;
}
 