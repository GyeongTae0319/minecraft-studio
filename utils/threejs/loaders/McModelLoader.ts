import { cloneDeep } from "lodash-es";
import { NearestFilter, Texture } from "three";
import { Model, TextureMeta } from "~/types/minecraft";
import McAssetLoader from "~/utils/minecraft/McAssetLoader";

export default class McModelLoader {
  assetLoader: McAssetLoader;

  constructor() {
    this.assetLoader = new McAssetLoader();
  }

  load(target: string) {
    return this.assetLoader.loadModel(target);
  }
  async parse(model: Model): Promise<Model> {
    const child = cloneDeep(model);
    if (child.parent) {
      const parent = await this.load(child.parent);
      parent.textures = this.parseTextures(parent, child);
      const parsedParent = await this.parse(parent);
      return {
        ...parsedParent,
        ...child,
        parent: undefined,
        textures: parsedParent.textures,
      };
    }
    return child;
  }

  async loadTextures(model: Model) {
    const textureEntries = await Promise.all(
      Object.entries(model.textures).map(async ([key, value]) => {
        const { texture, meta } = await this.assetLoader.loadTexture(value);
        return <[string, Texture]>[
          key,
          await this.createMaterialTexture(texture, meta),
        ];
      })
    );
    return textureEntries.reduce((acc, [key, texture]) => {
      return {
        ...acc,
        [key]: texture,
      };
    }, <Record<string, Texture>>{});
  }

  parseTextures(parent: Model, child: Model) {
    if (!parent.textures) return child.textures;
    const result = { ...parent.textures, ...child.textures };
    Object.entries(result).forEach(([key, value]) => {
      const childKey = value.replace(/^#/, "");
      result[key] = child?.textures[childKey] || value;
    });
    return result;
  }

  createMaterialTexture(texture: string, meta?: TextureMeta) {
    return new Promise<Texture>((resolve, reject) => {
      const resultTexture = new Texture();
      const image = document.createElement("img");
      image.addEventListener("load", () => {
        resultTexture.image = image;
        resultTexture.magFilter = NearestFilter;
        resultTexture.needsUpdate = true;
        resolve(resultTexture);
      });
      image.addEventListener("error", (event) => {
        reject(event);
      });
      image.src = texture;
    });
  }
}
