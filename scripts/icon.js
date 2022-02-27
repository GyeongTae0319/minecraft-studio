"use strict";

import canvas from "canvas";
import { readdirSync, renameSync, writeFileSync } from "fs";
import path from "path";

/**
 * @typedef {{
 *   x: number;
 *   y: number;
 * }} Coords
 */

class IconSpriteBuilder {
  inputFolder = "";
  outputPath = {
    sprite: "",
    map: "",
  };
  /**@type {string[]} */
  files = [];
  size = 0;
  /**@type {import("canvas").Canvas} */
  canvas = null;
  /**@type {import("canvas").CanvasRenderingContext2D} */
  context = null;
  /**@type {Record<string, Coords>} */
  spriteMap = {};

  /**
   * @param {{
   *   input: string;
   *   output: {
   *     sprite: string;
   *     map: string;
   *   };
   * }} options
   */
  constructor(options) {
    this.inputFolder = options.input.replace(/\/?$/, "/");
    this.outputPath = { ...options.output };
  }

  async build() {
    this.getIconFiles();
    this.removeFigmaExportPrefix();
    this.computeSize();
    this.initCanvas();
    await this.drawSprite();
    this.writeFiles();
  }

  getIconFiles() {
    const files = readdirSync(this.inputFolder);
    this.files = files.filter((fileName) => {
      return path.extname(fileName) === ".png";
    });
  }
  removeFigmaExportPrefix() {
    this.files.forEach((fileName, index) => {
      const newName = fileName.replace(/^.*?=/, "");
      renameSync(this.inputFolder + fileName, this.inputFolder + newName);
      this.files[index] = newName;
    });
  }
  computeSize() {
    let col = 2;
    while (col * col < this.files.length) {
      col *= 2;
    }
    this.size = col * 16;
  }
  initCanvas() {
    this.canvas = canvas.createCanvas(this.size, this.size);
    this.context = this.canvas.getContext("2d");
  }
  async drawSprite() {
    for (let i = 0; i < this.files.length; i++) {
      const file = this.files[i];
      /**@type {Coords} */
      const pos = {
        x: (i % (this.size / 16)) * 16,
        y: Math.floor(i / (this.size / 16)) * 16,
      };
      const image = await canvas.loadImage(this.inputFolder + file);
      this.context.drawImage(image, pos.x, pos.y);

      const name = path.basename(file, path.extname(file));
      this.spriteMap[name] = { ...pos };
    }
  }
  writeFiles() {
    writeFileSync(this.outputPath.sprite, this.canvas.toBuffer());
    writeFileSync(
      this.outputPath.map,
      JSON.stringify({
        width: this.size,
        height: this.size,
        map: this.spriteMap,
      })
    );
  }
}

new IconSpriteBuilder({
  input: "./assets/icons",
  output: {
    sprite: "./assets/sprites/icons.png",
    map: "./assets/sprites/icons.map.json",
  },
}).build();
