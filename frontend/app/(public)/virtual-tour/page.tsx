import { getVtourMenus } from '@/lib/data/virtual-tour';
import VirtualTourClientPage from '@/components/virtual-tour/VirtualTourClientPage';
import { VtourMenu } from '@/types/virtual-tour';
import { notFound } from 'next/navigation';

export default async function VirtualTourPage() {
  let logoUrl = "/placeholder-logo.png"; // Siapkan URL logo default

  try {
    // Ambil data menu dan settings secara bersamaan
    const [allMenus, settingsRes] = await Promise.all([
      getVtourMenus(),
      fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/vtour/settings`, { cache: 'no-store' })
    ]);
    
    const activeMenus = allMenus.filter(menu => menu.is_active && menu.scene);

    if (activeMenus.length === 0) {
      return notFound();
    }

    const initialMenu = activeMenus.find(menu => menu.is_default) || activeMenus[0];
    
    // Proses URL logo
    if (settingsRes.ok) {
      const settingsData = await settingsRes.json();
      if (settingsData.data?.vtour_logo_path) {
        logoUrl = `/api/vtour/images/${settingsData.data.vtour_logo_path}`;
      }
    }

    return (
      <main>
        <VirtualTourClientPage 
          menus={activeMenus} 
          initialScene={initialMenu.scene!} 
          logoUrl={logoUrl} // Kirim logoUrl sebagai prop
        />
      </main>
    );

  } catch (error) {
    console.error("Gagal memuat data untuk virtual tour:", error);
    // Tampilkan halaman error atau fallback jika pengambilan data gagal
    return <div>Gagal memuat virtual tour. Silakan coba lagi nanti.</div>;
  }
}