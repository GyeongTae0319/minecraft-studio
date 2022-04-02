import { cloneDeep } from "lodash-es";
import { Model, TextureMeta } from "~/types/minecraft";

interface TextureData {
  texture: string;
  meta?: TextureMeta;
}

export default class McAssetLoader {
  async loadModel(target: string) {
    const { namespace, file } = this.normalizePath(target);
    const res = await import(`../../assets/${namespace}/models/${file}.json`);
    const json: Model = res.default;
    return cloneDeep(json);
  }

  async loadTexture(target: string): Promise<TextureData> {
    const { namespace, file } = this.normalizePath(target);
    const result: TextureData = {
      texture: "",
    };

    try {
      const res = await import(
        `../../assets/${namespace}/textures/${file}.png`
      );
      result.texture = res.default;
    } catch (error) {}
    try {
      const res = await import(
        `../../assets/${namespace}/textures/${file}.mcmeta`
      );
      const meta: TextureMeta = res.default;
      result.meta = meta;
    } catch (error) {}

    return result;
  }

  normalizePath(path: string) {
    let namespace = "minecraft";
    let file = path;

    const splitted = path.split(":");
    if (splitted.length > 1) {
      namespace = splitted[0];
      file = splitted.slice(1).join(":");
    }

    return {
      namespace,
      file,
    };
  }
}
