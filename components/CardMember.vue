<template>
  <q-card style="width: 800px; max-width: 100vw; max-height: auto">
    <div class="q-pa-xl column items-center justify-center">
      <q-avatar size="200px">
        <img
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          style="object-fit: fill; width: 200px"
        />
      </q-avatar>

      <div class="q-mt-md text-center">
        <div class="text-h2">{{ membersId.name }} {{ membersId.lastname }}</div>
        <div class="text-h5">{{ membersId.companyEmail }}</div>
      </div>
    </div>
  </q-card>
</template>

<script>
export default defineNuxtComponent({
  props: ["membersId"],
});
</script>
