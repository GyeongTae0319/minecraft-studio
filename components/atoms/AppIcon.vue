<script setup lang="ts">
import { StyleValue } from "nuxt3/dist/app/compat/capi";

const { icon, color, size } = defineProps({
  icon: {
    default: "",
    required: true,
    type: String,
  },
  color: {
    default: "currentColor",
    required: false,
    type: String,
  },
  size: {
    default: 16,
    required: false,
    type: [Number, String],
  },
});

const rootStyles = <StyleValue>computed(() => {
  return {
    "--fill": color,
    "--size": String(computedSize.value),
  };
});
const computedSize = computed(() => {
  if (isNaN(Number(size))) {
    return size;
  }
  return size + "px";
});
</script>

<template>
  <span class="app-icon" :style="rootStyles" />
</template>

<style lang="scss" scoped>
.app-icon {
  display: inline-block;

  width: var(--size);
  height: var(--size);

  background-color: var(--fill);
  background-size: calc(var(--size) * 2);
  mask-image: url("~/assets/icons.png");
  mask-size: 200%;

  image-rendering: pixelated;
}
</style>
