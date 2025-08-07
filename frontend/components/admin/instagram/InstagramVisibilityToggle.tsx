'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { broadcastShowFeedChanged } from '@/lib/broadcast';

export default function InstagramVisibilityToggle() {
  const [showFeed, setShowFeed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter(); // ← tambahkan

  useEffect(() => {
    const fetchSetting = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/instagram-setting`);
        const data = await res.json();
        setShowFeed(data.show_feed);
      } catch (error) {
        alert('Gagal mengambil data setting');
      } finally {
        setLoading(false);
      }
    };

    fetchSetting();
  }, []);

  const handleToggle = async () => {
  const newValue = !showFeed;
  setSaving(true);
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/instagram-setting`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ show_feed: newValue }),
    });
    const data = await res.json();
    setShowFeed(data.show_feed);

    broadcastShowFeedChanged(); // ✅ PENTING: kirim sinyal antar-tab
    router.refresh(); // ✅ Refresh current tab juga
  } catch (error) {
    alert('Gagal menyimpan setting');
  } finally {
    setSaving(false);
  }
};

  if (loading) return <p>Loading...</p>;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium">Tampilkan Instagram Feed</span>
      <button onClick={handleToggle} disabled={saving} className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${showFeed ? 'bg-green-500' : 'bg-gray-300'}`}>
        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${showFeed ? 'translate-x-6' : 'translate-x-1'}`} />
      </button>
    </div>
  );
}