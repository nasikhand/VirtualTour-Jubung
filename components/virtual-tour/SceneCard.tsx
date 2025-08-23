import { VtourScene } from "@/types/virtual-tour";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Eye, Calendar } from "lucide-react";

type Props = {
  scene: VtourScene;
  onDelete?: (scene: VtourScene) => void;
  // ✅ Prop untuk menentukan tujuan link
  href?: string;
  // ✅ Props baru untuk modernisasi
  viewMode?: 'grid' | 'list';
  isInMenu?: boolean;
};

export default function SceneCard({ scene, onDelete, href, viewMode = 'grid', isInMenu = false }: Props) {
  const router = useRouter();
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

  // Grid view content
  const gridContent = (
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
      
      {/* Status Badge */}
      {isInMenu && (
        <div className="absolute top-2 left-2">
          <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
            Aktif di Menu
          </span>
        </div>
      )}
      
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
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/virtual-tour?scene=${scene.id}`);
          }}
          className="bg-blue-600/80 p-2 rounded-full hover:bg-blue-600 text-white transition-colors"
          title="Preview Scene"
        >
          <Eye size={16} />
        </button>
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
  );

  // List view content
  const listContent = (
    <div className="flex items-center gap-4 p-4">
      <div className="relative w-24 h-16 flex-shrink-0 rounded-lg overflow-hidden">
        <img
          src={imageUrl}
          alt={scene.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = '/placeholder-image.jpg';
          }}
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 truncate">{scene.name}</h3>
          {isInMenu && (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex-shrink-0">
              Aktif di Menu
            </span>
          )}
        </div>
        {scene.created_at && (
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar size={14} className="mr-1" />
            <span>{formatDate(scene.created_at)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/virtual-tour?scene=${scene.id}`);
          }}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          title="Preview Scene"
        >
          <Eye size={16} />
        </button>
        <div className="p-2 text-green-600">
          <Edit size={16} />
        </div>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(scene);
            }} 
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Hapus Scene"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );

  const cardContent = viewMode === 'grid' ? gridContent : listContent;

  return (
    <Link 
      href={targetUrl} 
      className={`group relative block overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl bg-white dark:bg-gray-800 ${
        viewMode === 'grid' 
          ? 'aspect-video hover:scale-[1.02]' 
          : 'hover:bg-gray-50'
      }`}
    >
      {cardContent}
    </Link>
  );
}