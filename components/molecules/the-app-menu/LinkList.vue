<script setup lang="ts">
import TheAppMenuLink from "./Link.vue";

type TheAppMenuLinkInstance = InstanceType<typeof TheAppMenuLink>;
interface Link {
  to: string;
  icon: string;
  label: string;
  exact?: boolean;
}

interface Props {
  links: Link[];
}
const { links } = defineProps<Props>();
const linkElements = ref<TheAppMenuLinkInstance[]>(new Array(links.length));

const selectedLinkIndex = ref(0);
const lastLinkIndex = computed(() => {
  return links.length - 1;
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
    targetIndex = lastLinkIndex.value;
  }
  if (targetIndex > lastLinkIndex.value) {
    targetIndex = 1;
  }

  selectedLinkIndex.value = targetIndex;
  linkElements.value[targetIndex]?.focus();
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
