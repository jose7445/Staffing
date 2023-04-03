<template>
  <!-- <n-theme-editor> -->
  <n-config-provider :theme-overrides="themeOverrides">
    <div class="bg-image">
      <n-space vertical justify="center" align="center">
        <div class="container-form" style="width: 400px">
          <n-h1 class="title" align="center" style="margin-bottom: 0"
            >Staffing</n-h1
          >
          <n-h2 class="title" align="center" style="margin: 0"
            >Sign into Your account</n-h2
          >
          <n-form
            class="form"
            style="margin-top: 2rem"
            @submit.prevent="sendMessage"
          >
            <n-form-item>
              <n-input
                style="min-height: 60px; width: 100%"
                autosize
                type="text"
                placeholder="Email"
                size="large"
                clearable
                v-model:value="email"
              >
                <template #prefix>
                  <n-icon :component="AtCircle" />
                </template>
              </n-input>
            </n-form-item>
            <n-form-item>
              <n-input
                style="min-height: 60px; width: 100%"
                autosize
                type="password"
                placeholder="Contraseña"
                size="large"
                clearable
                v-model:value="password"
              >
                <template #prefix>
                  <n-icon :component="EllipsisHorizontalCircleSharp" />
                </template>
              </n-input>
            </n-form-item>
            <n-row :gutter="[0, 24]">
              <n-col :span="24">
                <div style="display: flex; justify-content: center">
                  <n-button
                    filled
                    type="warning"
                    attr-type="submit"
                    style="width: 100%"
                  >
                    Entrar
                  </n-button>
                </div>
              </n-col>
            </n-row>
          </n-form>
        </div>
      </n-space>
    </div>
  </n-config-provider>
  <!-- </n-theme-editor> -->
</template>

<script>
import { NConfigProvider } from "naive-ui";
import { AtCircle, EllipsisHorizontalCircleSharp } from "@vicons/ionicons5";

// import { NThemeEditor } from 'naive-ui'

export default {
  data() {
    const themeOverrides = {
      common: {
        primaryColor: "#437084",
        fontWeight: "900",
        fontSizeMedium: "18px",
      },
      Button: {
        textColor: "#437084",
        heightMedium: "50px",
      },
      Typography: { headerFontSize1: "32px", headerFontSize2: "24px" },
    };

    return {
      themeOverrides,
      EllipsisHorizontalCircleSharp: shallowRef(EllipsisHorizontalCircleSharp),
      AtCircle: shallowRef(AtCircle),
      email: "",
      password: "",
    };
  },
  methods: {
    sendMessage() {
      alert(this.password);
    },
  },
};

// ...
</script>

<!-- <script>
import { defineComponent } from "vue";
import { NThemeEditor } from "naive-ui";

export default defineComponent({
  components: {
    NThemeEditor,
  },
});
</script> -->

<style scoped>
.bg-image {
  position: fixed;
  min-width: 100%;
  min-height: 100%;
  background-image: url("https://www.lavozdegalicia.es/default/2022/10/07/00121665151022611898545/Foto/H05O2008.jpg");
  background-repeat: no-repeat;
  background-size: cover;
}

.n-space {
  height: 100vh;
}

.container-form {
  background-color: white;
  padding: 3rem;
  border-radius: 10px;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
}
</style>
