<template>
  <div style="width: 900px; max-width: 100vw; max-height: 100%">
    <q-form @submit.prevent="updateMember">
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
          <q-tab name="projects" label="Proyectos" icon="folder" />
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
                  <q-tab name="personalData" label="Datos personales" />
                  <q-tab name="staffingData" label="Datos Staffing" />
                  <q-tab name="securityData" label="Seguridad" />
                  <q-tab name="commentsData" label="Comentarios" />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="innerTab"
                  animated
                  transition-prev="jump-up"
                  transition-next="jump-down"
                >
                  <!--Personal Data-->
                  <q-tab-panel name="personalData" class="q-pa-lg">
                    <div class="col q-gutter-y-lg">
                      <div>
                        <div class="text-bold">Nombre:</div>
                        <q-input
                          type="text"
                          outlined
                          dense
                          v-model="editForm.name"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Apellidos:</div>
                        <q-input
                          type="text"
                          outlined
                          dense
                          v-model="editForm.lastname"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Oficina:</div>
                        <q-select
                          type="text"
                          outlined
                          dense
                          v-model="editForm.office"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Email corporativo:</div>
                        <q-input
                          type="email"
                          outlined
                          dense
                          v-model="editForm.companyEmail"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Password:</div>
                        <q-input
                          v-model="editForm.password"
                          outlined
                          dense
                          :type="isPwd ? 'password' : 'text'"
                        >
                          <template v-slot:append>
                            <q-icon
                              :name="isPwd ? 'visibility_off' : 'visibility'"
                              class="cursor-pointer"
                              @click="isPwd = !isPwd"
                            />
                          </template>
                        </q-input>
                      </div>

                      <div>
                        <div class="text-bold">Email personal:</div>
                        <q-input
                          type="email"
                          outlined
                          dense
                          v-model="editForm.personalData.email"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Telefono personal:</div>
                        <q-input
                          type="tel"
                          outlined
                          dense
                          v-model="editForm.personalData.phone"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <!--Staffing Data-->
                  <q-tab-panel name="staffingData" class="q-pa-lg">
                    <div class="col q-gutter-y-lg">
                      <div>
                        <div class="text-bold">Fecha incorporacon:</div>
                        <q-input
                          type="date"
                          outlined
                          dense
                          v-model="editForm.staffing.incorporationDate"
                        />
                      </div>
                      <div>
                        <div class="text-bold">Categoria incorporacon:</div>
                        <q-input
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.incorporationCategory"
                        />
                      </div>
                      <div>
                        <div class="text-bold">CV Link:</div>
                        <q-input
                          type="url"
                          outlined
                          dense
                          v-model="editForm.staffing.cvLink"
                        />
                      </div>
                      <div>
                        <div class="text-bold">Tecnologias:</div>
                        <q-input
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.technologies"
                        />
                      </div>
                      <div>
                        <div class="text-bold">Experiencia:</div>
                        <q-select
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.experience"
                          emit-value
                          map-options
                          :options="optionsExperience"
                        />
                      </div>
                      <div>
                        <div class="text-bold">categoryCode:</div>
                        <q-input
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.categoryCode"
                        />
                      </div>
                      <div>
                        <div class="text-bold">categoryPosition:</div>
                        <q-select
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.categoryPosition"
                          emit-value
                          map-options
                          :options="optionsPosition"
                        />
                      </div>
                      <div>
                        <div class="text-bold">categoryLevel:</div>
                        <q-select
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.categoryLevel"
                          emit-value
                          map-options
                          :options="optionsLevel"
                        />
                      </div>
                      <div>
                        <div class="text-bold">salary:</div>
                        <q-input
                          type="number"
                          outlined
                          dense
                          v-model="editForm.staffing.salary"
                        />
                      </div>
                      <div>
                        <div class="text-bold">csr:</div>
                        <q-input
                          type="text"
                          outlined
                          dense
                          v-model="editForm.staffing.csr"
                        />
                      </div>
                    </div>
                  </q-tab-panel>

                  <!--Security-->
                  <q-tab-panel name="securityData" class="q-pa-lg">
                    <div class="col q-gutter-y-lg">
                      <div>
                        <div class="text-bold">Es administrador:</div>
                        <q-select
                          type="text"
                          outlined
                          dense
                          v-model="editForm.security.isSuper"
                          emit-value
                          map-options
                          :options="optionsSuper"
                        />
                      </div>

                      <div>
                        <div class="text-bold">Rols:</div>

                        <q-select
                          type="text"
                          outlined
                          dense
                          v-model="editForm.security.roles"
                          :options="optionsRoles"
                          multiple
                        >
                          <template
                            v-slot:option="{
                              itemProps,
                              opt,
                              selected,
                              toggleOption,
                            }"
                          >
                            <q-item v-bind="itemProps">
                              <q-item-section>
                                <q-item-label v-html="opt.label" />
                              </q-item-section>
                              <q-item-section side>
                                <q-toggle
                                  :model-value="selected"
                                  @update:model-value="toggleOption(opt)"
                                />
                              </q-item-section>
                            </q-item>
                          </template>
                        </q-select>
                      </div>
                    </div>
                  </q-tab-panel>

                  <!--Comments -->
                  <q-tab-panel name="commentsData" class="q-pa-lg">
                    <!--Div if comments are not empty-->
                    <div
                      class="col q-gutter-y-md"
                      v-if="editForm.staffing.comments != ''"
                    >
                      <q-list separator class="col">
                        <div class="text-bold">Comentarios:</div>
                        <q-item
                          class="q-ma-none q-py-md"
                          v-for="(comments, index) in editForm.staffing
                            .comments"
                          :key="index"
                        >
                          <q-item-section avatar>
                            <q-avatar color="primary" text-color="white">
                              Q
                            </q-avatar>
                          </q-item-section>

                          <q-item-section>
                            <q-item-label
                              >{{ comments._id }}
                              <span class="text-caption">{{
                                comments.createdAt
                              }}</span></q-item-label
                            >

                            <q-item-label lines="1" class="text-h5">{{
                              comments.comment
                            }}</q-item-label>
                          </q-item-section>

                          <q-item-section side>
                            <q-btn
                              dense
                              flat
                              round
                              color="primary"
                              icon="delete"
                              @click="deleteComment(index)"
                            />
                          </q-item-section>
                        </q-item>
                      </q-list>

                      <div>
                        <q-input
                          type="textarea"
                          autogrow
                          outlined
                          dense
                          v-model="watchComments"
                          label="Añade un comentario nuevo"
                        >
                          <template v-slot:append>
                            <q-btn
                              dense
                              flat
                              round
                              color="primary"
                              icon="send"
                              @click="addComment()"
                            />
                          </template>
                        </q-input>
                      </div>
                    </div>

                    <!--Comments Div v-else comments empty-->
                    <div class="col q-gutter-y-md" v-else>
                      <div>No hay comentarios para este miembro</div>

                      <div>
                        <q-input
                          type="textarea"
                          autogrow
                          outlined
                          dense
                          v-model="watchComments"
                          label="Añade un comentario nuevo"
                        >
                          <template v-slot:append>
                            <q-btn
                              dense
                              flat
                              round
                              color="primary"
                              icon="send"
                              @click="addComment()"
                            />
                          </template>
                        </q-input>
                      </div>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
          </q-tab-panel>

          <!--PROJECTS PANEL-->
          <q-tab-panel name="projects" class="q-pa-none">
            <q-splitter v-model="splitterModel" style="height: 430px">
              <template v-slot:before>
                <q-tabs
                  v-model="innerTabProjects"
                  vertical
                  class="text-primary"
                >
                  <q-tab name="projectsData" label="Asignaciones" />
                  <q-tab name="commentsData" label="Comentarios" />
                </q-tabs>
              </template>

              <template v-slot:after>
                <q-tab-panels
                  v-model="innerTabProjects"
                  animated
                  transition-prev="slide-down"
                  transition-next="slide-up"
                >
                  <!--Assignations-->
                  <q-tab-panel name="projectsData" class="q-px-none">
                    <div style="width: 100%">
                      <q-card flat>
                        <q-tabs
                          v-model="tabUpdateProject"
                          dense
                          class="text-grey"
                          active-color="primary"
                          narrow-indicator
                          indicator-color="primary"
                          align="left"
                        >
                          <q-tab name="overview" label="Ver proyectos" />
                          <q-tab name="addProject" label="Añadir proyecto" />
                        </q-tabs>

                        <q-separator />
                        <!--Assignations overview-->
                        <q-tab-panels v-model="tabUpdateProject" animated>
                          <q-tab-panel name="overview">
                            No hay proyectos para este miembro
                          </q-tab-panel>
                          <!--Assignations add project-->
                          <q-tab-panel name="addProject">
                            <StaffingMembersAssignProjectMember
                              :editForm="editForm"
                              :projects="projects"
                            />
                          </q-tab-panel>
                        </q-tab-panels>
                      </q-card>
                    </div>
                  </q-tab-panel>

                  <!--Comments-->
                  <q-tab-panel name="commentsData" class="q-pa-lg">
                    <div class="col q-gutter-y-md">
                      <div v-if="editForm.staffing?.comments == ''">
                        <div
                          class="self-center full-width no-outline"
                          tabindex="0"
                        >
                          No hay comentarios para este proyecto
                        </div>
                      </div>

                      <q-field v-else label="CSR" stack-label dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ editForm.staffing?.comments }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </q-tab-panel>
                </q-tab-panels>
              </template>
            </q-splitter>
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
import getExperience from "../../server/utils/modules/data/staffMember_options_DeX.json";
import getCategoryPosition from "../../server/utils/modules/data/job_categories_DeX.json";
import getCategoryLevel from "../../server/utils/modules/data/job_levels_DeX.json";

