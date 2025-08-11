'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import { VtourMenu } from '@/types/virtual-tour';

type Props = {
  menu: VtourMenu;
  onDelete: (menu: VtourMenu) => void;
};

export function SortableMenuItem({ menu, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: menu.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    boxShadow: isDragging ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' : 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex justify-between items-center bg-white p-3 rounded-md shadow-sm border"
    >
      <div className="flex items-center gap-3">
        <button 
          {...attributes} 
          {...listeners} 
          className="cursor-grab touch-none p-1.5 text-gray-400 hover:bg-gray-100 rounded-md"
          aria-label="Drag to reorder"
        >
          <GripVertical size={18} />
        </button>
        <span className="font-medium text-gray-700">{menu.name}</span>
      </div>
      <div className="flex items-center gap-2">
        <button onClick={() => onDelete(menu)} className="p-1.5 text-gray-500 hover:text-red-600">
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}