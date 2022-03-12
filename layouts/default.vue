<script setup lang="ts">
import TheAppMenu from "~/components/organisms/TheAppMenu.vue";

type TheAppMenuInstance = InstanceType<typeof TheAppMenu>;

const layout = useLayout();
layout.value.margin.top = "56px";

const menuElement = ref<TheAppMenuInstance>(null);
const menuOpened = ref(false);
const nowGesture = ref(false);
const gestureProgress = ref(0);

const currentRouteName = computed(() => {
  return useRoute().name;
});
const rootStyles = computed<Record<string, string>>(() => {
  const progress = gestureProgress.value;
  return {
    "--transition-duration": nowGesture.value ? "0" : "0.25s",
    "--main-transform-x": `calc(${100 * progress}% - ${56 * progress}px)`,
    "--overlay-point-event": menuOpened.value ? "unset" : "none",
    "--overlay-opacity": `${gestureProgress.value}`,
  };
});

function openMenu() {
  menuElement.value.show();
}
function closeMenu() {
  menuElement.value.close();
}

function onGestureStart() {
  nowGesture.value = true;
}
function onGestureMove(moveX: number) {
  if (!layout.value.bodyScrollLock) {
    layout.value.bodyScrollLock = true;
  }
  const max = document.documentElement.offsetWidth;
  let curProgress = menuOpened.value ? max + moveX : moveX;
  if (curProgress < 0) curProgress = 0;
  if (curProgress > max) curProgress = max;
  gestureProgress.value = curProgress / max;
}
function onGestureEnd() {
  nowGesture.value = false;
  if (!menuOpened.value && gestureProgress.value > 0.25) {
    openMenu();
  } else if (menuOpened.value && gestureProgress.value < 0.75) {
    closeMenu();
  } else {
    gestureProgress.value = menuOpened.value ? 1 : 0;
  }
  if (gestureProgress.value === 0) {
    layout.value.bodyScrollLock = false;
  }
}

function onActivateMenu() {
  menuOpened.value = true;
  gestureProgress.value = 1;
}
function onDeactivateMenu() {
  menuOpened.value = false;
  gestureProgress.value = 0;
}

function onMainTransitionEnd() {
  if (menuOpened.value) {
    layout.value.bodyScrollLock = true;
  } else {
    layout.value.bodyScrollLock = false;
  }
}
</script>

<template>
  <LayoutGestureWrapper
    class="layout"
    :style="rootStyles"
    @start="onGestureStart"
    @move="onGestureMove"
    @end="onGestureEnd"
  >
    <div class="layout__menu">
      <TheAppMenu
        :focus-delay="250"
        ref="menuElement"
        @activate="onActivateMenu"
        @deactivate="onDeactivateMenu"
      />
    </div>
    <TheAppHeader class="layout__header" @open-menu="openMenu">
      <template #title>{{ currentRouteName }}</template>
    </TheAppHeader>
    <div class="layout__main" @transitionend="onMainTransitionEnd">
      <slot />
    </div>
    <div class="layout__overlay" @click="closeMenu" />
  </LayoutGestureWrapper>
</template>

<style lang="scss" scoped>
.layout {
  width: 100%;
  height: 100%;

  &__menu {
    position: fixed;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;
    padding-right: 64px;
  }
  &__header {
    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;

    transform: translateX(var(--main-transform-x));
    transition: transform var(--transition-duration);
  }
  &__main {
    position: relative;
    z-index: 0;
    width: 100%;
    height: 100%;
    transform: translateX(var(--main-transform-x));
    transition: transform var(--transition-duration);
  }
  &__overlay {
    opacity: var(--overlay-opacity);
    pointer-events: var(--overlay-point-event);

    position: fixed;
    z-index: 1;
    top: 0;
    left: 0;

    width: 100%;
    height: 100%;

    background-color: rgba(0 0 0 / 0.2);

    transform: translateX(var(--main-transform-x));
    transition-property: opacity, transform;
    transition-duration: var(--transition-duration);
  }
}
</style>
