<template>
  <q-form @submit.prevent="updateTeamMember">
    <div class="col q-gutter-y-lg">
      <div>
        <div class="text-bold">Staff member:</div>
        <q-select
          type="text"
          outlined
          dense
          v-model="editFormTeamembers.fullname"
          disabled
        />
      </div>

      <div class="row q-gutter-sm">
        <div class="col">
          <div class="text-bold">Status:</div>
          <q-select
            type="text"
            outlined
            dense
            :options="optionsStatusProject"
            emit-value
            map-options
            v-model="editFormTeamembers.status"
          />
        </div>

        <div class="col">
          <div class="text-bold">Project dedication:</div>
          <q-input
            type="number"
            outlined
            dense
            v-model="editFormTeamembers.dedication"
          />
        </div>
      </div>

      <div class="row q-gutter-sm">
        <div class="col">
          <div class="text-bold">startdate:</div>
          <q-input
            type="date"
            outlined
            dense
            v-model="editFormTeamembers.startDate"
          />
        </div>

        <div class="col">
          <div class="text-bold">enddate:</div>
          <q-input
            type="date"
            outlined
            dense
            v-model="editFormTeamembers.endDate"
          />
        </div>
      </div>
    </div>
    <div align="right" class="q-gutter-x-sm">
      <q-btn
        type="reset"
        class="q-pa-sm q-mt-sm"
        label="Volver"
        flat
        size="sm"
        @click="$emit('showUpdateTeamMembers')"
        id="back"
      />
      <q-btn
        type="submit"
        class="q-pa-sm q-mt-sm"
        label="Actualizar"
        color="primary"
        size="sm"
        id="update"
      />
    </div>
  </q-form>
</template>

<script>
export default defineNuxtComponent({
  props: {
    editFormTeamembers: Object,
    editForm: Object,
    statuses: Object,
    members: Object,
  },
  async setup(props) {
    const $q = useQuasar();
    const allMembers = props.members.users;
    const names = props.editFormTeamembers.fullname;
    const idProject = props.editForm._id;
    const idProjectUpdate = props.editFormTeamembers.id;

    // Function to add the teammembers
    function updateTeamMember() {
      // Get the id member
      const getName = allMembers.map((o) => {
        return { name: o.name + " " + o.lastname, id: o.id };
      });
      const getIdMember = getName.find(({ name }) => name == names);

      $q.dialog({
        message: "Quieres actualizar este miembro en el proyecto?",
        cancel: {
          label: "Cancelar",
          flat: true,
        },
        persistent: true,
        ok: {
          label: "OK",
          color: "primary",
          unelevated: true,
        },
      })
        .onOk(async () => {
          return await $fetch(`/api/staffing/projects/${idProject}/members`, {
            method: "PUT",
            body: {
              _id: idProjectUpdate,
              userId: getIdMember.id,
              status: props.editFormTeamembers.status,
              dedication: props.editFormTeamembers.dedication,
              startDate: props.editFormTeamembers.startDate,
              endDate: props.editFormTeamembers.endDate,
            },
          })
            .then((response) =>
              $q.notify({
                message: "Miembro actualizado",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "Miembro no actualizado",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          // console.log('>>>> Cancel')

          setTimeout(() => {
            refreshNuxtData("projects");
          }, 1000);
          document.getElementById("update").disabled = true;
          document.getElementById("back").disabled = true;
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }
    return {
      updateTeamMember,
      allMembers,
      optionsStatusProject: props.statuses,
    };
  },
});
</script>
