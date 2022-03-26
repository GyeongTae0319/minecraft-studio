import { NearestFilter, Texture } from "three";
import AssetsImageLoader from "./AssetsImageLoader";

export default class AssetsTextureLoader {
  path = "";

  load(url: string) {
    const texture = new Texture();

    return new Promise<Texture>(async (resolve, reject) => {
      const loader = new AssetsImageLoader();
      loader.path = this.path;
      try {
        texture.image = await loader.load(url);
        texture.minFilter = NearestFilter;
        texture.magFilter = NearestFilter;
        texture.needsUpdate = true;
        resolve(texture);
      } catch (error) {
        reject(error);
      }
    });
  }
}
