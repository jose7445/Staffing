<template>
  <q-card square bordered class="q-pa-lg shadow-1">
    <div class="text-h3 q-pa-md text-center text-bold">Hello!</div>
    <div class="text-h4 text-center">Sigin into Your account</div>
    <q-card-section>
      <q-form class="q-gutter-y-md q-mt-sm" @submit.prevent="userLogin">
        <q-input
          outlined
          clearable
          type="email"
          clear-icon="close"
          v-model="email"
          label="email"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Requerido']"
        >
          <template v-slot:prepend>
            <q-icon name="email" />
          </template>
        </q-input>

        <q-input
          outlined
          clearable
          clear-icon="close"
          type="password"
          label="password"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Requerido']"
          v-model="password"
        >
          <template v-slot:prepend>
            <q-icon name="password" />
          </template>
        </q-input>

        <q-btn
          unelevated
          color="primary"
          type="submit"
          size="md"
          class="full-width text-bold"
          label="Login"
        />
      </q-form>
    </q-card-section>

    <q-card-section class="text-center q-pa-none">
      <p class="text-grey-6">Forgot password?</p>
    </q-card-section>
  </q-card>
</template>

<script>
export default defineNuxtComponent({
  data() {
    return {
      text: "",
      email: "",
      password: "",
    };
  },

  methods: {
    async userLogin() {
      const data = await $fetch("/api/staffing/members/signin", {
        method: "POST",
        body: {
          email: this.email,
          password: this.password,
        },
      });
      this.$router.push("/");
      console.log(data);
    },
  },
});
</script>

<style scoped>
.q-card {
  width: 500px;
}
</style>
