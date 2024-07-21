<script lang="ts" setup>
const user = useSupabaseUser();
const taskStore = useTaskStore();

const { data } = await useFetch(`/api/task/${user.value.id}`, {
  key: user.value.id,
  method: "GET",
});

if (data.value?.status === 200) {
  taskStore.updateTasks(data.value.data as TaskItem[]);
}
</script>

<template>
  <div class="flex bg-background">
    <aside class="h-screen w-64 border-r bg-secondary">
      <Sidebar />
    </aside>
    <div class="container flex h-screen flex-col">
      <header class="my-2 h-10 w-full">
        <Headbar />
      </header>
      <main class="h-full overflow-y-auto">
        <slot />
      </main>
    </div>
    <Toaster />
  </div>
</template>
