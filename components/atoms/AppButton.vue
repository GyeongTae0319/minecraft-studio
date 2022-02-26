<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";

interface Props {
  to?: RouteLocationRaw;
  href?: string;
}

const { to, href } = defineProps<Props>();

const tagName = computed(() => {
  if (to) {
    return "RouterLink";
  } else if (href) {
    return "a";
  } else {
    return "button";
  }
});
const attrs = computed(() => {
  switch (tagName.value) {
    case "RouterLink":
      return { to: to };
    case "a":
      return {
        href: href,
        target: "_blank",
      };
    default:
      return {};
  }
});

const root = ref<HTMLAnchorElement | HTMLButtonElement>(null);

function focus() {
  root.value.focus();
}

defineExpose({
  focus,
});
</script>

<template>
  <component
    v-bind="attrs"
    :is="tagName"
    ref="root"
    class="app-button"
    @contextmenu.prevent
  >
    <slot />
  </component>
</template>

<style lang="scss" scoped>
.app-button {
  display: inline-flex;
  cursor: pointer;
}
</style>
