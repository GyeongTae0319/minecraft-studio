import {
  DirectionalLight,
  Group,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";
import { Model } from "~/types/minecraft";
import McModelParser from "../parser/McModelParser";

interface Options {
  canvas: HTMLCanvasElement;
}

export default class McModelRenderer {
  static transparentMaterial = new MeshBasicMaterial({
    color: 0x000000,
    opacity: 0,
    transparent: true,
  });

  canvas: HTMLCanvasElement;
  camera: OrthographicCamera;
  lights: DirectionalLight[] = [];
  renderer: WebGLRenderer;
  scene: Scene;
  size = new Vector2(0, 0);
  root: Group = null;

  constructor(options: Options) {
    this.canvas = options.canvas;
    this.size.set(this.canvas.width, this.canvas.height);
    this.scene = new Scene();
    this.camera = new OrthographicCamera(
      this.size.x / -2,
      this.size.x / 2,
      this.size.y / 2,
      this.size.y / -2,
      1,
      3000
    );
    this.addLight(0.8, 1, 0, 0);
    this.addLight(0.98, 0, 1, 0);
    this.addLight(0.608, 0, 0, -1);
    this.renderer = new WebGLRenderer({
      alpha: true,
      canvas: this.canvas,
    });
    this.renderer.setSize(this.size.x, this.size.y);
  }

  destory() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
  }

  add(model: Model, textures: Record<string, Texture>) {
    const parser = new McModelParser();
    this.root = parser.parse(model, textures);
    this.scene.add(this.root);
  }
  addLight(intensity: number, x: number, y: number, z: number) {
    const light = new DirectionalLight(0xffffff, intensity);
    light.position.set(x, y, z);
    light.lookAt(0, 0, 0);
    this.scene.add(light);
    this.lights.push(light);
  }
}
