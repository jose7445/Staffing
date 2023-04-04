<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page
        class="window-height window-width row justify-center items-center bg-img"
      >
        <LoginForm />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<style scoped>
.bg-img {
  background: white
    url("https://estaticos-cdn.prensaiberica.es/clip/027d056c-1cac-43fa-a54c-797347879266_16-9-discover-aspect-ratio_default_0.jpg")
    no-repeat fixed center;
  background-size: cover;
}
</style>
