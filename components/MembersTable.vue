<template>
  <div>
    <q-table
      flat
      bordered
      :rows="members"
      :columns="columns"
      row-key="name"
      separator="cell"
      :filter="filter"
      class="my-sticky-header-table"
      table-header-class="text-bold"
      title="Staffing Members"
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
            @click="showAddMember"
          />
        </div>
      </template>

      <!--Actions Table-->
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="row justify-evenly">
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
    <CardMember :membersId="membersId" />
  </q-dialog>

  <!--Update member-->
  <q-dialog v-model="opened">
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
        <div class="text-h4">Modificar miembro</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-pt-md">
        <q-form class="q-gutter-md" @submit.prevent="updateMember">
          <q-list>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="Id"
                  v-model="editForm.id"
                ></q-input>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input dense outlined label="name" v-model="editForm.name" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="lastname"
                  v-model="editForm.lastname"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="office"
                  v-model="editForm.office"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="employedId"
                  v-model="editForm.employedId"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="Email"
                  v-model="editForm.companyEmail"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="Password"
                  v-model="editForm.password"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="personalData"
                  v-model="editForm.personalData"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="security"
                  v-model="editForm.security"
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-input
                  dense
                  outlined
                  label="staffing"
                  v-model="editForm.staffing"
                />
              </q-item-section>
            </q-item>

            <q-card-section class="q-pb-none">
              <q-card-actions align="right" class="q-pa-none">
                <q-btn
                  flat
                  label="Cancelar"
                  color="black"
                  size="md"
                  v-close-popup
                ></q-btn>
                <q-btn
                  type="submit"
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

  <!--Add member-->
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
        <div class="text-h4">Añadir Miembro</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-card-section class="q-pt-md">
        <AddMembers />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";

import useQuasar from "quasar/src/composables/use-quasar.js";

const columns = [
  {
    name: "ka_department",
    label: "Department",
    field: "ka_department",
    align: "left",
  },

  { name: "name", label: "Nombre", field: "name", align: "left" },
  { name: "lastname", label: "Apellidos", field: "lastname", align: "left" },
  {
    name: "companyEmail",
    label: "Email",
    field: "companyEmail",
    align: "left",
  },
  {
    name: "tecnology",
    label: "Tecnologia",
    field: (row) => row.staffing.tecnologies,
    align: "left",
  },
  {
    name: "project",
    label: "Proyecto",
    align: "left",
  },

  {
    name: "project",
    label: "Inicio del proyecto",
    align: "left",
  },

  {
    name: "project",
    label: "Final del proyecto",
    align: "left",
  },
  { name: "action", label: "Action", field: "action", align: "left" },
];

export default defineNuxtComponent({
  async setup() {
    const opened = ref(false);
    const add = ref(false);
    const visibility = ref(false);
    const editForm = ref({});
    const membersId = ref([]);
    const $q = useQuasar();

    // Function to get all members
    const { data: members } = useAsyncData("members", () =>
      $fetch("/api/staffing/members/")
    );

    // Show update member modal and define object
    function showModalUpdate(props) {
      opened.value = true;
      const objectMembers = {
        id: props.row.id,
        ka_department: props.row.ka_department,
        name: props.row.name,
        lastname: props.row.lastname,
        office: props.row.office,
        employedId: props.row.employedId,
        companyEmail: props.row.companyEmail,
        password: props.row.password,
        personalData: props.row.personalData,
        security: props.row.security,
        staffing: props.row.staffing,
      };
      editForm.value = objectMembers;
    }

    // Show add member modal
    function showAddMember() {
      add.value = true;
    }

    // Function to view member by ID
    async function viewMember(props) {
      visibility.value = true;
      const data = await $fetch(`/api/staffing/members/${props.row.id}`);
      membersId.value = data;
    }

    //Function to update a member
    async function updateMember() {
      $q.dialog({
        message: "Quieres actualizar este miembro de la tabla?",
        cancel: {
          label: "Cancelar",
          flat: true,
        },
        persistent: true,
        ok: {
          label: "OK",
          color: "primary",
          unelevated: true,
          focus: false,
        },
      })
        .onOk(async () => {
          return await $fetch("/api/staffing/members/", {
            method: "PUT",
            body: editForm.value,
          });
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("members");
          }, 1000);
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
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
          focus: false,
        },
      })
        .onOk(async () => {
          return await $fetch("/api/staffing/members/delete", {
            method: "PUT",
            body: {
              id: id,
            },
          });
        })
        .onOk(() => {})
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    return {
      columns,
      filter: ref(""),
      opened,
      add,
      editForm,
      visibility,
      membersId,
      members,
      showModalUpdate,
      showAddMember,
      viewMember,
      deleteMembers,
      updateMember,
    };
  },

  // Function to get all members
  // async asyncData() {
  //   const members = await $fetch("/api/staffing/members");
  //   return { members };
  // },
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
