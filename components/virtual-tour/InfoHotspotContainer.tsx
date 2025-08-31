'use client';

import { useRouter } from 'next/navigation';
import HotspotEditor from './HotspotEditor';
import { Scene } from '@/types/virtual-tour';

interface InfoHotspotContainerProps {
  scene: Scene;
}

export default function InfoHotspotContainer({ scene }: InfoHotspotContainerProps) {
  const router = useRouter();

  const handleExit = () => {
    router.back();
  };

  return (
    <HotspotEditor
      scene={scene}
      type="info"
      onExit={handleExit}
    />
  );
}
