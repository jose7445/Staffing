<template>
  <div style="width: 900px; max-width: 100vw; max-height: 100%">
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
          <q-splitter v-model="splitterModel" style="height: 490px">
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
                  <div class="col q-gutter-y-md">
                    <div>
                      <div class="text-bold">Nombre:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.name }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Descripcion:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.description }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Estado:</div>
                      <q-field outlined stack-label dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.status }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Ext Code:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.extCode }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Oficina:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.office }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Categoria:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.category }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Customer:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.customer }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Tipo:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.type }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Tecnologia:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.technology }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Budget:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.budget }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-tab-panel>

                <!--Deadlines Project-->
                <q-tab-panel name="projectDeadline" class="q-pa-lg">
                  <div class="col q-gutter-y-md">
                    <div>
                      <div class="text-bold">Duracion:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.estimatedDuration.duration }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Unidad:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.estimatedDuration.unit }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Inicio del proyecto:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{
                              formatDate(projectsId?.startDate)
                                .split("-")
                                .reverse()
                                .join("-")
                            }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Fin del proyecto:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{
                              formatDate(projectsId?.endDate)
                                .split("-")
                                .reverse()
                                .join("-")
                            }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-tab-panel>

                <!--Owner Project-->
                <q-tab-panel name="projectOwner" class="q-pa-lg">
                  <div class="col q-gutter-y-md">
                    <div>
                      <div class="text-bold">Manager:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.manager }}
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Project lead:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ projectsId?.projectLead }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>

        <!--ASIGNATIONS PANEL-->
        <q-tab-panel name="projects" class="q-pa-none">
          <!--Project Data-->
          <q-tab-panel name="projectsAssination" style="height: 490px">
            <q-table
              :rows="teamMembers.teamMembers"
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
                </div>
              </template>
            </q-table>
          </q-tab-panel>
        </q-tab-panel>
      </q-tab-panels>
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";
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
];

export default defineNuxtComponent({
  props: ["projectsId", "projects"],

  setup(props) {
    const projects = props.projects.projects;
    const teamMembers = ref({});

    setTimeout(() => {
      const info = findTeamMembersById();
      teamMembers.value = info;
    }, 500);

    //Function to find TeamMembers by Project ID
    function findTeamMembersById() {
      const found = projects.find(({ _id }) => _id === props.projectsId._id);
      return found;
    }

    return {
      columns,
      teamMembers,
      projects,
      tab: ref("info"),
      filter: ref(""),
      innerTab: ref("projectData"),
      innerTabProjects: ref("projectsAssination"),
      splitterModel: ref(25),
      findTeamMembersById,
      formatDate,
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
