'use client';

import { Card, CardContent } from '@/components/ui/card';

interface TotalStatsCardsProps {
  totals: {
    totalEvents: number;
    totalCulinary: number;
    totalDestinations: number;
    totalGalleries: number;
    totalArticles: number;
  };
}

export default function TotalStatsCards({ totals }: TotalStatsCardsProps) {
  return (
    <section>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {[
          { title: 'Total Event', total: totals.totalEvents },
          { title: 'Total Kuliner', total: totals.totalCulinary },
          { title: 'Total Destinasi', total: totals.totalDestinations },
          { title: 'Total Galeri', total: totals.totalGalleries },
          { title: 'Total Artikel', total: totals.totalArticles },
        ].map((item) => (
          <Card key={item.title} className="bg-zinc-900 text-white">
            <CardContent className="p-4">
              <h4 className="text-sm text-gray-400">{item.title}</h4>
              <p className="text-xl font-bold">{item.total}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
