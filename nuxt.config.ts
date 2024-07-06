// https://nuxt.com/docs/api/configuration/nuxt-config
import process from "node:process";

import Aura from "@primevue/themes/aura";

export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: true,

  modules: [
    "@pinia/nuxt",
    "@nuxt/eslint",
    "@nuxtjs/tailwindcss",
    "@primevue/nuxt-module",
    "@nuxtjs/supabase",
  ],

  css: ["primeicons/primeicons.css"],

  typescript: {
    typeCheck: false,
  },

  eslint: {
    checker: true,
    config: {
      standalone: false,
    },
  },

  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    redirect: false,
  },

  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: "system",
          cssLayer: {
            name: "primevue",
            order: "tailwind-base, primevue, tailwind-utilities;",
          },
        },
      },
      ripple: true,
      inputVariant: "outlined",
    },
    autoImport: true,
  },

  compatibilityDate: "2024-07-04",
});
