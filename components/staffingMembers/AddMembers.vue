<template>
  <q-form @submit.prevent.stop="addMember">
    <q-stepper v-model="step" color="primary" animated>
      <!-- Members data STEP 1-->
      <q-step :name="1" title="Datos miembro" icon="settings" :done="step > 1">
        <div class="row">
          <q-item class="col">
            <q-item-section>
              <q-input
                ref="nameRef"
                type="text"
                dense
                outlined
                v-model="name"
                label="Nombre *"
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
                ref="lastnameRef"
                type="text"
                dense
                outlined
                v-model="lastname"
                label="Apellidos *"
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
              <q-select
                ref="officeRef"
                type="text"
                dense
                outlined
                v-model="office"
                label="Oficina *"
                lazy-rules
                :rules="nameRules"
                hide-bottom-space
                :options="optionsOffice"
                emit-value
                map-options
              />
            </q-item-section>
          </q-item>
          <q-item class="col">
            <q-item-section>
              <q-input
                type="number"
                dense
                outlined
                v-model="employedId"
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
                v-model="companyEmail"
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
                v-model="password"
                label="Contraseña"
              />
            </q-item-section>
          </q-item>
        </div>

        <q-stepper-navigation>
          <q-btn @click="validateStepper" color="primary" label="Continuar" />
        </q-stepper-navigation>
      </q-step>

      <!-- Personal data STEP 2-->
      <q-step :name="2" title="Datos personales" icon="person" :done="step > 2">
        <div class="row">
          <q-item class="col">
            <q-item-section>
              <q-input
                type="email"
                dense
                outlined
                v-model="personalData.email"
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
                v-model="personalData.phone"
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

      <!-- Staffing data STEP 3-->
      <q-step :name="3" title="Datos staffing" icon="workspaces">
        <div class="row">
          <q-item class="col">
            <q-item-section>
              <q-input
                type="url"
                dense
                outlined
                v-model="staffing.cvLink"
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
                v-model="staffing.technologies"
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
                v-model="staffing.experience"
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
                v-model="staffing.categoryCode"
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
                v-model="staffing.categoryPosition"
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
                v-model="staffing.categoryLevel"
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
                v-model="staffing.salary"
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
                v-model="staffing.csr"
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
                v-model="staffing.endCurrentAssignation"
                label="Finalización de asignación"
              />
            </q-item-section>
          </q-item>
        </div>
        <div class="row">
          <q-item class="col items-center">
            <q-item-section>
              <q-input
                autogrow
                type="textarea"
                label="Comentarios"
                dense
                outlined
                v-model="staffing.comments"
              />
            </q-item-section>
            <div>
              <q-btn
                round
                color="primary"
                icon="add"
                size="xs"
                class="q-ml-sm"
              />
            </div>
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

      <!-- Security data STEP 4-->
      <q-step :name="4" title="Seguridad" icon="security">
        <div class="row">
          <q-item class="col">
            <q-item-section>
              <q-select
                emit-value
                map-options
                dense
                outlined
                v-model="security.isSuper"
                label="Es super?"
                :options="optionsSuper"
              />
            </q-item-section>
          </q-item>
          <q-item class="col">
            <q-item-section>
              <q-input dense outlined v-model="security.roles" label="Roles" />
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
</template>

<script>
import getExperience from "../../server/utils/modules/data/staffMember_options_DeX.json";
import getCategoryPosition from "../../server/utils/modules/data/job_categories_DeX.json";
import getCategoryLevel from "../../server/utils/modules/data/job_levels_DeX.json";
import { ref } from "vue";

export default defineNuxtComponent({
  props: {
    users: Object,
  },

  setup(props) {
    const nameRef = ref(null);
    const lastnameRef = ref(null);
    const officeRef = ref(null);
    const step = ref(1);
    const name = ref(null);
    const lastname = ref(null);
    const office = ref(null);
    const employedId = ref(null);
    const companyEmail = ref(null);
    const password = ref(null);
    const personalData = ref({
      email: "",
      phone: "",
    });
    const staffing = ref({
      cvLink: "",
      technologies: "",
      experience: "",
      categoryCode: "",
      categoryPosition: "",
      categoryLevel: "",
      salary: "",
      csr: "",
      endCurrentAssignation: "",
      comments: "",
    });
    const security = ref({
      isSuper: "",
      roles: "",
    });
    const optionsOffice = props.users.offices;

    //Function validate stepper
    function validateStepper() {
      if (!name.value || !lastname.value || !office.value) {
        nameRef.value.validate();
        lastnameRef.value.validate();
        officeRef.value.validate();
      } else {
        step.value = 2;
      }
    }

    // Function to add a new member
    async function addMember() {
      await $fetch("/api/staffing/members", {
        method: "POST",
        body: {
          name: name.value,
          lastname: lastname.value,
          office: office.value,
          employedId: employedId.value,
          companyEmail: companyEmail.value,
          password: password.value,
          personalData: {
            email: personalData.value.email,
            phone: personalData.value.phone,
          },
          staffing: {
            cvLink: staffing.value.cvLink,
            technologies: staffing.value.technologies,
            experience: staffing.value.experience,
            // categoryCode: staffing.value.categoryCode,
            categoryPosition: staffing.value.categoryPosition,
            categoryLevel: staffing.value.categoryLevel,
            salary: staffing.value.salary,
            csr: staffing.value.csr,
            endCurrentAssignation: staffing.value.endCurrentAssignation,
            // comments: staffing.value.comments,
          },
          // security: {
          //   isSuper: security.value.isSuper,
          //   roles: security.value.roles,
          // },
        },
      });
    }

    return {
      name,
      lastname,
      office,
      companyEmail,
      employedId,
      password,
      personalData,
      staffing,
      security,
      addMember,
      validateStepper,
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
      optionsOffice: optionsOffice,
      optionsExperience: getExperience.experience,
      optionsPosition: getCategoryPosition,
      optionsLevel: getCategoryLevel,
      //Validations
      nameRef,
      lastnameRef,
      officeRef,
      nameRules: [(val) => (val && val.length > 0) || "Requeridos"],
    };
  },
});
</script>
