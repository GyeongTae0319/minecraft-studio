<script setup lang="ts">
import IconButton from "../atoms/IconButton.vue";

interface Emits {
  (event: "open-menu"): void;
}

const emit = defineEmits<Emits>();

function openMenu() {
  emit("open-menu");
}
</script>

<template>
  <header class="the-app-header">
    <IconButton
      icon="menu"
      class="the-app-header__menu"
      aria-label="Open menu"
      @click="openMenu"
    />
    <h1 class="the-app-header__title">
      <slot name="title" />
    </h1>
  </header>
</template>

<style lang="scss" scoped>
.the-app-header {
  display: flex;
  align-items: center;
  padding: 12px;

  background-color: $color-background-dark;

  color: $color-font-strong;
  font-weight: bold;

  &__menu {
    margin-right: 24px;
  }
  &__title {
    font-size: x-large;
  }
}
</style>
