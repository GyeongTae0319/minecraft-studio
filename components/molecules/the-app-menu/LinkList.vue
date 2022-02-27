<script setup lang="ts">
import { NavigationFailure } from "vue-router";
import TheAppMenuLink from "./Link.vue";

interface Props {
  links: Link[];
}
interface Emits {
  (event: "navigate", next: RouterNavigate): void;
}

interface Link {
  to: string;
  icon: string;
  label: string;
  exact?: boolean;
}
type TheAppMenuLinkInstance = InstanceType<typeof TheAppMenuLink>;
type RouterNavigate = (e?: MouseEvent) => Promise<void | NavigationFailure>;

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { links } = toRefs(props);
const linkElements = ref<TheAppMenuLinkInstance[]>(
  new Array(links.value.length)
);

const selectedLinkIndex = ref(0);
const lastLinkIndex = computed(() => {
  return links.value.length - 1;
});

function moveFocusUsingKeyboard(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowUp":
    case "Up":
      moveFocus("prev");
      break;
    case "ArrowDown":
    case "Down":
      moveFocus("next");
      break;
  }
}
const dirMap = <const>{ prev: -1, next: 1 };
function moveFocus(dir: "prev" | "next") {
  let targetIndex = selectedLinkIndex.value;
  targetIndex += dirMap[dir];

  if (targetIndex < 0) {
    targetIndex = 0;
  } else if (targetIndex > lastLinkIndex.value) {
    targetIndex = lastLinkIndex.value;
  }

  selectedLinkIndex.value = targetIndex;
  linkElements.value[targetIndex].focus();
}
</script>

<template>
  <div class="the-app-menu-link-list" aria-orientation="vertical">
    <ul class="the-app-menu-link-list__list" @keydown="moveFocusUsingKeyboard">
      <TheAppMenuLink
        v-for="({ to, icon, label, exact }, index) in links"
        :key="to"
        :to="to"
        :icon="icon"
        :label="label"
        :exact="exact"
        :focusable="index === selectedLinkIndex"
        :ref="(el: TheAppMenuLinkInstance) => (linkElements[index] = el)"
        class="the-app-menu-link-list__list__item"
        @navigate="emit('navigate', $event)"
      />
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.the-app-menu-link-list {
  &__list {
    display: flex;
    flex-direction: column;

    &__item + &__item {
      margin-top: 8px;
    }
  }
}
</style>
