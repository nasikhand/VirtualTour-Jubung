import { VtourScene } from "@/types/virtual-tour";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Trash2, Edit, Eye, Calendar, Sparkles, MapPin } from "lucide-react";

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
    <div className="relative h-full w-full overflow-hidden rounded-2xl">
      <img
        src={imageUrl}
        alt={scene.name}
        className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = '/placeholder-image.jpg';
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      {/* Status Badge */}
      {isInMenu && (
        <div className="absolute top-3 left-3">
          <span className="bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs px-3 py-1.5 rounded-full font-semibold shadow-lg backdrop-blur-sm flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Aktif di Menu
          </span>
        </div>
      )}
      
      {/* Scene Info */}
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <div className="bg-black/60 rounded-lg p-3">
          <h3 className="font-semibold text-white text-base mb-1 line-clamp-2">{scene.name}</h3>
          {scene.created_at && (
            <div className="flex items-center text-white/80 text-sm">
              <Calendar size={12} className="mr-1 text-white/60" />
              <span>{formatDate(scene.created_at)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/virtual-tour?scene=${scene.id}`);
          }}
          className="bg-blue-500 p-2 rounded-lg hover:bg-blue-600 text-white transition-colors duration-200 shadow-md"
          title="Preview Scene"
        >
          <Eye size={14} />
        </button>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(scene);
            }} 
            className="bg-red-500 p-2 rounded-lg hover:bg-red-600 text-white transition-colors duration-200 shadow-md"
            title="Hapus Scene"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>

      {/* Edit Icon */}
      <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <div className="bg-green-500 p-2 rounded-lg text-white shadow-md">
          <Edit size={14} />
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
          <h3 className="font-semibold text-gray-900 dark:text-white truncate">{scene.name}</h3>
          {isInMenu && (
            <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full flex-shrink-0">
              Aktif di Menu
            </span>
          )}
        </div>
        {scene.created_at && (
          <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
            <Calendar size={12} className="mr-1" />
            <span>{formatDate(scene.created_at)}</span>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/virtual-tour?scene=${scene.id}`);
          }}
          className="p-3 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
          title="Preview Scene"
        >
          <Eye size={18} />
        </button>
        <div className="p-3 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 rounded-xl shadow-sm">
          <Edit size={18} />
        </div>
        {onDelete && (
          <button 
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(scene);
            }} 
            className="p-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-xl transition-all duration-200 hover:scale-110 shadow-sm"
            title="Hapus Scene"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>
    </div>
  );

  const cardContent = viewMode === 'grid' ? gridContent : listContent;

  return (
    <Link 
      href={targetUrl} 
      className={`group relative block overflow-hidden rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 ${
        viewMode === 'grid' 
          ? 'aspect-video hover:scale-[1.03] hover:-translate-y-2' 
          : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:border-purple-300 dark:hover:border-purple-600'
      }`}
    >
      {cardContent}
    </Link>
  );
}