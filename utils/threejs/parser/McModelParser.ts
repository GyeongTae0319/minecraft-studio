import { isEqual } from "lodash-es";
import { BoxGeometry, Group, Mesh, MeshPhongMaterial, Texture } from "three";
import { degToRad } from "three/src/math/MathUtils";
import {
  Model,
  ModelElement,
  ModelFace,
  ModelFaceDir,
  ModelFaceUV,
  ModelVector3,
} from "~/types/minecraft";

type BoxGeometryMaterials = [
  MeshPhongMaterial,
  MeshPhongMaterial,
  MeshPhongMaterial,
  MeshPhongMaterial,
  MeshPhongMaterial,
  MeshPhongMaterial
];

enum Pos {
  x,
  y,
  z,
}
enum Dir {
  east,
  west,
  up,
  down,
  south,
  north,
}
enum Size {
  width,
  height,
  depth,
}

const Dirs = Object.freeze(<const>[
  "north",
  "south",
  "up",
  "down",
  "east",
  "west",
]);
const UVAxisMap = Object.freeze(<const>{
  north: ["x", "y"],
  south: ["x", "y"],
  up: ["x", "z"],
  down: ["x", "z"],
  east: ["z", "y"],
  west: ["z", "y"],
});

const DefaultMaterial = new MeshPhongMaterial({
  color: 0x000000,
  opacity: 0,
  transparent: true,
});

export default class McModelParser {
  private model: Model;
  private textures: Record<string, Texture>;
  private root: Group;

  private element: ModelElement;
  private size: ModelVector3;
  private geometry: BoxGeometry;
  private materials: BoxGeometryMaterials;
  private face: ModelFace;
  private faceDir: ModelFaceDir;
  private faceTexture: Texture;

  parse(model: Model, textures: Record<string, Texture>) {
    this.model = model;
    this.textures = textures;
    this.root = new Group();
    this.model.elements?.forEach((element, i) => {
      this.element = element;
      const cube = this.parseElement();
      cube.scale.set(16, 16, 16);
      this.root.add(cube);
    });
    return this.root;
  }

  private parseElement() {
    this.size = <ModelVector3>this.element.from.map((value, index) => {
      return this.element.to[index] - value;
    });

    this.geometry = new BoxGeometry(...this.size);
    this.setUV();
    this.geometry.translate(
      ...(<ModelVector3>this.size.map((n, index) => {
        return n / 2 + this.element.from[index] - 8;
      }))
    );

    this.materials = this.getMaterials();

    return new Mesh(this.geometry, this.materials);
  }

  private setUV() {
    const index = this.geometry.getIndex();
    const uvAttr = this.geometry.getAttribute("uv");

    const entries = <[ModelFaceDir, ModelFace][]>(
      Object.entries(this.element.faces)
    );
    entries.forEach(([dir, face]) => {
      this.face = face;
      this.faceDir = dir;
      const uv = this.parseFaceUV();
      if (isEqual(uv, [0, 0, 1, 1])) return;
      const vertexIndex = Dir[this.faceDir];
      const parsedUVMap: Record<number, boolean> = {};
      for (let i = 0; i < 6; i++) {
        const target = index.getX(6 * vertexIndex + i);
        if (parsedUVMap[target]) continue;
        const x = uvAttr.getX(target);
        const y = uvAttr.getY(target);
        uvAttr.setXY(target, uv[x * 2], uv[y * 2 + 1]);
        parsedUVMap[target] = true;
      }
    });
  }
  private parseFaceUV(): ModelFaceUV {
    if (this.face.uv) {
      return <ModelFaceUV>this.face.uv.map((n) => n / 16);
    }
    const [axisX, axisY] = UVAxisMap[this.faceDir];
    const [xIndex, yIndex] = [Pos[axisX], Pos[axisY]];
    const from = this.element.from;
    const to = this.element.to;
    return [
      from[xIndex] / 16,
      from[yIndex] / 16,
      to[xIndex] / 16,
      to[yIndex] / 16,
    ];
  }

  private getMaterials() {
    return <BoxGeometryMaterials>Dirs.reduce((acc, dir) => {
      const index = Dir[dir];
      this.face = this.element.faces[dir];
      this.faceDir = dir;
      acc[index] = this.parseFaceMaterial();
      return acc;
    }, new Array<MeshPhongMaterial>(6));
  }
  private parseFaceMaterial() {
    if (!this.face) return DefaultMaterial;
    const key = this.face.texture.replace(/^#/, "");
    this.faceTexture = this.textures[key].clone();
    this.faceTexture.center.set(0.5, 0.5);
    if (!this.faceTexture || !(this.faceTexture instanceof Texture)) {
      return DefaultMaterial;
    } else {
      if (this.face.rotation) {
        console.log(degToRad(this.face.rotation));
        this.faceTexture.rotation = degToRad(this.face.rotation);
      }
      const material = new MeshPhongMaterial({
        map: this.faceTexture,
        alphaTest: 1,
        transparent: true,
      });
      material.needsUpdate = true;
      return material;
    }
  }
}
