<template>
  <div>
    <q-form>
      <div class="col q-gutter-y-lg">
        <div>
          <div class="text-bold">projectName:</div>
          <q-select
            type="text"
            outlined
            dense
            emit-value
            map-options
            v-model="projectName"
            :options="optionsProjects"
          />
        </div>

        <div>
          <div class="text-bold">assignationHours:</div>
          <q-input type="number" outlined dense />
        </div>
      </div>
      <div align="right" class="q-mt-sm">
        <q-btn
          class="q-pa-sm"
          size="md"
          dense
          color="primary"
          @click="assignProject"
          >Aisgnar</q-btn
        >
      </div>
    </q-form>
  </div>
</template>

<script>
export default defineNuxtComponent({
  props: {
    editForm: Object,
    projects: Object,
  },
  setup(props) {
    const projectName = ref("");
    const projectSelected = props.projects.projects;

    //Function to assign project
    async function assignProject() {
      const found = projectSelected.find(
        ({ name }) => name === projectName.value
      );

      await $fetch("/api/staffing/assignations", {
        method: "POST",
        body: {
          assignationHours: "30",
          dedication: "30",
          employedId: props.editForm.employedId,
          fullName: props.editForm.name + " " + props.editForm.lastname,
          projectName: projectName.value,
          projectExt: found.extCode,
          projectId: found._id,
          range: "2023-04-30T20:08:31.709Z",
          hollydays: [""],
          userId: props.editForm.id,
        },
      });
    }
    return {
      projectName,
      assignProject,
      optionsProjects: props.projects.projects.map((a) => a.name),
    };
  },
});
</script>
