<script setup lang="ts">
const taskStore = useTaskStore();
const toast = useToast();

const uid = "10001";

const { data, status } = await useFetch(`/api/task/${uid}`, {
  key: uid,
  method: "GET",
});

if (data.value?.status === 200) {
  taskStore.updateTasks(data.value.data);
} else {
  toast.add({
    severity: "error",
    summary: "Info",
    detail: `Error fetch tasks : ${data.value?.message}`,
    life: 3000,
  });
}
</script>

<template>
  <div class="w-full pt-8">
    <div v-if="status !== 'pending'">
      <GanttBar />
      <ToDo class="mt-8 h-96 w-72 flex-none" />
    </div>
    <div v-else class="flex flex-col items-center gap-2">
      <Skeleton class="mb-2" />
      <Skeleton width="10rem" class="mb-2" />
      <Skeleton width="5rem" class="mb-2" />
      <Skeleton height="2rem" class="mb-2" />
      <Skeleton width="10rem" height="4rem" />
    </div>
  </div>
</template>
