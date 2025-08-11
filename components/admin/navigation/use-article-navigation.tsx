"use client";

import { useEffect, useState } from "react";

export interface NavigationItem {
  label: string;
  href: string;
}

export default function useArticleNavigation() {
  const [articleNav, setArticleNav] = useState<NavigationItem>({
    label: "Articles", // fallback default
    href: "/articles",
  });

  useEffect(() => {
    const fetchArticleNav = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/1`);
        if (!res.ok) throw new Error("Gagal fetch article navigation");
        const data = await res.json();

        setArticleNav({
          label: data?.navigation_items || "Articles",
          href: "/articles",
        });
      } catch (error) {
        console.error("Error fetching article navigation:", error);
      }
    };

    fetchArticleNav();
  }, []);

  return articleNav;
}
