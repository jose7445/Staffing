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
    >
      <template v-slot:top-right>
        <q-input
          borderless
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
    </q-table>
  </div>
</template>

<script>
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
];

export default defineNuxtComponent({
  fetchKey: "users",
  props: {
    users: Object,
  },
  setup() {
    return {
      columns,
      filter: ref(""),
    };
  },
  async asyncData() {
    return {
      users: await $fetch("/api/staffing/members"),
    };
  },
  mounted() {
    console.log(this.users);
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
