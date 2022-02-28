<script setup lang="ts">
import TheAppMenu from "~/components/organisms/TheAppMenu.vue";

type TheAppMenuInstance = InstanceType<typeof TheAppMenu>;

const currentRouteName = computed(() => {
  return useRoute().name;
});
const menuElement = ref<TheAppMenuInstance>(null);
const menuOpened = ref(false);
const nowGesture = ref(false);
let pendingUpdateLayout = false;
let gestureStartX = 0;
let gestureLastX = 0;
let gestureMoveX = ref(0);
let gestureProgress = ref(0);

const layoutStyles = computed<Record<string, string>>(() => ({
  "--gesture-move-x": gestureMoveX.value + "px",
  "--gesture-progress": String(gestureProgress.value),
}));
const mainClasses = computed(() => ({
  "layout__main--menu": menuOpened.value,
  "layout__main--gesture": nowGesture.value,
  "layout__main--no-gesture": !nowGesture.value,
}));

onMounted(() => {
  window.addEventListener("pointerdown", handleGestureStart, true);
  window.addEventListener("pointermove", handleGestureMove, true);
  window.addEventListener("pointerup", handleGestureEnd, true);
  window.addEventListener("pointercancel", handleGestureEnd, true);
});
onUnmounted(() => {
  window.removeEventListener("pointerdown", handleGestureStart, true);
  window.removeEventListener("pointermove", handleGestureMove, true);
  window.removeEventListener("pointerup", handleGestureEnd, true);
  window.removeEventListener("pointercancel", handleGestureEnd, true);
});

function handleGestureStart(event: PointerEvent) {
  if (event.button !== 0 || event.buttons !== 1) return;
  event.preventDefault();
  const target = <HTMLElement>event.target;
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
  if (gestureProgress.value > 0.5) {
    openMenu();
  } else {
    closeMenu();
  }
  const target = <HTMLElement>event.target;
  target.releasePointerCapture(event.pointerId);
  pendingUpdateLayout = false;
  nowGesture.value = false;
  gestureStartX = 0;
  gestureLastX = 0;

  nextTick(() => {
    const moveMax = document.body.offsetWidth - 56;
    if (menuOpened.value) {
      gestureMoveX.value = moveMax;
      gestureProgress.value = 1;
    } else {
      gestureMoveX.value = 0;
      gestureProgress.value = 0;
    }
  });
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
  gestureMoveX.value = to;
  gestureProgress.value = to / moveMax;
  nextTick(() => {
    pendingUpdateLayout = false;
  });
}

function onActivateMenu() {
  const moveMax = document.body.offsetWidth - 56;
  menuOpened.value = true;
  gestureMoveX.value = moveMax;
  gestureProgress.value = 1;
}
function onDeactivateMenu() {
  menuOpened.value = false;
  gestureMoveX.value = 0;
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
  <div class="layout" :style="layoutStyles">
    <div class="layout__menu">
      <TheAppMenu
        ref="menuElement"
        @activate="onActivateMenu"
        @deactivate="onDeactivateMenu"
      />
    </div>
    <div class="layout__main" :class="mainClasses">
      <TheAppHeader @open-menu="openMenu">
        <template #title>{{ currentRouteName }}</template>
      </TheAppHeader>
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  touch-action: pan-y pinch-zoom;
  height: 100%;

  &__menu {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;

    padding-right: 64px;
    background-color: $color-background-darker;
  }
  &__main {
    position: relative;

    height: 100%;
    background-color: $color-background-normal;

    &::after {
      content: "";
      display: none;
      opacity: 0;

      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background-color: rgba(0 0 0 / 0.2);
    }

    &--menu {
      transform: translateX(calc(100% - 56px));

      &::after {
        display: block;
        opacity: 1;
      }
    }
    &--no-gesture {
      transition: transform 0.2s;

      &::after {
        transition: opacity 0.2s;
      }
    }
    &--gesture {
      transform: translateX(calc((100% - 56px) * var(--gesture-progress)));

      &::after {
        display: block;
        opacity: var(--gesture-progress);
      }
    }
  }
}
</style>
