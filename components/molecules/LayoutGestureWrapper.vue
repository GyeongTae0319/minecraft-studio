<script setup lang="ts">
import { isFocusable } from "tabbable";

interface Emits {
  (event: "start"): void;
  (event: "move", moveX: number): void;
  (event: "end"): void;
}

const emits = defineEmits<Emits>();

const rootElement = ref<HTMLDivElement>(null);
const nowGesture = ref(false);
let startX = -1;

function handleGestureStart(event: PointerEvent) {
  if (event.button !== 0 || event.buttons !== 1) return;
  const target = <HTMLElement>event.target;
  if (isInFocusable(target)) return;
  event.preventDefault();
  target.setPointerCapture(event.pointerId);
  nowGesture.value = true;
  startX = event.clientX;
  emits("start");
}
function handleGestureMove(event: PointerEvent) {
  if (!nowGesture.value || startX < 0) return;
  event.preventDefault();
  emits("move", event.clientX - startX);
}
function handleGestureEnd(event: PointerEvent) {
  if (!nowGesture.value) return;
  event.preventDefault();
  const target = <HTMLElement>event.target;
  target.releasePointerCapture(event.pointerId);
  startX = -1;
  emits("end");
}

function isInFocusable(element: Element): boolean {
  if (isFocusable(element)) return true;
  const parent = element.parentElement;
  if (parent && !parent.isSameNode(rootElement.value)) {
    return isInFocusable(parent);
  }
  return false;
}
</script>

<template>
  <div
    ref="rootElement"
    class="layout-gesture-wrapper"
    @pointerdown.capture="handleGestureStart"
    @pointermove.capture="handleGestureMove"
    @pointerup.capture="handleGestureEnd"
    @pointercancel.capture="handleGestureEnd"
  >
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.layout-gesture-wrapper {
  touch-action: pan-y pinch-zoom;
}
</style>
