<script setup lang="ts">
// const taskStore = useTaskStore();

// const uid = "10001";

// const { data, status } = await useFetch(`/api/task/${uid}`, {
//   key: uid,
//   method: "GET",
// });

// if (data.value?.status === 200) {
//   taskStore.updateTasks(data.value.data);
// }
const user = useSupabaseUser();
</script>

<template>
  <div class="w-full">
    <!-- <div v-if="status !== 'pending'">
      <GanttBar />
      <ToDo class="mt-8 h-96 w-72 flex-none" />
    </div>
    <div v-else class="flex flex-col items-center gap-2">ss</div> -->
    <!-- <GanttBar /> -->
    {{ user }}
  </div>
</template>
