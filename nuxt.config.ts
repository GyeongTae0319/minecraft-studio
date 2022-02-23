import { defineNuxtConfig } from "nuxt3";

export default defineNuxtConfig({
  components: {
    dirs: ["~/components/atoms", "~/components/molecules", "~/components/organisms"],
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "~/assets/styles/_variables.scss";`,
        },
      },
    },
  },
});
