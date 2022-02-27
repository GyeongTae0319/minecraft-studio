<script setup lang="ts">
import { RouteLocationRaw } from "vue-router";
import AppButton from "~/components/atoms/AppButton.vue";

type AppButtonInstance = InstanceType<typeof AppButton>;

interface Props {
  to: RouteLocationRaw;
  icon: string;
  label: string;
  exact?: boolean;
  focusable: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  exact: false,
});
const { to, icon, label, exact, focusable } = toRefs(props);
const rootElement = ref<AppButtonInstance>(null);

const linkClasses = computed(() => ({
  "the-app-menu-link__link--exact": exact.value,
}));

function focus() {
  rootElement.value.focus();
}

defineExpose({
  focus,
});
</script>

<template>
  <li class="the-app-menu-link">
    <div class="the-app-menu-link__wrapper" role="listitem">
      <AppButton
        :to="to"
        :tabindex="focusable ? 0 : -1"
        ref="rootElement"
        class="the-app-menu-link__link"
        :class="linkClasses"
      >
        <span class="the-app-menu-link__link__icon" aria-hidden>
          {{ icon }}
        </span>
        <span class="the-app-menu-link__link__label">{{ label }}</span>
      </AppButton>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.the-app-menu-link {
  list-style: none;
  line-height: 0;

  &__link {
    --background-opacity: 0;

    display: flex;
    align-items: center;
    padding: 8px;

    border-radius: 4px;
    background-color: rgba(255 255 255 / var(--background-opacity));

    text-decoration: none;

    transition: background-color 0.1s;

    &:not(.the-app-menu-link__link--exact).router-link-active,
    &.router-link-exact-active {
      --background-opacity: 0.12;
      color: $color-font-strong;
    }
    &:hover,
    &:focus-visible {
      --background-opacity: 0.08;
    }
    &:active {
      --background-opacity: 0.05;
    }

    &__icon {
      display: block;
      width: 24px;
      height: 24px;
      margin-right: 12px;

      border-radius: 12px;
      background-color: rgba(255 255 255 / 0.1);
      font-size: 0;
    }
  }
}
</style>
