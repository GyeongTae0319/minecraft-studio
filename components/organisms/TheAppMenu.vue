<script setup lang="ts">
import { createFocusTrap, FocusTrap } from "focus-trap";
import { NavigationFailure } from "vue-router";

interface Emits {
  (event: "activate"): void;
  (event: "deactivate"): void;
}
interface Link {
  to: string;
  icon: string;
  label: string;
  exact?: boolean;
}
type RouterNavigate = (e?: MouseEvent) => Promise<void | NavigationFailure>;

const emit = defineEmits<Emits>();

const links: Link[] = [
  {
    icon: "Test",
    label: "Home",
    to: "/",
    exact: true,
  },
  {
    icon: "Test",
    label: "Test",
    to: "/test",
  },
];
const rootElement = ref<HTMLElement>(null);
let focusTrap: FocusTrap = null;
let popStateAction: Function = null;
const isActive = ref(false);

onMounted(() => {
  window.addEventListener("popstate", onWindowPopState);
  window.addEventListener("keydown", onWindowKeyDown);
});
onBeforeUnmount(() => {
  window.removeEventListener("popstate", onWindowPopState);
  window.removeEventListener("keydown", onWindowKeyDown);
});
function onWindowPopState() {
  doDeactivate();
  if (typeof popStateAction === "function") {
    popStateAction();
    popStateAction = null;
  }
}
function onWindowKeyDown(event: KeyboardEvent) {
  if (event.key === "Escape" || event.key === "Esc") {
    event.preventDefault();
    close();
  }
}

function show() {
  if (isActive.value) return;
  history.pushState({}, "");
  isActive.value = true;
  activateFocusTrap();
  emit("activate");
}
function close() {
  if (!isActive.value) return;
  useRouter().back();
}

function activateFocusTrap() {
  if (!focusTrap) {
    focusTrap = createFocusTrap(rootElement.value, {
      allowOutsideClick: true,
      escapeDeactivates: false,
    });
  }
  focusTrap.activate();
}
function doDeactivate() {
  if (!isActive.value) return;
  isActive.value = false;
  focusTrap.deactivate();
  emit("deactivate");
}
function doNavigate(next: RouterNavigate) {
  popStateAction = () => nextTick(next);
  close();
}

defineExpose({
  show,
  close,
});
</script>

<template>
  <nav ref="rootElement" class="the-app-menu" aria-label="App Menu">
    <header class="the-app-menu__header">Menu</header>
    <div class="the-app-menu__list-wrapper">
      <TheAppMenuLinkList :links="links" @navigate="doNavigate" />
    </div>
  </nav>
</template>

<style lang="scss" scoped>
.the-app-menu {
  height: 100%;
  color: $color-font-strong;

  &__header {
    display: flex;
    align-items: center;

    height: 56px;
    padding: 12px 24px;
    background-color: $color-background-dark;

    font-size: x-large;
    font-weight: bold;
  }
  &__list-wrapper {
    min-height: calc(100% - 56px);
    padding: 8px;
    background-color: $color-background-normal;
  }
}
</style>
