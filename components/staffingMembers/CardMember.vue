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
          <q-splitter v-model="splitterModel" style="height: 500px">
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
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.name }} {{ membersId.lastname }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div>
                      <div class="text-bold">Email corporativo:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.companyEmail }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div class="row q-gutter-x-md">
                      <div class="col-grow">
                        <div class="text-bold">ID Empleado:</div>
                        <q-field outlined dense>
                          <template v-slot:control>
                            <div
                              class="self-center full-width no-outline"
                              tabindex="0"
                            >
                              {{ membersId.employedId }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col-grow">
                        <div class="text-bold">Oficina:</div>
                        <q-field outlined dense>
                          <template v-slot:control>
                            <div
                              class="self-center full-width no-outline"
                              tabindex="0"
                            >
                              {{ membersId.office }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                    </div>

                    <div>
                      <div class="text-bold">Email Personal:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.personalData?.email }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div>
                      <div class="text-bold">Telefono Personal:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.personalData?.phone }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-tab-panel>

                <!--Staffing Data-->
                <q-tab-panel name="staffingData" class="q-pa-lg">
                  <div class="col q-gutter-y-lg">
                    <div>
                      <div class="text-bold">Curriculum Vitae:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.staffing?.cvLink }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div>
                      <div class="text-bold">Tecnologias:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.staffing?.technologies }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div class="row q-gutter-x-md">
                      <div class="col">
                        <div class="text-bold">Experiencia:</div>
                        <q-field outlined dense>
                          <template v-slot:control>
                            <div
                              class="self-center full-width no-outline"
                              tabindex="0"
                            >
                              {{ membersId.staffing?.experience }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col">
                        <div class="text-bold">Codigo categoría:</div>
                        <q-field outlined dense>
                          <template v-slot:control>
                            <div
                              class="self-center full-width no-outline"
                              tabindex="0"
                            >
                              {{ membersId.staffing?.categoryCode }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                    </div>

                    <div class="row q-gutter-x-md">
                      <div class="col">
                        <div class="text-bold">Posicion categoría:</div>
                        <q-field outlined dense>
                          <template v-slot:control>
                            <div
                              class="self-center full-width no-outline"
                              tabindex="0"
                            >
                              {{ membersId.staffing?.categoryPosition }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                      <div class="col">
                        <div class="text-bold">Nivel categoría:</div>
                        <q-field outlined dense>
                          <template v-slot:control>
                            <div
                              class="self-center full-width no-outline"
                              tabindex="0"
                            >
                              {{ membersId.staffing?.categoryLevel }}
                            </div>
                          </template>
                        </q-field>
                      </div>
                    </div>

                    <div>
                      <div class="text-bold">Salario:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.staffing?.salary }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                    <div>
                      <div class="text-bold">CSR:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.staffing?.csr }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-tab-panel>

                <!--Security Data-->
                <q-tab-panel name="securityData" class="q-pa-lg">
                  <div class="col q-gutter-y-lg">
                    <div>
                      <div class="text-bold">Perfil:</div>

                      <q-field
                        v-if="membersId.security?.isSuper === true"
                        outlined
                        dense
                      >
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            Administrador
                          </div>
                        </template>
                      </q-field>

                      <q-field v-else outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            No es administrador
                          </div>
                        </template>
                      </q-field>
                    </div>

                    <div>
                      <div class="text-bold">Rol:</div>
                      <q-field outlined dense>
                        <template v-slot:control>
                          <div
                            class="self-center full-width no-outline"
                            tabindex="0"
                          >
                            {{ membersId.security?.roles }}
                          </div>
                        </template>
                      </q-field>
                    </div>
                  </div>
                </q-tab-panel>

                <!--Comments Data-->
                <q-tab-panel name="commentsData" class="q-pa-lg">
                  <div
                    class="col q-gutter-lg"
                    v-if="membersId.staffing.comments != ''"
                  >
                    <q-list separator class="col">
                      <div class="text-bold">Comentarios:</div>
                      <q-item
                        class="q-ma-none q-py-md"
                        v-for="comments in membersId.staffing.comments"
                        :key="comments._id"
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
                      </q-item>
                    </q-list>
                  </div>
                  <div v-else>No hay comentarios para este miembro</div>
                </q-tab-panel>
              </q-tab-panels>
            </template>
          </q-splitter>
        </q-tab-panel>

        <!--PROJECTS PANEL-->
        <q-tab-panel name="projects" class="q-pa-none">
          <q-splitter v-model="splitterModel" style="height: 500px">
            <template v-slot:before>
              <q-tabs v-model="innerTabProjects" vertical class="text-primary">
                <q-tab name="projectsData" label="Datos proyecto" />
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
                <!--Project Data-->
                <q-tab-panel name="projectsData" class="q-pa-lg">
                  <div v-if="(membersId.staffing.assignations = '')"></div>

                  <div v-else>No tiene proyectos</div>
                </q-tab-panel>

                <!--Comments Data-->
                <q-tab-panel name="commentsData" class="q-pa-lg">
                  <div class="col q-gutter-y-md">
                    <div v-if="membersId.staffing?.comments == ''">
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
                          {{ membersId.staffing?.comments }}
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
    </q-card>
  </div>
</template>

<script>
import { ref } from "vue";

export default defineNuxtComponent({
  props: ["membersId"],

  setup() {
    return {
      tab: ref("info"),
      innerTab: ref("personalData"),
      innerTabProjects: ref("projectsData"),
      splitterModel: ref(25),
    };
  },
});
</script>
