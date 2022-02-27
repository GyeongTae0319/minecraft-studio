<script setup lang="ts">
import icons from "~/assets/icons.map.json";
import { StyleValue } from "nuxt3/dist/app/compat/capi";

interface Props {
  icon: keyof typeof icons.map;
  color?: string;
  size?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  color: "currentColor",
  size: 16,
});
const { icon, color, size } = toRefs(props);

const rootStyles = computed(() => {
  return <StyleValue>{
    "--fill": color.value,
    "--size": computedSize.value,
    "--mask-size": `calc(${icons.width / 16} * ${computedSize.value})`,
    "--top": `calc(-${computedPos.value.y / 16} * ${computedSize.value})`,
    "--left": `calc(-${computedPos.value.x / 16} * ${computedSize.value})`,
  };
});
const computedPos = computed(() => {
  return icons.map[icon.value];
});
const computedSize = computed(() => {
  if (isNaN(Number(size.value))) {
    return size.value;
  }
  return size.value + "px";
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
