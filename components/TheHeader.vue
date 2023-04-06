<template>
  <q-header bordered class="bg-primary text-white">
    <q-toolbar>
      <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

      <q-toolbar-title> NTT DATA </q-toolbar-title>

      <NuxtLink to="/login">
        <q-btn flat round color="white" icon="account_circle" />
      </NuxtLink>
    </q-toolbar>
  </q-header>

  <q-drawer v-model="leftDrawerOpen" side="left" bordered overlay>
    <div class="" style="width: 100%">
      <q-list padding class="rounded-borders text-primary q-pa-none">
        <q-item
          clickable
          v-ripple
          :active="link === '/'"
          @click="link = '/'"
          active-class="my-menu-link"
          to="/"
        >
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>

          <q-item-section>Home</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="link === '/staffing'"
          @click="link = '/staffing'"
          active-class="my-menu-link"
          to="/staffing"
        >
          <q-item-section avatar>
            <q-icon name="groups" />
          </q-item-section>

          <q-item-section>Miembros Staffing</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="link === 'outbox'"
          @click="link = 'outbox'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>List 2</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="link === 'trash'"
          @click="link = 'trash'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>List 3</q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item
          clickable
          v-ripple
          :active="link === 'settings'"
          @click="link = 'settings'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>List 4</q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          :active="link === 'help'"
          @click="link = 'help'"
          active-class="my-menu-link"
        >
          <q-item-section avatar>
            <q-icon name="person" />
          </q-item-section>

          <q-item-section>List 5</q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-drawer>
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      link: ref("inbox"),
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
};
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
