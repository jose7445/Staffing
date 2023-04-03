<template>
  <div class="bg-img column items-center justify-center">
    <LoginForm />
  </div>
</template>

<script>
// This will work in both `<script setup>` and `<script>`
definePageMeta({
  layout: "custom",
});
</script>

<style scoped>
.bg-img {
  background: white
    url("https://estaticos-cdn.prensaiberica.es/clip/027d056c-1cac-43fa-a54c-797347879266_16-9-discover-aspect-ratio_default_0.jpg")
    no-repeat fixed center;
  background-size: cover;
  width: 100%;
  height: 100vh;
}
</style>
