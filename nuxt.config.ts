// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  runtimeConfig: {
    mongoUrl: process.env.MONGO_URL + process.env.DB_NAME,
    kaDeparment: process.env.KA_DEPARTMENT,
    envType: "DEV",
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  modules: ["nuxt-quasar-ui"],
  quasar: {
    /* */
  },
  css: [
    "@quasar/extras/material-icons/material-icons.css",
    "~/assets/styles/quasar.sass",
  ],
});
