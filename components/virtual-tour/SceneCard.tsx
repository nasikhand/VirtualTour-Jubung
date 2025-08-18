import { VtourScene } from "@/types/virtual-tour";
import Link from "next/link";
import { Trash2 } from "lucide-react";

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

  const cardContent = (
    <>
      <img
        src={imageUrl}
        alt={scene.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      <div className="absolute bottom-0 left-0 p-4">
        <h3 className="font-bold text-white text-lg">{scene.name}</h3>
      </div>
      {onDelete && (
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => {
              e.preventDefault(); // Mencegah navigasi saat tombol hapus diklik
              e.stopPropagation();
              onDelete(scene);
            }} 
            className="bg-red-600/80 p-2 rounded-full hover:bg-red-600 text-white"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )}
    </>
  );

  return (
    <Link href={targetUrl} className="group relative block aspect-video overflow-hidden rounded-xl shadow-md transition-all duration-300 hover:shadow-xl">
      {cardContent}
    </Link>
  );
}