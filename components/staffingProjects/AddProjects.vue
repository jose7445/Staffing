<template>
  <q-card style="width: 900px; max-width: 100vw; max-height: 100%">
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
    <q-form @submit.prevent.stop="addProject">
      <q-stepper v-model="step" ref="stepper" color="primary" animated>
        <!--Project data STEP 1-->
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
                  label="Nombre *"
                  v-model="name"
                  ref="nameRef"
                  lazy-rules
                  :rules="nameRules"
                  hide-bottom-space
                >
                </q-input>
              </q-item-section>
            </q-item>
          </div>

          <div class="row">
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="textarea"
                  dense
                  outlined
                  label="Descripcion *"
                  v-model="description"
                  autogrow
                  ref="descriptionRef"
                  lazy-rules
                  :rules="nameRules"
                  hide-bottom-space
                >
                </q-input>
              </q-item-section>
            </q-item>
          </div>

          <div class="row">
            <q-item class="col">
              <q-item-section>
                <q-select
                  type="text"
                  dense
                  outlined
                  label="Estado del proyecto"
                  v-model="status"
                  :options="optionsStatus"
                  emit-value
                  map-options
                >
                </q-select>
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="number"
                  dense
                  outlined
                  label="Ext Codigo"
                  v-model="extCode"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-select
                  type="text"
                  dense
                  outlined
                  label="Oficina"
                  v-model="office"
                  :options="optionsOffice"
                  emit-value
                  map-options
                >
                </q-select>
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
                  label="Categoria"
                  v-model="category"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  label="Customer"
                  v-model="customer"
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-select
                  type="text"
                  dense
                  outlined
                  label="Tipo"
                  v-model="type"
                  :options="optionsTypes"
                  emit-value
                  map-options
                >
                </q-select>
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
                  label="Tecnologia *"
                  v-model="technology"
                  ref="tecnologyRef"
                  lazy-rules
                  :rules="nameRules"
                  hide-bottom-space
                >
                </q-input>
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="number"
                  dense
                  outlined
                  label="Budget"
                  v-model="budget"
                >
                </q-input>
              </q-item-section>
            </q-item>
          </div>

          <q-stepper-navigation align="right">
            <q-btn @click="validateStepper" color="primary" label="Continuar" />
          </q-stepper-navigation>
        </q-step>

        <!--Calendar projects STEP 2-->
        <q-step
          :name="2"
          title="Deadlines proyectos"
          icon="calendar_month"
          :done="step > 2"
        >
          <div class="row">
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="number"
                  dense
                  outlined
                  v-model="estimatedDuration.duration"
                  label="Duracion"
                  ref="estimatedDurationRef"
                  lazy-rules
                  :rules="nameRules"
                  hide-bottom-space
                />
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-select
                  type="text"
                  dense
                  outlined
                  v-model="estimatedDuration.unit"
                  label="Unidad"
                  emit-value
                  map-options
                  :options="optionsDuration"
                  ref="estimatedDurationUnitRef"
                  lazy-rules
                  :rules="nameRules"
                  hide-bottom-space
                />
              </q-item-section>
            </q-item>
          </div>
          <div class="row">
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="date"
                  dense
                  outlined
                  v-model="startDate"
                  label="startDate"
                />
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="date"
                  dense
                  outlined
                  v-model="endDate"
                  label="endDate"
                />
              </q-item-section>
            </q-item>
          </div>

          <q-stepper-navigation align="right">
            <q-btn
              flat
              @click="step = 1"
              color="primary"
              label="Volver"
              class="q-ml-sm"
            />
            <q-btn
              @click="validateStepperTwo"
              color="primary"
              label="Continuar"
            />
          </q-stepper-navigation>
        </q-step>

        <!--Owners Data STEP 3-->
        <q-step
          :name="3"
          title="Responsables proyecto"
          icon="workspaces"
          :done="step > 3"
        >
          <div class="row">
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  v-model="manager"
                  label="Manager"
                />
              </q-item-section>
            </q-item>
            <q-item class="col">
              <q-item-section>
                <q-input
                  type="text"
                  dense
                  outlined
                  v-model="projectLead"
                  label="projectLead"
                />
              </q-item-section>
            </q-item>
          </div>

          <q-stepper-navigation align="right">
            <q-btn
              flat
              @click="step = 2"
              color="primary"
              label="Volver"
              class="q-ml-sm"
            />
            <q-btn
              @click="step = 3"
              color="primary"
              label="Enviar"
              type="submit"
            />
          </q-stepper-navigation>
        </q-step>
      </q-stepper>
    </q-form>
  </q-card>
