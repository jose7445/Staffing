<template>
  <div
    class="q-pa-lg bg-white rounded-borders shadow-1 shadow-up-1"
    style="width: 450px"
  >
    <div class="text-h4 text-center">Staffing</div>
    <div class="text-h6 text-center">Sign into Your account</div>

    <q-form @submit="onSubmit" class="q-gutter-lg q-mt-xl">
      <q-input
        outlined
        v-model="name"
        label="Email"
        clearable
        clear-icon="close"
      />

      <q-input outlined type="password" v-model="age" label="Contraseña" />

      <div>
        <q-btn label="Submit" type="submit" color="primary" />
      </div>
    </q-form>
  </div>
</template>

<script>
import useQuasar from "quasar/src/composables/use-quasar.js";
import { ref } from "vue";

export default {
  setup() {
    const $q = useQuasar();

    const name = ref(null);
    const age = ref(null);
    const accept = ref(false);

    return {
      name,
      age,
      accept,

      onSubmit() {
        if (accept.value !== true) {
          $q.notify({
            color: "red-5",
            textColor: "white",
            icon: "warning",
            message: "You need to accept the license and terms first",
          });
        } else {
          $q.notify({
            color: "green-4",
            textColor: "white",
            icon: "cloud_done",
            message: "Submitted",
          });
        }
      },

      onReset() {
        name.value = null;
        age.value = null;
        accept.value = false;
      },
    };
  },
};
</script>

<style scoped></style>
