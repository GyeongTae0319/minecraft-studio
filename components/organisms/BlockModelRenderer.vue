<script setup lang="ts">
import McModelLoader from "~/utils/threejs/loaders/McModelLoader";
import McModelRenderer from "~/utils/threejs/renderers/McModelRenderer";

const canvas = ref<HTMLCanvasElement>(null);
const size = 512;

const loader = new McModelLoader();
let renderer: McModelRenderer = null;

onMounted(async () => {
  renderer = new McModelRenderer({
    canvas: canvas.value,
  });
  const model = await loader.load("minecraft:block/torch");
  // const model = await loader.load("studio:block/dir");
  const parsed = await loader.parse(model);
  const textures = await loader.loadTextures(parsed);

  renderer.add(parsed, textures);

  renderer.camera.position.set(256, 256, -256);
  renderer.camera.lookAt(0, 0, 0);

  function anim(t = 0) {
    requestAnimationFrame(anim);
    renderer.root.position.x = Math.sin(t / 128) * 8;
    // renderer.root.rotation.x += 0.01;
    renderer.root.rotation.y += 0.01;
    renderer.renderer.render(renderer.scene, renderer.camera);
  }
  anim();
});
onUnmounted(() => {
  renderer.destory();
  renderer = null;
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

<style lang="scss" scoped>
.block-model-renderer {
  display: block;
  margin: 0 auto;
}
</style>
