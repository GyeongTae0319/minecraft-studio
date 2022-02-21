"use strict";

import Canvas from "canvas";
import { readdirSync, writeFileSync } from "fs";
import path from "path";

class IconSpriteBuilder {
  /**@type {string} */
  path = "";
  /**@type {string[]} */
  files = [];
  /**@type {number} */
  size = 0;

  /**@param {string} path */
  constructor(path) {
    this.path = path.replace(/\/?$/, "/");
  }

  build() {
    this.getIconFiles();
    this.computeSize();
    this.drawSprite();
  }

  getIconFiles() {
    this.files = readdirSync(this.path).filter((name) => {
      return path.extname(name) === ".png";
    });
  }
  computeSize() {
    let col = 2;
    while (col * col < this.files.length) {
      col *= 2;
    }
    this.size = col * 16;
  }
  async drawSprite() {
    const canvas = Canvas.createCanvas(this.size, this.size);
    const ctx = canvas.getContext("2d");
    const map = {};

    for (const i in this.files) {
      const file = this.files[i];
      const image = await Canvas.loadImage(this.path + file);
      const pos = [(i % (this.size / 16)) * 16, Math.floor(i / (this.size / 16)) * 16];
      ctx.drawImage(image, pos[0], pos[1]);
      map[path.basename(file, path.extname(file))] = {
        x: pos[0],
        y: pos[1],
      };
    }

    writeFileSync("./test.png", canvas.toBuffer());
    writeFileSync("./test.json", JSON.stringify(map));
  }
}

const builder = new IconSpriteBuilder("../assets/icons");
builder.build();
