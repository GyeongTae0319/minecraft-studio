import { cloneDeep } from "lodash-es";
import { Model, TextureMeta } from "~/types/minecraft";

export default class McAssetLoader {
  async loadModel(target: string) {
    const { namespace, file } = this.normalizePath(target);
    const path = `../../assets/${namespace}/models/${file}.json`;

    return cloneDeep(<Model>(await import(path)).default);
  }

  async loadTexture(target: string): Promise<{
    texture: string;
    meta?: TextureMeta;
  }> {
    const { namespace, file } = this.normalizePath(target);
    const path = `../../assets/${namespace}/textures/${file}`;

    const texture = <string>(await import(`${path}.png`)).default;
    try {
      const meta = cloneDeep(
        <TextureMeta>(await import(`${path}.mcmeta`)).default
      );
      return { texture, meta };
    } catch (error) {
      return { texture };
    }
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
