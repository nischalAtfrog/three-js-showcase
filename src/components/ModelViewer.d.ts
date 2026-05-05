import { ComponentType, ReactNode } from 'react';

export interface ScrollKeyframe {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface ModelViewerProps {
  url: string;
  width?: number | string;
  height?: number | string;
  defaultRotationX?: number;
  defaultRotationY?: number;
  defaultZoom?: number;
  ambientIntensity?: number;
  keyLightIntensity?: number;
  fillLightIntensity?: number;
  rimLightIntensity?: number;
  environmentPreset?: string;
  fadeIn?: boolean;
  placeholderSrc?: string;
  onModelLoaded?: () => void;
  scrollPages?: number;
  scrollKeyframes?: ScrollKeyframe[];
  children?: ReactNode;
}

declare const ModelViewer: ComponentType<ModelViewerProps>;
export default ModelViewer;
