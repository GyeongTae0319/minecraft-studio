<script setup lang="ts">
import TheAppMenu from "~~/components/organisms/TheAppMenu.vue";

type TheAppMenuInstance = InstanceType<typeof TheAppMenu>;

const menuElement = ref<TheAppMenuInstance>(null);
const menuIsOpened = ref(false);

const rootClasses = computed(() => [
  "layout",
  {
    "layout--menu-opened": menuIsOpened.value,
  },
]);
const mainClasses = computed(() => [
  "layout__main",
  {
    "layout__main--disabled": menuIsOpened.value,
  },
]);
const currentRouteName = computed(() => {
  return useRoute().name;
});

function onActivateMenu() {
  menuIsOpened.value = true;
}
function onDeactivateMenu() {
  menuIsOpened.value = false;
}

function openMenu() {
  menuElement.value.activate();
}
function closeMenu() {
  menuElement.value.deactivate();
}
</script>

<template>
  <div :class="rootClasses">
    <div class="layout__menu">
      <TheAppMenu
        ref="menuElement"
        @activate="onActivateMenu"
        @deactivate="onDeactivateMenu"
      />
    </div>
    <div :class="mainClasses">
      <TheAppHeader @open-menu="openMenu">
        <template #title>{{ currentRouteName }}</template>
      </TheAppHeader>
      <slot />
      <Transition name="layout__main__overlay">
        <div
          v-if="menuIsOpened"
          class="layout__main__overlay"
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

    &__overlay {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;

      background-color: rgba(0 0 0 / 0.15);

      &-enter-active,
      &-leave-active {
        transition: opacity 0.2s;
      }
      &-enter-from,
      &-leave-to {
        opacity: 0;
      }
    }
  }
}
</style>
