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
  background: white url(../assets/login_img.webp) no-repeat fixed center;
  background-size: cover;
}
</style>
