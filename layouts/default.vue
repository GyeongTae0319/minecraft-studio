<script setup lang="ts">
import { isFocusable } from "tabbable";
import TheAppMenu from "~/components/organisms/TheAppMenu.vue";

type TheAppMenuInstance = InstanceType<typeof TheAppMenu>;

useLayout().value.top = "56px";

const currentRouteName = computed(() => {
  return useRoute().name;
});
const rootElement = ref<HTMLDivElement>(null);
const menuElement = ref<TheAppMenuInstance>(null);
const mainElement = ref<HTMLDivElement>(null);
const menuOpened = ref(false);
const nowGesture = ref(false);
let pendingUpdateLayout = false;
let gestureStartX = 0;
let gestureLastX = 0;
let gestureProgress = ref(0);

const layoutStyles = computed<Record<string, string>>(() => {
  const transitionDuration = nowGesture.value ? "0" : "0.2s";
  const overlayDisplay =
    menuOpened.value || nowGesture.value ? "block" : "none";

  return {
    "--gesture-progress": String(gestureProgress.value),
    "--transition-duration": transitionDuration,
    "--main-transform-x": `calc((100vw - 56px) * ${gestureProgress.value})`,
    "--overlay-display": overlayDisplay,
    "--overlay-opacity": `${gestureProgress.value}`,
  };
});

function handleGestureStart(event: PointerEvent) {
  if (event.button !== 0 || event.buttons !== 1) return;
  const target = <HTMLElement>event.target;
  if (isFocusableRecursively(target)) return;
  event.preventDefault();
  target.setPointerCapture(event.pointerId);
  nowGesture.value = true;
  gestureStartX = event.clientX;
}
function handleGestureMove(event: PointerEvent) {
  if (!nowGesture.value) return;
  event.preventDefault();
  if (!gestureStartX) return;
  gestureLastX = event.clientX;
  if (pendingUpdateLayout) return;
  pendingUpdateLayout = true;
  requestAnimationFrame(updateLayout);
}
function handleGestureEnd(event: PointerEvent) {
  if (!nowGesture.value) return;
  event.preventDefault();
  if (!menuOpened.value && gestureProgress.value > 0.25) {
    openMenu();
  } else if (menuOpened.value && gestureProgress.value < 0.75) {
    closeMenu();
  } else {
    if (menuOpened.value) {
      gestureProgress.value = 1;
    } else {
      gestureProgress.value = 0;
    }
  }
  const target = <HTMLElement>event.target;
  target.releasePointerCapture(event.pointerId);
  pendingUpdateLayout = false;
  nowGesture.value = false;
  gestureStartX = 0;
  gestureLastX = 0;
}

function isFocusableRecursively(element: Element): boolean {
  if (isFocusable(element)) {
    return true;
  }
  const parent = element.parentElement;
  if (parent && !parent.isSameNode(rootElement.value)) {
    return isFocusableRecursively(parent);
  }
  return false;
}
function updateLayout() {
  const moveMax = document.body.offsetWidth - 56;
  const moveX = gestureLastX - gestureStartX;
  let to = 0;
  if (menuOpened.value) {
    to = moveMax + moveX;
  } else {
    to = moveX;
  }
  if (to < 0) to = 0;
  else if (to > moveMax) to = moveMax;
  gestureProgress.value = to / moveMax;
  nextTick(() => {
    pendingUpdateLayout = false;
  });
}

function onActivateMenu() {
  menuOpened.value = true;
  gestureProgress.value = 1;
}
function onDeactivateMenu() {
  menuOpened.value = false;
  gestureProgress.value = 0;
}

function openMenu() {
  menuElement.value.show();
}
function closeMenu() {
  menuElement.value.close();
}
</script>

<template>
  <div
    ref="rootElement"
    class="layout"
    :style="layoutStyles"
    @pointerdown.capture="handleGestureStart"
    @pointermove.capture="handleGestureMove"
    @pointerup.capture="handleGestureEnd"
    @pointercancel.capture="handleGestureEnd"
  >
    <div class="layout__menu">
      <TheAppMenu
        :focus-delay="200"
        ref="menuElement"
        @activate="onActivateMenu"
        @deactivate="onDeactivateMenu"
      />
    </div>
    <TheAppHeader class="layout__header" @open-menu="openMenu">
      <template #title>{{ currentRouteName }}</template>
    </TheAppHeader>
    <div ref="mainElement" class="layout__main">
      <slot />
    </div>
    <div class="layout__overlay" @click="closeMenu" />
  </div>
</template>

<style lang="scss" scoped>
.layout {
  touch-action: pan-y pinch-zoom;

  &__menu {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    padding-right: 64px;
  }
  &__header {
    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    left: 0;

    transform: translateX(var(--main-transform-x));
    transition: transform var(--transition-duration);
  }
  &__main {
    position: relative;
    z-index: 0;
    height: 100%;
    transform: translateX(var(--main-transform-x));
    transition: transform var(--transition-duration);
  }
  &__overlay {
    display: var(--overlay-display);
    opacity: var(--overlay-opacity);

    position: fixed;
    z-index: 1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    background-color: rgba(0 0 0 / 0.2);

    transform: translateX(var(--main-transform-x));
    transition-property: opacity transform;
    transition-duration: var(--transition-duration);
  }
}
</style>
