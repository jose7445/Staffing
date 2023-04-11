<template>
  <q-form class="q-gutter-md" @submit.prevent="addMember">
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Department</q-item-label>
          <q-input dense outlined v-model="ka_department"></q-input>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Oficina</q-item-label>
          <q-input dense outlined v-model="office" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Nombre</q-item-label>
          <q-input dense outlined v-model="name" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Apellidos</q-item-label>
          <q-input dense outlined v-model="lastname" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Stage</q-item-label>
          <q-input dense outlined v-model="stage" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label class="q-pb-xs">Email</q-item-label>
          <q-input dense outlined v-model="companyEmail" />
        </q-item-section>
      </q-item>

      <q-card-section class="q-pb-none">
        <q-card-actions align="right" class="q-pa-none">
          <q-btn
            unelevated
            label="Cancelar"
            color="primary"
            size="md"
            v-close-popup
          ></q-btn>
          <q-btn
            unelevated
            label="Enviar"
            color="primary"
            size="md"
            type="submit"
            v-close-popup
          ></q-btn>
        </q-card-actions>
      </q-card-section>
    </q-list>
  </q-form>
</template>

<script>
export default defineNuxtComponent({
  setup() {
    const ka_department = ref("");
    const office = ref("");
    const name = ref("");
    const lastname = ref("");
    const stage = ref("");
    const companyEmail = ref("");

    // Function to add a new member
    async function addMember() {
      let data = {
        ka_department: ka_department.value,
        office: office.value,
        name: name.value,
        lastname: lastname.value,
        stage: stage.value,
        companyEmail: companyEmail.value,
      };

      await $fetch("/api/staffing/members", {
        method: "POST",
        body: data,
      });
    }

    return {
      ka_department,
      office,
      name,
      lastname,
      stage,
      companyEmail,
      addMember,
    };
  },
});
</script>
