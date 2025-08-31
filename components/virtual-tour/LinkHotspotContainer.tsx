'use client';

import { useRouter } from 'next/navigation';
import HotspotEditor from './HotspotEditor';
import { Scene } from '@/types/virtual-tour';

interface LinkHotspotContainerProps {
  scene: Scene;
}

export default function LinkHotspotContainer({ scene }: LinkHotspotContainerProps) {
  const router = useRouter();

  const handleExit = () => {
    router.back();
  };

  return (
    <HotspotEditor
      scene={scene}
      type="link"
      onExit={handleExit}
    />
  );
}
