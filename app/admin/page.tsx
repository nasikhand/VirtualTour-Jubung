'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import WelcomeCardList from '@/components/admin/welcome-section/welcome-card-list';
import EventCardList from '@/components/admin/event/event-card-list';
import CulinaryCardList from '@/components/admin/culinary/culinary-card-list';
import TotalStatsCards from '@/components/admin/total-stats-cards';

export default function AdminWelcomePage() {
  const [chartType, setChartType] = useState<'yearly' | 'monthly' | 'weekly'>('yearly');
  const [yearlyData, setYearlyData] = useState<any[]>([]);
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [totals, setTotals] = useState({
    totalEvents: 0,
    totalCulinary: 0,
    totalDestinations: 0,
    totalGalleries: 0,
    totalArticles: 0,
  });

  useEffect(() => {
    // Fetch chart data
    fetch('/api/analytics/yearly-visits')
      .then((res) => res.json())
      .then((data) => setYearlyData(data.data || []))
      .catch((err) => console.error('Failed to fetch yearly visits:', err));

    fetch('/api/analytics/monthly-visits')
      .then((res) => res.json())
      .then((data) => setMonthlyData(data.data || []))
      .catch((err) => console.error('Failed to fetch monthly visits:', err));

    fetch('/api/analytics/weekly-visits')
      .then((res) => res.json())
      .then((data) => setWeeklyData(data.data || []))
      .catch((err) => console.error('Failed to fetch weekly visits:', err));

    // Fetch totals data
    fetch('/api/statistics/totals')
      .then((res) => res.json())
      .then((data) => setTotals(data))
      .catch((err) => console.error('Failed to fetch totals:', err));
  }, []);

  const chartData =
    chartType === 'yearly' ? yearlyData :
    chartType === 'monthly' ? monthlyData :
    weeklyData;

  const xDataKey =
    chartType === 'yearly' ? 'year' :
    chartType === 'monthly' ? 'month' : 'week';

  return (
    <div className="p-6 space-y-10">
      {/* GRAFIK */}
      <section>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-black">Statistik Pengunjung Website</h2>
              <div className="flex space-x-2">
                {['yearly', 'monthly', 'weekly'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setChartType(type as 'yearly' | 'monthly' | 'weekly')}
                    className={`px-3 py-1 rounded text-sm ${
                      chartType === type
                        ? 'bg-blue-600 text-white'
                        : 'border border-blue-500 text-blue-600'
                    }`}
                  >
                    {type === 'yearly' ? 'Tahunan' : type === 'monthly' ? 'Bulanan' : 'Mingguan'}
                  </button>
                ))}
              </div>
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis dataKey={xDataKey} stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* TOTAL STATS CARDS */}
      <section>
        <TotalStatsCards totals={totals} />
      </section>

      {/* WELCOME */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Manajemen Slides Welcome</h1>
          <Link
            href="/admin/welcome-section"
            className="text-sm text-blue-600 border border-blue-500 rounded px-4 py-1 hover:bg-blue-50 transition inline-flex items-center"
          >
            See More &rarr;
          </Link>
        </div>
        <WelcomeCardList />
      </section>

      {/* EVENT */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Manajemen Event</h1>
          <Link
            href="/admin/event-section"
            className="text-sm text-blue-600 border border-blue-500 rounded px-4 py-1 hover:bg-blue-50 transition inline-flex items-center"
          >
            See More &rarr;
          </Link>
        </div>
        <EventCardList />
      </section>

      {/* CULINARY */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-black">Manajemen Culinary</h1>
          <Link
            href="/admin/culinary-section"
            className="text-sm text-blue-600 border border-blue-500 rounded px-4 py-1 hover:bg-blue-50 transition inline-flex items-center"
          >
            See More &rarr;
          </Link>
        </div>
        <CulinaryCardList />
      </section>
    </div>
  );
}
