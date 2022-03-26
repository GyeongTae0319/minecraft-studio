<script setup lang="ts"></script>

<template>
  <PageWrapper class="page">
    <div class="flex">
      <McButton to="/block-model" class="flex__button">
        <div class="flex__button__container">
          <AppIcon icon="cube" size="32" />
          Block Model
        </div>
      </McButton>
    </div>
  </PageWrapper>
</template>

<style lang="scss" scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}
.title {
  color: var(--color-font-strong);
}
.flex {
  display: flex;

  &__button {
    width: 100%;

    & + & {
      margin-left: calc(var(--pixel-unit) * -1);
    }

    &:focus,
    &:active {
      position: relative;
      z-index: 1;
    }

    &__container {
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
  }
}
</style>
