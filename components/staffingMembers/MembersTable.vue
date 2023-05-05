<template>
  <div>
    <q-table
      flat
      bordered
      :rows="users?.users"
      :columns="columns"
      row-key="name"
      separator="cell"
      :filter="filter"
      class="my-sticky-header-table"
      table-header-class="text-bold"
      title="Members"
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
          <div class="row justify-evenly no-wrap">
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
        <div class="text-h4 text-bold">Modificar miembro</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <q-form @submit.prevent="updateMember">
        <q-stepper
          header-nav
          v-model="step"
          color="primary"
          animated
          ref="stepper"
        >
          <!--Member Data STEP 1-->
          <q-step
            :name="1"
            title="Datos miembro"
            icon="settings"
            :done="step > 1"
          >
            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="text"
                    dense
                    outlined
                    v-model="editForm.name"
                    label="Nombre *"
                  ></q-input>
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="text"
                    dense
                    outlined
                    v-model="editForm.lastname"
                    label="Apellidos *"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="text"
                    dense
                    outlined
                    v-model="editForm.office"
                    label="Oficina *"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="number"
                    dense
                    outlined
                    v-model="editForm.employedId"
                    label="ID Empleado"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="email"
                    dense
                    outlined
                    v-model="editForm.companyEmail"
                    label="Correo corporativo"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="password"
                    dense
                    outlined
                    v-model="editForm.password"
                    label="Contraseña"
                  />
                </q-item-section>
              </q-item>
            </div>

            <q-stepper-navigation>
              <q-btn @click="step = 2" color="primary" label="Continuar" />
            </q-stepper-navigation>
          </q-step>

          <!--Personal Data STEP 2-->
          <q-step
            :name="2"
            title="Datos personales"
            icon="person"
            :done="step > 2"
          >
            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="email"
                    dense
                    outlined
                    v-model="editForm.personalData.email"
                    label="Correo personal"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="tel"
                    dense
                    outlined
                    v-model="editForm.personalData.phone"
                    label="Telefono personal"
                  />
                </q-item-section>
              </q-item>
            </div>

            <q-stepper-navigation>
              <q-btn @click="step = 3" color="primary" label="Continuar" />
              <q-btn
                flat
                @click="step = 1"
                color="primary"
                label="Volver"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </q-step>

          <!--Staffing Data STEP 3-->
          <q-step :name="3" title="Datos staffing" icon="workspaces">
            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="url"
                    dense
                    outlined
                    v-model="editForm.staffing.cvLink"
                    label="Link curriculum vitae"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="text"
                    dense
                    outlined
                    v-model="editForm.staffing.technologies"
                    label="Tecnologias"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-select
                    emit-value
                    map-options
                    type="text"
                    dense
                    outlined
                    v-model="editForm.staffing.experience"
                    label="Experiencia"
                    :options="optionsExperience"
                  />
                </q-item-section>
              </q-item>

              <q-item class="col">
                <q-item-section>
                  <q-select
                    emit-value
                    map-options
                    type="text"
                    dense
                    outlined
                    v-model="editForm.staffing.categoryCode"
                    label="Categoria codigo"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-select
                    emit-value
                    map-options
                    type="text"
                    dense
                    outlined
                    v-model="editForm.staffing.categoryPosition"
                    label="Categoria Posicion"
                    :options="optionsPosition"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-select
                    emit-value
                    map-options
                    dense
                    outlined
                    type="text"
                    v-model="editForm.staffing.categoryLevel"
                    label="Nivel categoria"
                    :options="optionsLevel"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="number"
                    dense
                    outlined
                    v-model="editForm.staffing.salary"
                    label="Salario"
                  />
                </q-item-section>
              </q-item>
            </div>

            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="number"
                    dense
                    outlined
                    v-model="editForm.staffing.csr"
                    label="CSR"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    type="date"
                    dense
                    outlined
                    v-model="editForm.staffing.endCurrentAssignation"
                    label="Finalización de asignación"
                  />
                </q-item-section>
              </q-item>
            </div>
            <div class="row" style="hei">
              <q-item class="col">
                <q-item-section>
                  <q-input
                    autogrow
                    type="textarea"
                    label="Comentarios"
                    dense
                    outlined
                    v-model="editForm.staffing.comments"
                  />
                </q-item-section>
              </q-item>
            </div>

            <q-stepper-navigation>
              <q-btn @click="step = 4" color="primary" label="Continuar" />
              <q-btn
                flat
                @click="step = 2"
                color="primary"
                label="Volver"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </q-step>

          <!--Security Data STEP 4-->
          <q-step :name="4" title="Seguridad" icon="security">
            <div class="row">
              <q-item class="col">
                <q-item-section>
                  <q-select
                    emit-value
                    map-options
                    dense
                    outlined
                    v-model="editForm.security.isSuper"
                    label="Es super?"
                    :options="editForm.optionsSuper"
                  />
                </q-item-section>
              </q-item>
              <q-item class="col">
                <q-item-section>
                  <q-input
                    dense
                    outlined
                    v-model="editForm.security.roles"
                    label="Roles"
                  />
                </q-item-section>
              </q-item>
            </div>

            <q-stepper-navigation>
              <q-btn color="primary" label="Enviar" type="submit" />
              <q-btn
                flat
                @click="step = 3"
                color="primary"
                label="Volver"
                class="q-ml-sm"
              />
            </q-stepper-navigation>
          </q-step>
        </q-stepper>
      </q-form>
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
        <div class="text-h4 text-bold">Añadir Miembro</div>
      </q-card-section>
      <q-separator inset></q-separator>
      <StaffingMembersAddMembers :users="users" />
    </q-card>
  </q-dialog>
