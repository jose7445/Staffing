<template>
  <div>
    <q-table
      flat
      bordered
      :rows="projects.projects"
      :columns="columns"
      row-key="name"
      separator="cell"
      :filter="filter"
      class="my-sticky-header-table"
      table-header-class="text-bold"
      title="Projects"
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
            placeholder="Buscar miembro"
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
            @click="showAddProjects"
          />
        </div>
      </template>

      <!--Actions Table-->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="row justify-evenly no-wrap">
            <q-btn
              dense
              flat
              round
              color="primary"
              field="see"
              icon="visibility"
            ></q-btn>

            <q-btn
              dense
              flat
              round
              color="primary"
              field="edit"
              icon="edit"
            ></q-btn>

            <q-btn
              dense
              flat
              round
              color="primary"
              field="delete"
              icon="delete"
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

  <!--Add project-->
  <q-dialog v-model="add">
    <q-card style="width: 800px; max-width: 100vw; max-height: auto">
      <q-card-section>
        <q-btn
          round
          flat
          dense
          icon="close"
          class="float-right"
          color="grey-8"
          v-close-popup
        ></q-btn>
        <div class="text-h4 text-bold">Añadir Proyecto</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <StaffingProjectsAddProjects :projects="projects" />
    </q-card>
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
    name: "customer",
    label: "Cliente",
    field: (row) => row.customer,
    align: "left",
  },
  {
    name: "type",
    label: "Tipo",
    field: (row) => row.type,
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
  async setup() {
    const add = ref(false);

    // Function to get all members
    const { data: projects } = useAsyncData("projects", () => {
      return $fetch("/api/staffing/projects");
    });

    // Show add project modal
    function showAddProjects() {
      add.value = true;
    }

    return {
      columns,
      filter: ref(""),
      projects,
      add,
      showAddProjects,
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
    background-color: #E5E4E2




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
