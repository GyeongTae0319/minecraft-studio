<script setup lang="ts">
import { DefineComponent } from "vue";
import { RouteLocationRaw } from "vue-router";

export interface Props {
  to?: RouteLocationRaw;
  href?: string;
}

const props = defineProps<Props>();

const { to, href } = toRefs(props);
const rootElement = ref<
  InstanceType<DefineComponent> | HTMLAnchorElement | HTMLButtonElement | null
>(null);

const tagName = computed(() => {
  if (to.value) {
    return "RouterLink";
  } else if (href.value) {
    return "a";
  } else {
    return "button";
  }
});
const attrs = computed(() => {
  switch (tagName.value) {
    case "RouterLink":
      return { to: to.value };
    case "a":
      return {
        href: href.value,
        target: "_blank",
      };
    case "button":
      return {};
  }
});

function focus() {
  if (rootElement.value instanceof HTMLElement) {
    rootElement.value.focus();
  } else {
    const anchorElement = <HTMLAnchorElement>rootElement.value.$el;
    anchorElement.focus();
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
