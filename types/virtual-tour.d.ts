// file: virtual-tour/types/virtual-tour.d.ts

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
  scene_id: number;
  order: number;
  scene?: Scene;
  is_map_scene?: boolean;
}

// Pannellum types
export interface PannellumViewer {
  destroy(): void;
  on(event: string, callback: Function): void;
  off(event: string, callback: Function): void;
  mouseEventToCoords(event: MouseEvent): [number, number] | null;
  lookAt(yaw: number, pitch: number, fov?: number, speed?: number): void;
  getViewer(): any;
  addHotSpot(hotspot: any): void;
  removeHotSpot(id: string): void;
  getHotSpots(): any[];
  getPitch(): number;
  getYaw(): number;
}

export interface PannellumViewerRef {
  addHotspot: (hotspot: Hotspot) => void;
  removeHotspot: (id: string | number) => void;
  updateHotspots: (newHotspots: Hotspot[]) => void;
  getViewer: () => PannellumViewer | null;
}

// Global Pannellum declaration
declare global {
  interface Window {
    pannellum: {
      viewer: (element: HTMLElement, config: any) => PannellumViewer;
    };
  }
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  errors?: any;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

// Admin types
export interface AdminUser {
  id: number;
  username: string;
  email?: string;
  role: 'web_admin' | 'vtour_admin' | 'super_admin';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

// Settings types
export interface VtourSettings {
  id: number;
  vtour_logo_url?: string;
  vtour_title?: string;
  vtour_description?: string;
  created_at: string;
  updated_at: string;
}