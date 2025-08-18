'use client';

import { useState, useEffect, useCallback } from 'react';
import { Hotspot } from '@/types/virtual-tour';
import { useViewer } from './VirtualTourBase';

type Props = {
  hotspot: Hotspot;
  onClick?: (hotspot: Hotspot) => void;
};

export default function ReactHotspot({ hotspot, onClick }: Props) {
  const viewerContext = useViewer();
  const viewer = viewerContext?.viewer;
  const [position, setPosition] = useState<{ top: number; left: number; isVisible: boolean } | null>(null);

  const updatePosition = useCallback(() => {
    if (!viewer || typeof viewer.coordsToScreen !== 'function') return;
    const coords = viewer.coordsToScreen([hotspot.pitch, hotspot.yaw]);
    if (Array.isArray(coords)) {
      const [top, left] = coords;
      const container = viewer.getContainer();
      const isVisible = top > 0 && top < container.clientHeight && left > 0 && left < container.clientWidth;
      setPosition({ top, left, isVisible });
    }
  }, [viewer, hotspot.pitch, hotspot.yaw]);

  useEffect(() => {
    if (viewer) {
      viewer.on('viewchange', updatePosition);
      updatePosition();
    }
    return () => {
      if (viewer && typeof (viewer as any).off === 'function') {
        (viewer as any).off('viewchange', updatePosition);
      }
    };
  }, [viewer, updatePosition]);

  if (!position || !position.isVisible) return null;

  const hotspotClass = hotspot.type === 'link' 
    ? `custom-link-hotspot hotspot-icon-${hotspot.icon_name || 'default'}` 
    : 'custom-info-hotspot';

  return (
    <button
      className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
      style={{ top: position.top, left: position.left }}
      onClick={() => onClick?.(hotspot)}
      title={hotspot.label}
    >
      <div className={hotspotClass} />
    </button>
  );
}