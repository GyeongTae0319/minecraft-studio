export default class AssetsImageLoader {
  path = "";

  load(url: string): Promise<HTMLImageElement> {
    const target = (this.path || "") + url;

    return new Promise(async (resolve, reject) => {
      const image = document.createElement("img");
      image.addEventListener("load", () => {
        resolve(image);
      });
      image.addEventListener("error", (event) => {
        reject(event);
      });
      image.src = (await import(`../../assets/${target}.png`)).default;
    });
  }
}
