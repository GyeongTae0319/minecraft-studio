<script setup lang="ts">
import {
  BoxGeometry,
  Mesh,
  MeshBasicMaterial,
  OrthographicCamera,
  Scene,
  WebGLRenderer,
} from "three";
import AssetsTextureLoader from "~~/utils/threejs/AssetsTextureLoader";

const canvas = ref<HTMLCanvasElement>(null);
const size = 256;

onMounted(async () => {
  const scene = new Scene();
  const camera = new OrthographicCamera(
    size / -2,
    size / 2,
    size / 2,
    size / -2,
    1,
    3000
  );

  const renderer = new WebGLRenderer({
    canvas: canvas.value,
  });
  renderer.setSize(size, size);

  const loader = new AssetsTextureLoader();
  loader.path = "minecraft/textures/";
  const textures = await Promise.all(
    [
      "block/acacia_planks",
      "block/amethyst_block",
      "block/barrel_top",
      "block/blue_ice",
      "block/beehive_front_honey",
      "block/blue_wool",
    ].map((path) => loader.load(path))
  );

  const cubeSize = 160;

  const geometry = new BoxGeometry(cubeSize, cubeSize, cubeSize);
  const materials = textures.map(
    (texture) =>
      new MeshBasicMaterial({
        map: texture,
      })
  );
  const cube = new Mesh(geometry, materials);
  scene.add(cube);

  camera.position.set(1 * cubeSize, (6 ** 0.5 / 3) * cubeSize, 1 * cubeSize);
  camera.lookAt(0, 0, 0);

  function anim() {
    requestAnimationFrame(anim);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
  }
  anim();
});
</script>

<template>
  <canvas
    :width="size"
    :height="size"
    ref="canvas"
    class="block-model-renderer"
  />
</template>

<style lang="scss" scoped></style>
