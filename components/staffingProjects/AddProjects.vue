<template>
  <q-form>
    <q-stepper v-model="step" ref="stepper" color="primary" animated>
      <q-step :name="1" title="Datos miembro" icon="settings" :done="step > 1">
        <div class="row">
          <q-item class="col">
            <q-item-section>
              <q-input
                type="text"
                dense
                outlined
                label="Nombre *"
                v-model="name"
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

        <div class="row">
          <q-item class="col">
            <q-item-section>
              <q-input
                type="number"
                dense
                outlined
                label="Duración del proyecto *"
                v-model="estimatedDuration.duration"
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
                label="Unidad"
                v-model="estimatedDuration.unit"
                :options="optionsDuration"
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
                type="date"
                dense
                outlined
                label="Fecha de inicio"
                v-model="startDate"
              >
              </q-input>
            </q-item-section>
          </q-item>
          <q-item class="col">
            <q-item-section>
              <q-input
                type="date"
                dense
                outlined
                label="Fecha final"
                v-model="endDate"
              >
              </q-input>
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
                label="Manager"
                v-model="manager"
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
                label="Project Lead"
                v-model="projectLead"
              >
              </q-input>
            </q-item-section>
          </q-item>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Assignar proyecto"
        icon="create_new_folder"
        :done="step > 2"
      >
        An ad group contains one or more ads which target a shared set of
        keywords.
      </q-step>

      <template v-slot:navigation>
        <q-stepper-navigation>
          <q-btn
            @click="step === 2 ? addProject() : $refs.stepper.next()"
            color="primary"
            :label="step === 2 ? 'Enviar' : 'Continue'"
          />
          <q-btn
            v-if="step > 1"
            flat
            color="primary"
            @click="$refs.stepper.previous()"
            label="Back"
            class="q-ml-sm"
          />
        </q-stepper-navigation>
      </template>
    </q-stepper>
  </q-form>
</template>
<script>
import { ref } from "vue";
import getStatus from "../../server/utils/modules/data/projects_options_DeX.json";

export default defineNuxtComponent({
  props: {
    projects: Object,
  },
  setup(props) {
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
      await $fetch("/api/staffing/projects", {
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
      });
    }

    return {
      step: ref(1),
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
      optionsOffice: optionsOffice,
      optionsStatus: getStatus.statuses,
      optionsTypes: getStatus.types,
      optionsDuration: getStatus.durationTypes,
    };
  },
});
</script>
