// file: frontend/types/virtual-tour.d.ts

export type Scene = {
  id: number;
  name: string;
  description?: string;
  image_path: string;
  default_yaw?: number;
  default_pitch?: number;
  created_at?: string;
  updated_at?: string;
  hotspots?: Hotspot[];
};

export type VtourScene = Scene;

export type Sentence = {
  id: string;
  clause: string;
  voiceSource: 'browser' | 'file';
  voiceUrl?: string;
};

export type Hotspot = {
  id: number | string;
  scene_id: number;
  type: 'info' | 'link';
  yaw: number;
  pitch: number;
  label?: string;
  description?: string;
  sentences?: Sentence[];
  target_scene_id?: number;
  targetScene?: Scene;
  icon_name?: string;
};

export interface VtourMenu {
  id: number;
  name: string;
  slug: string;
  preview_image?: string;
  is_active: boolean;
  is_default: boolean;
  order: number;
  scene_id: number;
  scene?: Scene;
}