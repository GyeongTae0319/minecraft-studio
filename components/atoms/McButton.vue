<script setup lang="ts">
import borderImageDefault from "~/assets/sprites/mc-button-default.png";
import borderImagePrimary from "~/assets/sprites/mc-button-primary.png";
import { Props as AppButtonProps } from "~/components/atoms/AppButton.vue";

type Theme = "default" | "primary";
interface ThemeStyle extends Record<string, string> {
  "--font-color": string;
  "--border-image": string;
  "--background-color": string;
  "--side-color": string;
}
const ThemeStyleMap: Record<Theme, ThemeStyle> = {
  default: {
    "--font-color": "rgb(30 30 31)",
    "--border-image": `url("${borderImageDefault}")`,
    "--background-color": "#d0d1d4",
    "--side-color": "#58585a",
  },
  primary: {
    "--font-color": "var(--color-font-strong)",
    "--border-image": `url("${borderImagePrimary}")`,
    "--background-color": "#3c8527",
    "--side-color": "#1D4D13",
  },
};

interface Props extends AppButtonProps {
  theme?: Theme;
  active?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  theme: "default",
  active: false,
});
const { to, href, theme, active } = toRefs(props);

const rootClasses = computed((): Record<string, boolean> => {
  return {
    "mc-button--active": active.value,
  };
});
const rootStyles = computed((): Record<string, string> => {
  return ThemeStyleMap[theme.value];
});
</script>

<template>
  <AppButton
    :to="to"
    :href="href"
    class="mc-button"
    :class="rootClasses"
    :style="rootStyles"
    @contextmenu.prevent
  >
    <div class="mc-button__container">
      <slot />
    </div>
  </AppButton>
</template>

<style lang="scss" scoped>
.mc-button {
  padding-bottom: calc(var(--pixel-unit) * 2);

  background-color: var(--side-color);
  border: var(--pixel-unit) solid rgb(30 30 31);

  color: var(--font-color);
  font-size: x-large;
  font-weight: bold;

  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 var(--pixel-unit) #ffffff;
  }
  &--active,
  &:active {
    margin-top: calc(var(--pixel-unit) * 2);
    padding-bottom: 0;
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 8px 12px;

    background-color: var(--background-color);
    border: var(--pixel-unit) solid;
    border-image: var(--border-image) 1;

    text-align: center;
  }
}
</style>
