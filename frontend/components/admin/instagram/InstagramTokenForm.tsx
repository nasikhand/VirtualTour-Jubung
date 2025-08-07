'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export default function InstagramTokenForm() {
  const [accessToken, setAccessToken] = useState('');
  const [expiresAt, setExpiresAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/instagram-token`)
        if (!res.ok) throw new Error('Gagal fetch token');
        const data = await res.json();
        if (data?.access_token) {
          setAccessToken(data.access_token);
          if (data.expires_at) {
            const formattedDate = new Date(data.expires_at).toISOString().slice(0, 16);
            setExpiresAt(formattedDate);
          }
        }
      } catch (err: any) {
        console.error('Fetch token error:', err.message);
        setError('Gagal memuat token dari server.');
      }
    };

    fetchToken();
  }, [BACKEND_URL]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/instagram-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_token: accessToken,
          expires_at: expiresAt || null,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const data = await res.json();
        setError(data?.message || 'Gagal menyimpan token.');
      }
    } catch (err) {
      setError('Terjadi kesalahan koneksi saat menyimpan token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-4xl mx-auto p-6 sm:p-8">
      <h2 className="text-2xl font-bold mb-6">Instagram Token</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="access_token">Access Token</Label>
          <Input
            id="access_token"
            placeholder="Tempel Access Token Anda di sini..."
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="expires_at">Waktu Kedaluwarsa (Opsional)</Label>
          <Input
            id="expires_at"
            type="datetime-local"
            value={expiresAt}
            onChange={(e) => setExpiresAt(e.target.value)}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan Token'
            )}
          </Button>

          {success && <p className="text-green-600 text-sm">Token berhasil disimpan.</p>}
          {error && <p className="text-red-600 text-sm">{error}</p>}
        </div>
      </form>
    </Card>
  );
}