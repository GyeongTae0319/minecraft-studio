<script setup lang="ts">
import TheAppMenu from "~/components/organisms/TheAppMenu.vue";

type TheAppMenuInstance = InstanceType<typeof TheAppMenu>;

const mainElement = ref<HTMLDivElement>(null);
const mainIsDisabled = ref(false);
const mainIsDragging = ref(false);
const mainDragX = ref(0);
const mainDragProgress = ref(0);
const menuElement = ref<TheAppMenuInstance>(null);
const menuIsOpened = ref(false);
const dragStartPos = { x: 0, y: 0 };
const dragCurrentPos = { x: 0, y: 0 };
let framePending = false;

const rootClasses = computed(() => ({
  "layout--menu-opened": mainIsDisabled.value,
}));
const mainClasses = computed(() => ({
  "layout__main--disabled": menuIsOpened.value,
  "layout__main--dragging": mainIsDragging.value,
}));
const mainStyles = computed<Record<string, string>>(() => ({
  "--drag-x": mainDragX.value + "px",
  "--drag-progress": String(mainDragProgress.value),
}));
const overlayClasses = computed(() => ({
  "layout__main__overlay--dragging": mainIsDragging.value,
}));
const currentRouteName = computed(() => {
  return useRoute().name;
});

function handleGestureStart(event: TouchEvent) {
  if (menuIsOpened.value) return;
  event.preventDefault();
  if (event.touches.length > 1) return;
  mainIsDragging.value = true;
  dragStartPos.x = event.targetTouches[0].clientX;
  dragStartPos.y = event.targetTouches[0].clientY;
  console.log("Start", dragStartPos, dragCurrentPos);
}
function handleGestureMove(event: TouchEvent) {
  if (menuIsOpened.value) return;
  event.preventDefault();
  dragCurrentPos.x = event.targetTouches[0].clientX;
  dragCurrentPos.y = event.targetTouches[0].clientY;

  if (framePending) return;
  framePending = true;
  requestAnimationFrame(drawGestureFrame);
  console.log("Move", dragStartPos, dragCurrentPos);
}
function handleGestureEnd(event: TouchEvent) {
  if (menuIsOpened.value) return;
  event.preventDefault();
  if (mainDragProgress.value > 0.5) {
    openMenu();
  } else {
    closeMenu();
  }
  mainIsDragging.value = false;
  dragStartPos.x = 0;
  dragStartPos.y = 0;
  dragCurrentPos.x = 0;
  dragCurrentPos.y = 0;
  mainDragX.value = 0;
  mainDragProgress.value = 0;
  console.log("End", dragStartPos, dragCurrentPos);
}
function drawGestureFrame() {
  if (!framePending) return;
  const max = mainElement.value.offsetWidth - 56;
  let to = dragCurrentPos.x - dragStartPos.x;
  if (to > max) to = max;
  else if (to < 0) to = 0;
  mainDragProgress.value = to / max;
  mainDragX.value = to;
  nextTick(() => {
    framePending = false;
  });
}

function openMenu() {
  menuElement.value.show();
}
function closeMenu() {
  menuElement.value.close();
}
</script>

<template>
  <div class="layout" :class="rootClasses">
    <div class="layout__menu">
      <TheAppMenu
        ref="menuElement"
        @activate="menuIsOpened = true"
        @deactivate="menuIsOpened = false"
      />
    </div>
    <div
      class="layout__main"
      ref="mainElement"
      :class="mainClasses"
      :style="mainStyles"
      @touchstart="handleGestureStart"
      @touchmove="handleGestureMove"
      @touchend="handleGestureEnd"
      @touchcancel="handleGestureEnd"
    >
      <TheAppHeader @open-menu="openMenu">
        <template #title>{{ currentRouteName }}</template>
      </TheAppHeader>
      <slot />
      <Transition
        name="layout__main__overlay"
        @enter="mainIsDisabled = true"
        @enter-cancelled="mainIsDisabled = false"
        @after-leave="mainIsDisabled = false"
        @leave-cancelled="mainIsDisabled = true"
      >
        <div
          v-if="menuIsOpened || mainIsDragging"
          class="layout__main__overlay"
          :class="overlayClasses"
          @click="closeMenu"
        />
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.layout {
  height: 100%;

  &--menu-opened {
    overflow-x: hidden;
  }

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
    z-index: 1;

    height: 100%;
    background-color: $color-background-normal;

    transition: transform 0.2s;

    &--disabled {
      transform: translateX(calc(100% - 56px));
    }
    &--dragging {
      transition: none;
      transform: translateX(var(--drag-x));
    }

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background-color: rgba(0 0 0 / 0.2);
      transition: opacity 0.2s;

      &--dragging {
        opacity: var(--drag-progress);
        transition: none;
      }

      &:not(.layout__main__overlay--dragging) {
        &.layout__main__overlay-enter-from,
        &.layout__main__overlay-leave-to {
          opacity: 0;
        }
      }
    }
  }
}
</style>
