<template>
  <q-card style="width: 800px; max-width: 60vw; max-height: auto">
    <div class="q-pa-xl column items-center justify-center">
      <q-avatar size="150px">
        <img
          src="https://cdn.pixabay.com/photo/2017/11/10/05/48/user-2935527_1280.png"
        />
      </q-avatar>

      <div class="q-mt-md">
        <!-- <div class="text-h2">{{ props.name }}</div> -->
        <div class="text-h2">{{ membersId }}</div>
      </div>
    </div>
  </q-card>
</template>

<script>
import { defineProps, reactive } from "vue";

export default defineNuxtComponent({
  props: ["membersId"],
  setup(props) {
    const id = ref(props.membersId);
    console.log(id);
    return { id };
  },

  async asyncData() {
    //     // const id = props.membersId;
    //     // const users = await $fetch(`/api/staffing/members/${id}`);
    //     // console.log(users);
    //     // return { users };
    //     // console.log("qwe", id.value);
    //     // return {};
    console.log("qwe", idMember);
  },
});
</script>
