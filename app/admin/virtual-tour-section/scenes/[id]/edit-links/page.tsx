import { getSceneById } from '@/lib/data/virtual-tour';
import LinkHotspotEditor from '@/components/virtual-tour/LinkHotspotEditor'; // Komponen yang akan kita isi
import { notFound } from 'next/navigation';
import { Scene } from '@/types/virtual-tour';

export default async function EditSceneLinksPage({ params }: { params: { id: string } }) {
  const sceneId = params.id;
  
  // Ambil data scene tunggal dari server
  const response = await getSceneById(sceneId);
  const scene: Scene | null = response?.data || response;

  if (!scene) {
    return notFound();
  }

  // Render komponen LinkHotspotEditor dengan data scene yang sesuai
  return <LinkHotspotEditor scene={scene} />;
}