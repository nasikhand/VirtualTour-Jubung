"use client";

import { useEffect, useState } from "react";

export default function useWebsiteLabel() {
  const [label, setLabel] = useState("Desa Jubung"); // default

  useEffect(() => {
    const fetchLabel = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/about-us/1`);
        if (!res.ok) throw new Error("Gagal fetch data");
        const data = await res.json();

        // Misalnya ambil hero_title_about_us dari DB
        setLabel(data?.website || "Desa Jubung");
      } catch (error) {
        console.error("Error fetching label:", error);
      }
    };

    fetchLabel();
  }, []);

  return label;
}
