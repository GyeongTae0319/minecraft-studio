<script setup lang="ts"></script>

<template>
  <button class="mc-button">
    <div class="mc-button__container">
      <slot />
    </div>
  </button>
</template>

<style lang="scss" scoped>
.mc-button {
  padding-bottom: calc(var(--pixel-unit) * 2);

  background-color: #58585a;
  border: var(--pixel-unit) solid rgb(30 30 31);

  color: rgb(30 30 31);
  font-size: x-large;
  font-weight: bold;

  cursor: pointer;

  &:focus-visible {
    box-shadow: 0 0 0 var(--pixel-unit) #ffffff;
  }
  &:active {
    margin-top: calc(var(--pixel-unit) * 2);
    padding-bottom: 0;
    color: var(--color-font-strong);
  }

  &__container {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100%;
    height: 100%;
    padding: 8px 12px;

    background-color: #d0d1d4;
    border: var(--pixel-unit) solid;
    border-image: url("assets/button-default.png") 1;

    text-align: center;

    .mc-button:active > & {
      background-color: #3c8527;
      border-image-source: url("assets/button-active.png");
    }
  }
}
</style>
