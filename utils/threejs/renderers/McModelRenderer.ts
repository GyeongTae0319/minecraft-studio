import {
  BoxGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  Texture,
  Vector2,
  WebGLRenderer,
} from "three";
import { Model, ModelFaceDirection } from "~/types/minecraft";

interface Options {
  canvas: HTMLCanvasElement;
}

const FaceDirections = Object.freeze([
  "north",
  "east",
  "south",
  "west",
  "up",
  "down",
]);
const FaceDirectionOrder = Object.freeze<Record<ModelFaceDirection, number>>({
  north: 0,
  east: 4,
  south: 1,
  west: 5,
  up: 2,
  down: 3,
});

export default class McModelRenderer {
  canvas: HTMLCanvasElement;
  camera: OrthographicCamera;
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
    this.root = new Group();
    model.elements?.forEach((element) => {
      const [x1, y1, z1] = element.from;
      const [x2, y2, z2] = element.to;
      const [width, height, depth] = [x2 - x1, y2 - y1, z2 - z1];
      console.log([x1, y1, z1], [x2, y2, z2], [width, height, depth]);
      const geometry = new BoxGeometry(width, height, depth);
      geometry.translate(width / 2 + x1, height / 2 + y1, depth / 2 + z1);
      const materials = FaceDirections.reduce((acc, dir) => {
        const index = FaceDirectionOrder[dir];
        const face = element.faces[dir];
        if (face) {
          const key = face.texture.replace(/^#/, "");
          acc[index] = new MeshBasicMaterial({
            map: textures[key],
            transparent: true,
          });
        } else {
          acc[index] = new MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
          });
        }
        return acc;
      }, new Array<MeshBasicMaterial>(6));
      const cube = new Mesh(geometry, materials);
      cube.scale.set(16, 16, 16);
      this.root.add(cube);
    });
    this.scene.add(this.root);
  }
}
