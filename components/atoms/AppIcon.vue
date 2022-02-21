<script setup lang="ts">
import icons from "~/assets/icons.map.json";
import { PropType, StyleValue } from "nuxt3/dist/app/compat/capi";

const { icon, color, size } = defineProps({
  icon: {
    default: <keyof typeof icons.map>"cube",
    required: true,
    type: <PropType<keyof typeof icons.map>>String,
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

const rootStyles = computed(() => {
  return <StyleValue>{
    "--fill": color,
    "--size": computedSize.value,
    "--mask-size": `calc(${icons.width / 16} * ${computedSize.value})`,
    "--top": `calc(-${computedPos.value.y / 16} * ${computedSize.value})`,
    "--left": `calc(-${computedPos.value.x / 16} * ${computedSize.value})`,
  };
});
const computedPos = computed(() => {
  return icons.map[icon];
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
  mask-image: url("~/assets/icons.png");
  mask-size: var(--mask-size);
  mask-position: var(--left) var(--top);

  image-rendering: pixelated;
}
</style>
