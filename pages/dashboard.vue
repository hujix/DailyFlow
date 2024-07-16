<script setup lang="ts">
const taskStore = useTaskStore();

const uid = "10001";

const { data, status } = await useFetch(`/api/task/${uid}`, {
  key: uid,
  method: "GET",
});

if (data.value?.status === 200) {
  taskStore.updateTasks(data.value.data);
}
</script>

<template>
  <div v-if="status !== 'pending'">
    <GanttBar />
    <ToDo />
  </div>
</template>
