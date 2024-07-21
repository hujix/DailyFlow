<script lang="ts" setup>
import { useToast } from "@/components/ui/toast/use-toast";

const user = useSupabaseUser();
const taskStore = useTaskStore();

const { toast } = useToast();

const { data } = await useFetch("/api/task", {
  key: user.value.id,
  method: "GET",
});

if (data.value === null || data.value.status !== 200) {
  toast({
    title: "获取任务失败",
    description: `获取任务时发生异常，请检查网络连接`,
  });
} else {
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
