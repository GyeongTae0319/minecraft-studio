<template>
  <div class="app">
    <NuxtPage class="page" />
  </div>
</template>

<style lang="scss">
:root {
  --pixel-unit: 4px;

  --color-background-normal: rgba(45 50 57);
  --color-background-dark: rgba(37 40 45);
  --color-background-darker: rgba(28 30 33);
  --color-font-strong: rgba(255 255 255 / 1);
  --color-font-normal: rgba(255 255 255 / 0.75);
  --color-font-disabled: rgba(255 255 255 / 0.38);
  --color-font-black-strong: rgba(0 0 0 / 1);
  --color-font-black-normal: rgba(0 0 0 / 0.75);
  --color-font-black-disabled: rgba(0 0 0 / 0.38);
}

* {
  box-sizing: border-box;

  margin: 0;
  padding: 0;

  border: none;
  outline: none;

  -webkit-tap-highlight-color: transparent;
}

html {
  background-color: var(--color-background-normal);
  color: var(--color-font-normal);
}
html,
body,
#__nuxt {
  height: 100%;
}
</style>

<style lang="scss" scoped>
.app {
  height: 100%;
}
</style>
