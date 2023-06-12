<template>
  <div style="width: 900px; max-width: 100vw; max-height: 100%">
    <q-form @submit.prevent="updateProject">
      <q-card>
        <q-tabs
          v-model="tab"
          dense
          class="text-grey"
          style="height: auto"
          active-color="primary"
          narrow-indicator
          indicator-color="primary"
          align="justify"
        >
          <q-tab name="info" label="Información" icon="info" />
          <q-tab name="projects" label="Asignaciones" icon="folder" />
        </q-tabs>

        <q-separator />

        <q-tab-panels
          v-model="tab"
          animated
          transition-prev="jump-up"
          transition-next="jump-down"
        >
          <!--INFORMATION PANEL-->
          <q-tab-panel name="info" class="q-pa-none">
            <q-splitter v-model="splitterModel" style="height: 430px">
              <template v-slot:before>
                <q-tabs v-model="innerTab" vertical class="text-primary">
                  <q-tab name="projectData" label="Datos proyecto" />
                  <q-tab name="projectDeadline" label="Fechas proyecto" />
                  <q-tab name="projectOwner" label="Responsables proyecto" />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="innerTab"
                  animated
                  transition-prev="jump-up"
                  transition-next="jump-down"
                >
                  <!--Project Data-->
                  <q-tab-panel name="projectData" class="q-pa-lg">
                    <div class="col q-gutter-y-lg">
                      <div>
                        <div class="text-bold">Nombre:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.name"
                        />
                      </div>

                      <div>
                        <div class="text-bold">description:</div>
                        <q-input
                          type="textarea"
                          dense
                          outlined
                          v-model="editForm.description"
                          autogrow
                        />
                      </div>

                      <div>
                        <div class="text-bold">Status:</div>
                        <q-select
                          type="text"
                          dense
                          outlined
                          v-model="editForm.status"
                          emit-value
                          map-options
                          :options="optionsStatus"
                        />
                      </div>

                      <div>
                        <div class="text-bold">extCode:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.extCode"
                        />
                      </div>

                      <div>
                        <div class="text-bold">oficina:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.office"
                        />
                      </div>

                      <div>
                        <div class="text-bold">category:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.category"
                        />
                      </div>

                      <div>
                        <div class="text-bold">customer:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.customer"
                        />
                      </div>

                      <div>
                        <div class="text-bold">type:</div>
                        <q-input
                          type="number"
                          dense
                          outlined
                          v-model="editForm.type"
                          emit-value
                          map-options
                          :options="optionsTypes"
                        />
                      </div>

                      <div>
                        <div class="text-bold">technology:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.technology"
                        />
                      </div>
                      <div>
                        <div class="text-bold">budget:</div>
                        <q-input
                          type="number"
                          dense
                          outlined
                          v-model="editForm.budget"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <!--Deadlines project-->
                  <q-tab-panel name="projectDeadline" class="q-pa-lg">
                    <div class="col q-gutter-y-lg">
                      <div>
                        <div class="text-bold">duracion:</div>
                        <q-input
                          type="number"
                          dense
                          outlined
                          v-model="editForm.estimatedDuration.duration"
                        />
                      </div>

                      <div>
                        <div class="text-bold">unidad:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.estimatedDuration.unit"
                          emit-value
                          map-options
                          :options="optionsDuration"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Inicio del proyecto:</div>
                        <q-input
                          type="date"
                          dense
                          outlined
                          v-model="editForm.startDate"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Fin del proyecto:</div>
                        <q-input
                          type="date"
                          dense
                          outlined
                          v-model="editForm.endDate"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <!--Project Owners-->
                  <q-tab-panel name="projectOwner" class="q-pa-lg">
                    <div class="col q-gutter-y-lg">
                      <div>
                        <div class="text-bold">manager:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.manager"
                        />
                      </div>
                      <div>
                        <div class="text-bold">projectLead:</div>
                        <q-input
                          type="text"
                          dense
                          outlined
                          v-model="editForm.projectLead"
                        />
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </q-tab-panel>

          <!--PROJECTS PANEL-->
          <q-tab-panel name="projects" style="height: 430px">
            <div
              v-if="
                showFormTeamMembers == false && showUpdateTeamMembers == false
              "
            >
              <q-table
                :rows="rows"
                :columns="columns"
                row-key="id"
                flat
                dense
                bordered
                separator="cell"
                :filter="filter"
                class="my-sticky-header-table"
                table-header-class="text-bold"
                title="Miembros asignados"
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
                      @click="showFormTeamMembers = true"
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
                        field="delete"
                        icon="edit"
                        @click="showModalUpdate(props)"
                      />
                      <q-btn
                        dense
                        flat
                        round
                        color="primary"
                        field="delete"
                        icon="delete"
                        @click="deleteTeamMember(props)"
                      />
                    </div>
                  </q-td>
                </template>
              </q-table>
            </div>
            <!-- FORM ADD NEW TEAM MEMBER COMPONENT-->
            <div v-else-if="showFormTeamMembers == true" class="q-pa-md">
              <div class="text-h4 text-bold q-pb-lg">Añadir miembro</div>
              <StaffingProjectsStaffingAddFormTeamMembers
                :members="members"
                :editForm="editForm"
                :statuses="statuses"
                @showFormTeamMembers="showFormTeamMembers = false"
              />
            </div>
            <!-- FORM UPDATE NEW TEAM MEMBER COMPONENT-->
            <div v-else-if="showUpdateTeamMembers == true" class="q-pa-md">
              <div class="text-h4 text-bold q-pb-lg">Actualizar miembro</div>
              <StaffingProjectsStaffingUpdateFormTeamMembers
                :editFormTeamembers="editFormTeamembers"
                :members="members"
                :editForm="editForm"
                :statuses="statuses"
                @updateProject="updateProject"
                @showUpdateTeamMembers="showUpdateTeamMembers = false"
              />
            </div>
          </q-tab-panel>
        </q-tab-panels>
        <q-separator />
        <q-card-actions align="right" class="q-pa-md">
          <div class="q-gutter-md">
            <q-btn
              type="reset"
              label="Cancelar"
              color="primary"
              flat
              @click="$emit('closeModalUpdate')"
            />
            <q-btn type="submit" label="Guardar" color="primary" />
          </div>
        </q-card-actions>
      </q-card>
    </q-form>
  </div>