</template>
<script>
import { ref } from "vue";
import getStatus from "../../server/utils/modules/data/projects_options_DeX.json";

export default defineNuxtComponent({
  props: {
    projects: Object,
  },
  setup(props, context) {
    const $q = useQuasar();
    const nameRef = ref(null);
    const descriptionRef = ref(null);
    const tecnologyRef = ref(null);
    const estimatedDurationRef = ref(null);
    const estimatedDurationUnitRef = ref(null);
    const step = ref(1);
    const name = ref(null);
    const description = ref(null);
    const status = ref(null);
    const extCode = ref(null);
    const office = ref(null);
    const category = ref(null);
    const estimatedDuration = ref({
      duration: "",
      unit: "",
    });
    const customer = ref(null);
    const type = ref(null);
    const technology = ref(null);
    const budget = ref(null);
    const startDate = ref(null);
    const endDate = ref(null);
    const manager = ref(null);
    const projectLead = ref(null);
    const optionsOffice = props.projects.offices;

    async function addProject() {
      $q.dialog({
        message: "Quieres añadir este proyecto en la tabla?",
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
          return await $fetch("/api/staffing/projects", {
            method: "POST",
            body: {
              name: name.value,
              description: description.value,
              status: status.value,
              extCode: office.value,
              office: office.value,
              category: category.value,
              estimatedDuration: {
                duration: estimatedDuration.value.duration,
                unit: estimatedDuration.value.unit,
              },
              customer: customer.value,
              type: type.value,
              technology: technology.value,
              budget: budget.value,
              startDate: startDate.value,
              endDate: endDate.value,
              manager: manager.value,
              projectLead: projectLead.value,
            },
          })
            .then((response) =>
              $q.notify({
                message: "Proyecto añadido",
                type: "positive",
              })
            )
            .catch((error) =>
              $q.notify({
                message: "Error al añadir el proyecto",
                type: "negative",
              })
            );
        })
        .onOk(() => {
          setTimeout(() => {
            refreshNuxtData("projects");
          }, 1000);

          context.emit("close");
        })
        .onCancel(() => {
          // console.log('>>>> Cancel')
        })
        .onDismiss(() => {
          // console.log('I am triggered on both OK and Cancel')
        });
    }

    //Function validate stepper
    function validateStepper() {
      if (!name.value || !description.value || !technology.value) {
        nameRef.value.validate();
        descriptionRef.value.validate();
        tecnologyRef.value.validate();
      } else {
        step.value = 2;
      }
    }

    //Function validate stepper
    function validateStepperTwo() {
      if (!estimatedDuration.value.duration || !estimatedDuration.value.unit) {
        estimatedDurationRef.value.validate();
        estimatedDurationUnitRef.value.validate();
      } else {
        step.value = 3;
      }
    }

    return {
      nameRef,
      descriptionRef,
      tecnologyRef,
      estimatedDurationRef,
      estimatedDurationUnitRef,
      step,
      name,
      description,
      status,
      extCode,
      office,
      category,
      estimatedDuration,
      customer,
      type,
      technology,
      budget,
      startDate,
      endDate,
      manager,
      projectLead,
      addProject,
      validateStepper,
      validateStepperTwo,
      optionsOffice: optionsOffice,
      optionsStatus: getStatus.statuses,
      optionsTypes: getStatus.types,
      optionsDuration: getStatus.durationTypes,
      nameRules: [(val) => (val && val.length > 0) || "Requeridos"],
    };
  },
});
</script>
