export interface Model {
  parent?: string;
  display?: Partial<Record<ModelDisplayPosition, ModelDisplay>>;
  textures?: {
    particle?: string;
    [name: string]: string;
  };
  elements?: ModelElement[];
}
export interface ModelDisplay {
  rotation: ModelVector3;
  translation: ModelVector3;
  scale: ModelVector3;
}
export type ModelDisplayPosition =
  | "thirdperson_righthand"
  | "thirdperson_lefthand"
  | "firstperson_righthand"
  | "firstperson_lefthand"
  | "gui"
  | "head"
  | "ground"
  | "fixed";
export interface ModelElement {
  from: ModelVector3;
  to: ModelVector3;
  rotation?: {
    origin: ModelVector3;
    axios: "x" | "y" | "z";
    angle: -45 | -22.5 | 0 | 22.5 | 45;
    rescale?: boolean;
  };
  shade?: boolean;
  faces: Partial<Record<ModelFaceDirection, ModelFace>>;
}
export interface ModelFace {
  uv?: [x1: number, y1: number, x2: number, y2: number];
  texture: string;
  cullface?: ModelFaceDirection;
  rotation?: 0 | 90 | 180 | 270;
  tintindex?: number;
}
export type ModelFaceDirection =
  | "north"
  | "east"
  | "south"
  | "west"
  | "up"
  | "down";
export type ModelVector3 = [x: number, y: number, z: number];

export interface TextureMeta {
  animation: {
    interpolate?: boolean;
    width?: number;
    height?: number;
    frametime?: number;
    frames: TextureMetaAnimationFrame[];
  };
}
export type TextureMetaAnimationFrame =
  | number
  | {
      index: number;
      time: number;
    };
