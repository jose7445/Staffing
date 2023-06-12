<template>
  <div>
    <q-table
      flat
      bordered
      dense
      :rows="users?.users"
      :columns="columns"
      row-key="name"
      separator="cell"
      :filter="filter"
      class="my-sticky-header-table"
      title="Miembros"
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
            @click="showAddMember = true"
          />
        </div>
      </template>

      <!--Actions Table-->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="row justify-center no-wrap">
            <q-btn
              dense
              flat
              round
              color="primary"
              field="see"
              icon="visibility"
              @click="viewMember(props)"
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
              @click="() => deleteMembers(props)"
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

  <!--Card member by ID-->
  <q-dialog v-model="visibility">
    <StaffingMembersCardMember :membersId="membersId" />
  </q-dialog>

  <!--Update members-->
  <q-dialog v-model="opened">
    <StaffingMembersUpdateMembers
      :editForm="editForm"
      :projects="projects"
      @closeModalUpdate="closeModalUpdate"
    />
  </q-dialog>

  <!--Add members-->
  <q-dialog v-model="showAddMember">
    <StaffingMembersAddMembers :users="users" @close="showAddMember = false" />
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import useQuasar from "quasar/src/composables/use-quasar.js";

const columns = [
  {
    name: "name",
    label: "Nombre",
    field: (row) => row.name + " " + row.lastname,
    align: "left",
  },
  {
    name: "office",
    label: "Oficina",
    field: (row) => row.office,
    align: "left",
  },
  {
    name: "companyEmail",
    label: "E-mail",
    field: (row) => row.companyEmail,
    align: "left",
  },

  {
    name: "tecnologies",
    label: "Tecnologías",
    field: (row) => row.staffing.technologies,
    align: "left",
  },
  {
    name: "csr",
    label: "CSR",
    field: (row) => row.staffing.csr,
    align: "left",
  },

  { name: "action", field: "action", align: "center" },
];

export default defineNuxtComponent({
  head: {
    title: "Miembros Staffing",
    meta: [
      {
        hid: "Miembros Staffing",
        name: "Miembros Staffing",
        content: "Miembros Staffing page",
      },
    ],
  },
  async setup() {
    const opened = ref(false);
    const visibility = ref(false);
    const editForm = ref({});
    const membersId = ref([]);
    const $q = useQuasar();
    const step = ref(1);

    // Function to get all members
    const { data: users } = useAsyncData("users", () => {
      return $fetch("/api/staffing/members");
    });

    //Function to get all projects
    const { data: projects } = useAsyncData("projects", () => {
      return $fetch("/api/staffing/projects");
    });

    // Open update members modal
    // Get the props.row and create object to edit members data
    function showModalUpdate(props) {
      opened.value = true;
      const objectMembers = {
        id: props.row.id,
        name: props.row.name,
        lastname: props.row.lastname,
        office: props.row.office,
        companyEmail: props.row.companyEmail,
        employedId: props.row.employedId,
        password: props.row.password,
        personalData: {
          email: props.row.personalData.email,
          phone: props.row.personalData.phone,
        },
        staffing: {
          incorporationCategory: props.row.staffing.incorporationCategory,
          endCurrentAsignation: props.row.staffing.endCurrentAsignation,
          cvLink: props.row.staffing.cvLink,
          technologies: props.row.staffing.technologies,
          experience: props.row.staffing.experience,
          categoryCode: props.row.staffing.categoryCode,
          categoryPosition: props.row.staffing.categoryPosition,
          categoryLevel: props.row.staffing.categoryLevel,
          salary: props.row.staffing.salary,
          csr: props.row.staffing.csr,
          endCurrentAssignation: props.row.staffing.endCurrentAssignation,
          comments: props.row.staffing.comments,
        },
        security: {
          isSuper: props.row.security.isSuper,
          roles: [props.row.security.roles],
        },
      };
      editForm.value = objectMembers;
      resetStepper();
    }
    // Close update members modal
    function closeModalUpdate() {
      opened.value = false;
    }

    // Function to view member by ID
    async function viewMember(props) {
      visibility.value = true;
      const data = await $fetch(`/api/staffing/members/${props.row.id}`);
      membersId.value = data;
    }

    // Function to delete a member
    function deleteMembers(props) {
      const id = props.row.id;
      $q.dialog({
        message: "Quieres eliminar este miembro de la tabla?",
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
          return await $fetch("/api/staffing/members/delete", {
            method: "PUT",
            body: {
              id: id,
            },
          })
            .then((response) =>
              $q.notify({
                message: "Miembro eliminado",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "No se ha podido eliminar",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("users");
          }, 1000);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
          $q.notify({
            message: "No se ha podido eliminar",
            type: "negative",
          });
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
      columns,
      filter: ref(""),
      opened,
      editForm,
      visibility,
      membersId,
      projects,
      users,
      step,
      showAddMember: ref(false),
      showModalUpdate,
      viewMember,
      deleteMembers,
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