export default defineNuxtComponent({
  props: {
    editForm: Object,
    projects: Object,
  },

  setup(props, context) {
    const $q = useQuasar();
    const watchComments = ref("");
    const getComment = props.editForm.staffing.comments;
    const dateComments = new Date();
    const projectName = ref("");

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
            body: props.editForm,
          })
            .then((response) =>
              $q.notify({
                message: "Miembro actualizado",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "Correo corporativo duplicado",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("users");
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

    //Function to add a comment
    function addComment() {
      $q.dialog({
        message: "Quieres añadir este comentario?",
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
        .onOk(() => {
          const inputComments = {
            comment: watchComments.value,
            createdAt: dateComments,
          };
          getComment.push(inputComments);
          watchComments.value = "";
        })
        .onOk(() => {})
        .onCancel(() => {
          // console.log('>>>> Cancel')
          watchComments.value = "";
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    //Function to delete a comment
    function deleteComment(index) {
      $q.dialog({
        message: "Quieres eliminar este comentario?",
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
        .onOk(() => {
          getComment.splice(index, 1);
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
      projectName,
      watchComments,
      tabUpdateProject: ref("overview"),
      isPwd: ref(true),
      tab: ref("info"),
      innerTab: ref("personalData"),
      innerTabProjects: ref("projectsData"),
      splitterModel: ref(25),
      optionsProjects: props.projects.projects.map((a) => a.name),
      optionsExperience: getExperience.experience,
      optionsPosition: getCategoryPosition,
      optionsLevel: getCategoryLevel,
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
      optionsRoles: [
        {
          label: "admin",
          text: "admin",
          value: "admin",
        },
        {
          label: "read",
          text: "read",
          value: "read",
        },
      ],
      updateMember,
      deleteComment,
      addComment,
    };
  },
});
</script>
