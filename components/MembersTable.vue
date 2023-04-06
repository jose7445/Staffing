<template>
  <div>
    <q-table
      flat
      bordered
      :rows="users"
      :columns="columns"
      class="my-sticky-header-table"
      table-header-class="text-bold"
      separator="vertical"
      :filter="filter"
      title="Staffing Members"
    >
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>

      <template v-slot:body-cell-action>
        <q-td>
          <div class="row justify-evenly">
            <q-btn
              dense
              flat
              rounded
              color="primary"
              field="edit"
              icon="edit"
              @click="show_dialog = true"
            ></q-btn>

            <q-btn
              dense
              flat
              rounded
              color="primary"
              field="delete"
              icon="delete"
            ></q-btn>
          </div>
        </q-td>
      </template>
    </q-table>
  </div>

  <q-dialog v-model="show_dialog">
    <q-card style="width: 800px; max-width: 60vw; max-height: 550px">
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
        <div class="text-h4">Modificar miembro</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-pt-md">
        <q-form class="q-gutter-md">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">Department</q-item-label>
                <q-input dense outlined></q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">Oficina</q-item-label>
                <q-input dense outlined />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">Nombre</q-item-label>
                <q-input dense outlined />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">Apellidos</q-item-label>
                <q-input dense outlined />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">Stage</q-item-label>
                <q-input dense outlined />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label class="q-pb-xs">Email</q-item-label>
                <q-input dense outlined />
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
                  v-close-popup
                ></q-btn>
              </q-card-actions>
            </q-card-section>
          </q-list>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

const columns = [
  {
    name: "ka_department",
    label: "Department",
    field: "ka_department",
    align: "left",
  },
  { name: "office", label: "Oficina", field: "office", align: "left" },

  { name: "name", label: "Nombre", field: "name", align: "left" },
  { name: "lastname", label: "Apellidos", field: "lastname", align: "left" },
  { name: "stage", label: "Stage", field: "stage", align: "left" },
  {
    name: "companyEmail",
    label: "Email",
    field: "companyEmail",
    align: "left",
  },
  { name: "action", label: "Action", field: "action", align: "left" },
];

export default defineNuxtComponent({
  async asyncData() {
    const users = await $fetch("/api/staffing/members");
    return { users };
  },

  setup() {
    return {
      columns,
      filter: ref(""),
      show_dialog: ref(false),
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
    background-color: #e6e1e1

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
