import { LineCap } from 'konva/lib/Shape';

export interface LineState {
  startingPoint: { x: number; y: number } | null;
  endingPoint: { x: number; y: number } | null;
}

export interface CoordinatesInterface {
  x: number;
  y: number;
}

export interface CountInterface extends CoordinatesInterface {
  dateTime: Date;
  projectName?: any;
  category?: any;
}

export interface LineInterface {
  points: number[];
  stroke: string;
  strokeWidth: number;
  lineCap?: LineCap;
  textUnit: number;
  dateTime?: Date;
  projectName?: any;
  category?: any;
}

export interface CircleInterface extends CoordinatesInterface {
  fill: string;
  radius: number;
}

export interface PolygonConfigInterface {
  points: number[];
  stroke: string;
  strokeWidth: number;
  depth?: number;
  textUnit: number;
  dateTime: Date;
  projectName?: any;
  category?: any;
}

export interface DrawInterface {
  line: LineInterface[];
  area: PolygonConfigInterface[];
  volume: PolygonConfigInterface[];
  dynamic: LineInterface[];
  count: CountInterface[];
  perimeter?: any;
}

export interface Measurements {
  angle?: number;
  segment?: string;
  volume?: number;
  count?: number;
  parameter?: string;
  area?: number;
}

export const defaultMeasurements = {
  angle: 0,
  segment: '0',
  volume: 0,
  area: 0,
  count: 0,
  parameter: '0',
};

export type ScaleLabel =
  | 'scale'
  | 'length'
  | 'volume'
  | 'count'
  | 'area'
  | 'dynamic'
  | 'perimeter';

export type DynamicScale = 'fill' | 'create' | 'clear';

export interface ScaleInterface {
  selected: ScaleLabel;
  subSelected?: DynamicScale;
}

export interface ScaleNavigation {
  label: ScaleLabel;
  src: string;
  selectedSrc: string;
  alt: string;
  width: number;
  height: number;
}

export const SCALE_NAVIGATION: ScaleNavigation[] = [
  {
    label: 'scale',
    src: '/scale.svg',
    selectedSrc: '/selectedScale.svg',
    alt: 'createicon',
    width: 19.97,
    height: 11.31,
  },
  {
    label: 'length',
    src: '/length.svg',
    selectedSrc: '/selectedLength.svg',
    alt: 'createicon',
    width: 19.97,
    height: 11.31,
  },
  {
    label: 'volume',
    src: '/volume.svg',
    selectedSrc: '/selectedVolume.svg',
    alt: 'createicon',
    width: 14,
    height: 16,
  },
  {
    label: 'count',
    src: '/count.svg',
    selectedSrc: '/selectedCount.svg',
    alt: 'createicon',
    width: 19.97,
    height: 11.31,
  },
  {
    label: 'area',
    src: '/area.svg',
    selectedSrc: '/selectedArea.svg',
    alt: 'createicon',
    width: 18.33,
    height: 13.72,
  },
  {
    label: 'dynamic',
    src: '/dynamic.svg',
    selectedSrc: '/selectedDynamic.svg',
    alt: 'createicon',
    width: 15,
    height: 14,
  },
  {
    label: 'perimeter',
    src: '/dynamic.svg',
    selectedSrc: '/selectedDynamic.svg',
    alt: 'createicon',
    width: 15,
    height: 14,
  },
];

export const Units = [11, 12, 14, 16, 18, 20, 22, 24, 26, 28, 36, 48, 72];
