<script setup lang="ts">
import { DefineComponent } from "nuxt3/dist/app/compat/capi";
import { RouteLocationRaw } from "vue-router";

interface Props {
  to?: RouteLocationRaw;
  href?: string;
}

const props = defineProps<Props>();
const { to, href } = toRefs(props);

const tagName = computed(() => {
  if (to.value) {
    return "NuxtLink";
  } else if (href.value) {
    return "a";
  } else {
    return "button";
  }
});
const attrs = computed(() => {
  switch (tagName.value) {
    case "NuxtLink":
      return { to: to.value };
    case "a":
      return {
        href: href.value,
        target: "_blank",
      };
    default:
      return {};
  }
});

const rootElement = ref<
  InstanceType<DefineComponent> | HTMLAnchorElement | HTMLButtonElement | null
>(null);

function focus() {
  if (rootElement.value instanceof HTMLElement) {
    rootElement.value.focus();
  } else {
    const anchorElement = <HTMLAnchorElement>rootElement.value?.$el;
    anchorElement?.focus();
  }
}

defineExpose({
  focus,
});
</script>

<template>
  <component
    v-bind="attrs"
    :is="tagName"
    ref="rootElement"
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
