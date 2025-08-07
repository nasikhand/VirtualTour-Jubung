"use client";

import React from "react";
import DestinationCard from "@/components/destinations/destination-card";

interface Props {
  title: string;
  loading: boolean;
  data: {
    id: number;
    name: string;
    imageUrl: string;
    isNearby: boolean;
  }[];
  onDelete: (id: number) => void;
}

export default function Section({ title, loading, data, onDelete }: Props) {
  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-600">Belum ada {title.toLowerCase()}.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {data.map((dest) => (
            <DestinationCard key={dest.id} dest={dest} onDelete={onDelete} />
          ))}
        </div>
      )}
    </section>
  );
}
