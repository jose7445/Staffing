<template>
  <q-header bordered class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title>
        <NuxtLink to="/" class="text-white text-bold"
          >NTT DATA
        </NuxtLink></q-toolbar-title
      >

      <NuxtLink to="/login">
        <q-btn flat round color="white" icon="account_circle" />
      </NuxtLink>
    </q-toolbar>
  </q-header>

  <div>
    <q-drawer
      v-model="leftDrawerOpen"
      side="left"
      overlay
      bordered
      :breakpoint="100"
    >
      <q-list padding class="rounded-borders text-primary q-pa-none">
        <q-expansion-item
          v-for="menu in menu"
          expand-separator
          :label="menu.label"
          :key="menu.key"
          :path="menu.path"
          :header-inset-level="0.1"
        >
          <q-expansion-item
            v-for="submenu in menu.children"
            clickable
            v-ripple
            expand-separator
            hide-expand-icon
            active-class="my-menu-link"
            :label="submenu.label"
            :to="`/${submenu.path}`"
            :separator="submenu.separator"
            :header-inset-level="0.6"
          >
            {{ submenu.label }}
          </q-expansion-item>
        </q-expansion-item>
      </q-list>
    </q-drawer>
  </div>
</template>

<script>
import { ref } from "vue";
import data from "../server/utils/modules/data/menu.json";

export default defineNuxtComponent({
  setup() {
    const leftDrawerOpen = ref(false);
    const menu = ref(data);

    return {
      menu,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>

<style scoped>
a {
  text-decoration: none;
}
.my-menu-link {
  color: white;
  background-color: #7d8dcd;
}
</style>
