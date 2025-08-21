import { VtourScene } from "@/types/virtual-tour";
import Link from "next/link";
import { Trash2, Edit, Eye, Calendar } from "lucide-react";

type Props = {
  scene: VtourScene;
  onDelete?: (scene: VtourScene) => void;
  // ✅ Prop untuk menentukan tujuan link
  href?: string; 
};

export default function SceneCard({ scene, onDelete, href }: Props) {
  const imageUrl = scene.image_path ? `/api/vtour/images/${encodeURIComponent(scene.image_path)}` : '/placeholder-image.jpg';

  // Tentukan URL tujuan, default ke halaman edit scene jika tidak ada prop href
  const targetUrl = href || `/admin/virtual-tour-section/scenes/${scene.id}/edit`;

  // Format tanggal
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const cardContent = (
    <>
      <div className="relative h-full w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={scene.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Scene Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="font-bold text-white text-lg mb-1 line-clamp-2">{scene.name}</h3>
          {scene.created_at && (
            <div className="flex items-center text-white/80 text-sm">
              <Calendar size={14} className="mr-1" />
              <span>{formatDate(scene.created_at)}</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link
            href={`/virtual-tour?scene=${scene.id}`}
            onClick={(e) => e.stopPropagation()}
            className="bg-blue-600/80 p-2 rounded-full hover:bg-blue-600 text-white transition-colors"
            title="Preview Scene"
          >
            <Eye size={16} />
          </Link>
          {onDelete && (
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onDelete(scene);
              }} 
              className="bg-red-600/80 p-2 rounded-full hover:bg-red-600 text-white transition-colors"
              title="Hapus Scene"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>

        {/* Edit Icon */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-green-600/80 p-2 rounded-full text-white">
            <Edit size={16} />
          </div>
        </div>
      </div>
    </>
  );

  return (
    <Link 
      href={targetUrl} 
      className="group relative block aspect-video overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white dark:bg-gray-800"
    >
      {cardContent}
    </Link>
  );
}