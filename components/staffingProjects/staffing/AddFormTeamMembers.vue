<template>
  <q-form @submit.prevent="addTeamMember">
    <div class="col q-gutter-y-lg">
      <div>
        <div class="text-bold">Staff member:</div>
        <q-select
          type="text"
          outlined
          dense
          :options="optionsMembersName"
          emit-value
          map-options
          v-model="staffName"
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
            v-model="staffStatus"
          />
        </div>

        <div class="col">
          <div class="text-bold">Project dedication:</div>
          <q-input type="number" outlined dense v-model="staffDedication" />
        </div>
      </div>

      <div class="row q-gutter-sm">
        <div class="col">
          <div class="text-bold">startdate:</div>
          <q-input type="date" outlined dense v-model="staffStartDate" />
        </div>

        <div class="col">
          <div class="text-bold">enddate:</div>
          <q-input type="date" outlined dense v-model="staffEndDate" />
        </div>
      </div>
    </div>
    <div align="right" clasS="q-gutter-x-sm">
      <q-btn
        type="reset"
        class="q-pa-sm q-mt-sm"
        label="Volver"
        flat
        size="sm"
        @click="$emit('showFormTeamMembers')"
        id="back"
      />
      <q-btn
        type="submit"
        class="q-pa-sm q-mt-sm"
        label="Añadir"
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
    members: Object,
    editForm: Object,
    statuses: Object,
  },
  async setup(props) {
    const $q = useQuasar();
    const staffName = ref("");
    const staffStatus = ref("");
    const staffDedication = ref("");
    const staffStartDate = ref("");
    const staffEndDate = ref("");
    const allMembers = props.members.users;
    const idProject = props.editForm._id;

    // Function to add the teammembers
    function addTeamMember() {
      // Get the id member
      const getName = allMembers.map((o) => {
        return { name: o.name + " " + o.lastname, id: o.id };
      });
      const getIdMember = getName.find(({ name }) => name == staffName.value);

      $q.dialog({
        message: "Quieres añadir este miembro al proyecto?",
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
              _id: idProject,
              userId: getIdMember.id,
              status: staffStatus.value,
              dedication: staffDedication.value,
              startDate: staffStartDate.value,
              endDate: staffEndDate.value,
            },
          })
            .then((response) =>
              $q.notify({
                message: "Miembro añadido",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "Miembro no añadido",
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
      staffName,
      staffStatus,
      staffDedication,
      staffStartDate,
      staffEndDate,
      idProject,
      addTeamMember,
      allMembers,
      optionsMembersName: allMembers.map((a) => a.name + " " + a.lastname),
      optionsStatusProject: props.statuses,
    };
  },
});
</script>
