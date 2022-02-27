<script setup lang="ts">
import TheAppMenu from "~~/components/organisms/TheAppMenu.vue";

type TheAppMenuInstance = InstanceType<typeof TheAppMenu>;

const menuElement = ref<TheAppMenuInstance>(null);
const menuIsOpened = ref(false);
const mainIsDisabled = ref(false);

const rootClasses = computed(() => ({
  "layout--menu-opened": mainIsDisabled.value,
}));
const mainClasses = computed(() => ({
  "layout__main--disabled": menuIsOpened.value,
}));
const currentRouteName = computed(() => {
  return useRoute().name;
});

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
    <div class="layout__main" :class="mainClasses">
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