</template>

<script>
import { ref } from "vue";
import useQuasar from "quasar/src/composables/use-quasar.js";
import getExperience from "../../server/utils/modules/data/staffMember_options_DeX.json";
import getCategoryPosition from "../../server/utils/modules/data/job_categories_DeX.json";
import getCategoryLevel from "../../server/utils/modules/data/job_levels_DeX.json";

const columns = [
  {
    name: "name",
    label: "Nombre",
    field: (row) => row.name + " " + row.lastname,
    align: "left",
  },
  {
    name: "category",
    label: "Categoría",
    field: (row) => row.staffing.categoryPosition,
    align: "left",
  },
  {
    name: "csr",
    label: "CSR",
    field: (row) => row.staffing.csr,
    align: "left",
  },
  {
    name: "tecnologies",
    label: "Tecnologías",
    field: (row) => row.staffing.technologies,
    align: "left",
  },
  {
    name: "projects",
    label: "Proyectos actuales",
    align: "left",
  },

  {
    name: "projectEnd",
    label: "Fecha fin asignación",
    field: (row) => row.staffing.endCurrentAsignation,
    align: "left",
  },
  { name: "action", field: "action", align: "left" },
];

export default defineNuxtComponent({
  async setup() {
    const opened = ref(false);
    const add = ref(false);
    const visibility = ref(false);
    const editForm = ref({});
    const membersId = ref([]);
    const $q = useQuasar();
    const step = ref(1);

    // Function to get all members
    const { data: users } = useAsyncData("users", () => {
      return $fetch("/api/staffing/members");
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
        employedId: props.row.employedId,
        companyEmail: props.row.companyEmail,
        password: props.row.password,
        personalData: {
          email: props.row.personalData.email,
          phone: props.row.personalData.phone,
        },
        staffing: {
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
          roles: props.row.security.roles,
        },
      };
      editForm.value = objectMembers;
      resetStepper();
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
            refreshNuxtData("users");
          }, 1000);
          opened.value = false;
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
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("users");
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
      columns,
      filter: ref(""),
      opened,
      add,
      editForm,
      visibility,
      membersId,
      users,

      step,
      optionsSuper: [
        {
          label: "Si",
          value: true,
        },
        {
          label: "No",
          value: false,
        },
      ],
      optionsExperience: getExperience.experience,
      optionsPosition: getCategoryPosition,
      optionsLevel: getCategoryLevel,
      showModalUpdate,
      showAddMember,
      viewMember,
      deleteMembers,
      updateMember,
      resetStepper,
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
