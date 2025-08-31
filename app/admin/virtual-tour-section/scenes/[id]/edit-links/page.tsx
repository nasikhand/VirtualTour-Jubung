import LinkHotspotContainer from '@/components/virtual-tour/LinkHotspotContainer';
import { getScene } from '@/lib/api-client'

interface EditLinksPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditLinksPage({ params }: EditLinksPageProps) {
  const { id } = await params;
  
  // Fetch scene data
  const scene = await getScene(id);
  
  if (!scene) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Scene tidak ditemukan</h1>
          <p className="text-gray-600">Scene dengan ID {id} tidak dapat ditemukan.</p>
        </div>
      </div>
    );
  }

  // Render komponen LinkHotspotContainer dengan data scene yang sesuai
  return <LinkHotspotContainer scene={scene} />;
}