<template>
  <div>
    <q-table
      flat
      dense
      bordered
      :rows="projects?.projects"
      :columns="columns"
      row-key="name"
      separator="cell"
      :filter="filter"
      class="my-sticky-header-table"
      table-header-class="text-bold"
      title="Proyectos"
      title-class="text-bold"
    >
      <!--Search action-->
      <template v-slot:top-right>
        <div class="row items-center justify-center q-gutter-x-md">
          <q-input
            bg-color="white"
            outlined
            dense
            debounce="200"
            v-model="filter"
            placeholder="Buscar proyecto"
          >
            <template v-slot:append>
              <q-icon name="search" />
            </template>
          </q-input>
          <q-btn
            round
            color="primary"
            icon="add"
            size="sm"
            @click="showAddProjects = true"
          />
        </div>
      </template>

      <!--Actions Table-->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="row justify-center no-wrap q-gutter-sm">
            <q-btn
              dense
              flat
              round
              color="primary"
              field="see"
              icon="visibility"
              @click="viewProjects(props)"
            ></q-btn>

            <q-btn
              dense
              flat
              round
              color="primary"
              field="edit"
              icon="edit"
              @click="showModalUpdate(props)"
            ></q-btn>

            <q-btn
              dense
              flat
              round
              color="primary"
              field="delete"
              icon="delete"
              @click="() => deleteProjects(props)"
            ></q-btn>
          </div>
        </q-td>
      </template>

      <!--No found member message-->
      <template #no-data>
        <div class="row items-center q-gutter-x-sm">
          <q-icon name="warning" color="grey" size="sm" />
          <div>Miembro no encontrado</div>
        </div>
      </template>
    </q-table>
  </div>

  <!--Card project by ID-->
  <q-dialog v-model="visibility">
    <StaffingProjectsCardProjects
      :projectsId="projectsId"
      :projects="projects"
    />
  </q-dialog>

  <!--Update project-->
  <q-dialog v-model="opened">
    <StaffingProjectsUpdateProjects
      :editForm="editForm"
      :projects="projects"
      :members="members"
      @closeModalUpdate="closeModalUpdate"
    />
  </q-dialog>

  <!--Add project-->
  <q-dialog v-model="showAddProjects">
    <StaffingProjectsAddProjects
      :projects="projects"
      @close="showAddProjects = false"
    />
  </q-dialog>
</template>

<script>
import { ref } from "vue";

const columns = [
  {
    name: "name",
    label: "Nombre",
    field: (row) => row.name,
    align: "left",
  },
  {
    name: "status",
    label: "Estado",
    field: (row) => row.status,
    align: "left",
  },
  {
    name: "type",
    label: "Tipo",
    field: (row) => row.type,
    align: "left",
  },
  {
    name: "customer",
    label: "Cliente",
    field: (row) => row.customer,
    align: "left",
  },
  {
    name: "technology",
    label: "Tecnologias",
    field: (row) => row.technology,
    align: "left",
  },
  {
    name: "manager",
    label: "Manager",
    field: (row) => row.manager,
    align: "left",
  },
  { name: "action", field: "action", align: "left" },
];

export default defineNuxtComponent({
  head: {
    title: "Proyectos Staffing",
    meta: [
      {
        hid: "Proyectos Staffing",
        name: "Proyectos Staffing",
        content: "Proyectos Staffing page",
      },
    ],
  },
  setup() {
    const opened = ref(false);
    const add = ref(false);
    const visibility = ref(false);
    const editForm = ref({});
    const projectsId = ref([]);
    const $q = useQuasar();
    const step = ref(1);
    const id = ref([]);

    // Function to get all projects
    const { data: projects } = useAsyncData("projects", () => {
      return $fetch("/api/staffing/projects");
    });

    // Function to get all members
    const { data: members } = useAsyncData("members", () => {
      return $fetch("/api/staffing/members");
    });

    // Open update members modal
    // Get the props.row and create object to edit members data
    function showModalUpdate(props) {
      opened.value = true;
      const objectProjects = {
        _id: props.row._id,
        name: props.row.name,
        description: props.row.description,
        status: props.row.status,
        extCode: props.row.extCode,
        office: props.row.office,
        category: props.row.category,
        customer: props.row.customer,
        type: props.row.type,
        technology: props.row.technology,
        budget: props.row.budget,
        estimatedDuration: {
          duration: props.row.estimatedDuration.duration,
          unit: props.row.estimatedDuration.unit,
        },
        startDate: new Date(props.row.startDate).toISOString().slice(0, 10),
        endDate: new Date(props.row.endDate).toISOString().slice(0, 10),
        manager: props.row.manager,
        projectLead: props.row.projectLead,
      };
      editForm.value = objectProjects;
      resetStepper();
    }

    // Close update projects modal
    function closeModalUpdate() {
      opened.value = false;
    }

    // Function to view member by ID
    async function viewProjects(props) {
      visibility.value = true;
      const data = await $fetch(`/api/staffing/projects/${props.row._id}`).then(
        (data) => {
          projectsId.value = data;
        }
      );
      id.value = props.row._id;
    }

    // Function to delete a member
    function deleteProjects(props) {
      const id = props.row._id;
      $q.dialog({
        message: "Quieres eliminar este proyecto de la tabla?",
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
          return await $fetch("/api/staffing/projects/", {
            method: "DELETE",
            body: {
              _id: id,
            },
          })
            .then((response) =>
              $q.notify({
                message: "Proyecto eliminado",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "No es posibile eliminar",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("projects");
          }, 1000);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    // Function to reset stepper Update member
    function resetStepper() {
      step.value = 1;
    }

    return {
      id,
      members,
      columns,
      filter: ref(""),
      projects,
      opened,
      add,
      editForm,
      step,
      projectsId,
      visibility,
      showAddProjects: ref(false),
      viewProjects,
      deleteProjects,
      showModalUpdate,
      resetStepper,
      closeModalUpdate,
    };
  },
});
</script>

<style lang="sass">
.my-sticky-header-table
  /* height or max-height is important */
  height: auto



  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: #F5F5F5




  thead tr th
    position: sticky
    z-index: 1
    font-weight: 900


  thead tr:first-child th
    top: 0



  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px



  /* prevent scrolling behind sticky top row on focus */
  tbody
    /* height of all previous header rows */
    scroll-margin-top: 48px
</style>
