<script setup lang="ts">
import icons from "~/assets/icons.map.json";

interface Props {
  icon: keyof typeof icons.map;
}

const { icon } = defineProps<Props>();
</script>

<template>
  <AppButton class="icon-button">
    <AppIcon :icon="icon" size="32" class="icon-button__icon" />
  </AppButton>
</template>

<style lang="scss" scoped>
.icon-button {
  --shadow-opacity: 0;
  --shadow-size: 50%;

  position: relative;
  line-height: 0;

  &::before {
    content: "";
    display: block;

    opacity: var(--shadow-opacity);

    position: absolute;
    top: 50%;
    left: 50%;

    width: var(--shadow-size);
    height: var(--shadow-size);
    border-radius: 100%;
    background-color: #ffffff;

    transform: translate(-50%, -50%);
    transition-property: opacity width height;
    transition-duration: 0.1s;
  }

  &:hover,
  &:focus-visible {
    --shadow-opacity: 0.1;
    --shadow-size: 125%;
  }
  &:active {
    --shadow-opacity: 0.05;
    --shadow-size: 125%;
  }
}
</style>
