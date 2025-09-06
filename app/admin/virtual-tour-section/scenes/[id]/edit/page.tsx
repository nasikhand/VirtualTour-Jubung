// app/admin/.../scenes/[id]/edit/page.tsx
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getScene } from "@/lib/api-client"; // samakan pola dengan edit-link

// ⛑️ Komponen editor dipaksa client-only
const InfoHotspotContainer = dynamic(
  () => import("@/components/virtual-tour/InfoHotspotContainer"),
  { ssr: false, loading: () => <div className="p-6">Memuat editor…</div> }
);

export default async function EditScenePage({ params }: { params: { id: string } }) {
  const scene = await getScene(params.id); // atau adaptasikan getSceneById => scene = res?.data
  if (!scene) return notFound();
  return <InfoHotspotContainer scene={scene} />;
}
