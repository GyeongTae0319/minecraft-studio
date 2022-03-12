<script setup lang="ts">
const layout = useLayout();

const rootStyles = computed<Record<string, string>>(() => {
  const { top, right, bottom, left } = layout.value.margin;

  return {
    "--layout-inset": `${top} ${right} ${bottom} ${left}`,
  };
});
</script>

<template>
  <div class="page-wrapper" :style="rootStyles">
    <div class="page-wrapper__slot-wrapper">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-wrapper {
  width: 100%;
  min-height: 100%;
  background-color: $color-background-normal;

  &__slot-wrapper {
    padding: var(--layout-inset);
  }
}
</style>
