import { getSceneById } from '@/lib/data/virtual-tour'
import SceneEditor from '../../../../../../components/virtual-tour/SceneEditor'
import { notFound } from 'next/navigation'

export default async function EditScenePage({ params }: { params: { id: string } }) {
  const sceneId = params.id;
  
  // Memanggil fungsi untuk mengambil data dari backend
  const response = await getSceneById(sceneId); 

  // ✅ PERBAIKAN KUNCI: Ekstrak objek scene dari properti 'data'
  const scene = response?.data;

  // Jika scene (setelah diekstrak) tidak ada, tampilkan halaman not found
  if (!scene || typeof scene !== 'object') {
    return notFound();
  }

  // Kirim objek scene yang sudah benar ke client component
  return <SceneEditor initialScene={scene} />;
}