</template>

<script>
import useQuasar from "quasar/src/composables/use-quasar.js";
import getStatus from "../../server/utils/modules/data/projects_options_DeX.json";
import { formatDate } from "../../server/utils/modules/timeUtils";

const columns = [
  {
    name: "name",
    label: "Nombre",
    field: (row) => row.fullname,
    align: "left",
  },
  {
    name: "status",
    label: "Estado",
    field: (row) => row.status,
    align: "left",
  },
  {
    name: "office",
    label: "Oficina",
    field: (row) => row.office,
    align: "left",
  },
  {
    name: "categoryPosition",
    label: "Categoria",
    field: (row) => row.categoryPosition,
    align: "left",
  },
  {
    name: "startDate",
    label: "Fecha Inicio",
    field: (row) => formatDate(row.startDate).split("-").reverse().join("-"),
    align: "left",
  },
  {
    name: "dedicaton",
    label: "Dedicacion",
    field: (row) => row.dedication + "%",
    align: "left",
  },

  { name: "action", field: "action", align: "left" },
];
export default defineNuxtComponent({
  props: {
    editForm: Object,
    projects: Object,
    members: Object,
  },

  async setup(props, context) {
    const $q = useQuasar();
    const projects = props.projects.projects;
    const statuses = props.projects.project_options.statuses;
    const teamMembers = findTeamMembersById();
    const idProject = props.editForm._id;
    const rows = ref([...teamMembers.teamMembers]);
    const editFormTeamembers = ref({});
    const showUpdateTeamMembers = ref(false);

    //Function to update a project
    async function updateProject() {
      $q.dialog({
        message: "Quieres actualizar este proyecto de la tabla?",
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
            method: "PUT",
            body: props.editForm,
          })
            .then((response) =>
              $q.notify({
                message: "Proyecto actualizado",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "Proyecto no actualizado",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("projects");
          }, 1000);

          context.emit("closeModalUpdate");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    //Function to find TeamMembers by Project ID
    function findTeamMembersById() {
      const found = projects.find(({ _id }) => _id === props.editForm._id);
      return found;
    }

    //Function to update TeamMembers
    function showModalUpdate(props) {
      showUpdateTeamMembers.value = true;
      const objectTeamMembers = {
        id: props.row._id,
        fullname: props.row.fullname,
        status: props.row.status,
        dedication: props.row.dedication,
        startDate: formatDate(props.row.startDate),
        endDate: formatDate(props.row.endDate),
      };
      editFormTeamembers.value = objectTeamMembers;
    }

    //Function to delete a TeamMember
    async function deleteTeamMember(props) {
      $q.dialog({
        message: "Quieres eliminar este miembro del proyecto?",
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
          const actualRow = props.row;
          return await $fetch(`/api/staffing/projects/${idProject}/members`, {
            method: "DELETE",
            body: {
              id: idProject,
              rows: actualRow,
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
                message: "Miembro no eliminado",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("projects");
          }, 1000);
          //Delete a row manually
          const index = props.rowIndex;
          rows.value = [
            ...rows.value.slice(0, index),
            ...rows.value.slice(index + 1),
          ];
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    return {
      rows,
      statuses,
      projects,
      teamMembers,
      columns,
      editFormTeamembers,
      filter: ref(""),
      showFormTeamMembers: ref(false),
      showUpdateTeamMembers,
      optionsStatus: getStatus.statuses,
      optionsTypes: getStatus.types,
      optionsDuration: getStatus.durationTypes,
      tab: ref("info"),
      innerTab: ref("projectData"),
      innerTabProjects: ref("projectsData"),
      splitterModel: ref(25),
      updateProject,
      findTeamMembersById,
      deleteTeamMember,
      showModalUpdate,
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
