<script setup lang="ts">
import "vue3-gantt/dist/style.css";
import dayjs from "dayjs";
import Gantt from "vue3-gantt";

import { useGanttStore } from "@/stores/gantt";
import { useTaskStore } from "@/stores/task";

const ganttStore = useGanttStore();
const { datePickerRange } = storeToRefs(ganttStore);
const taskStore = useTaskStore();

const user = useSupabaseUser();

const { data } = await useFetch(`/api/task/${user.value.id}`, {
  key: user.value.id,
  method: "GET",
});

if (data.value?.status === 200) {
  taskStore.updateTasks(data.value.data);
}
</script>

<template>
  <div>
    <div class="rounded-md border bg-card p-4 text-card-foreground">
      <div class="mb-4 flex items-center">
        <label>时间：</label>
        <DateRangePicker />
        <Button class="ml-2">
          <LucidePlus class="mr-2 h-4 w-4" />
          新建
        </Button>
        <!-- <CreateTaskModel /> -->
      </div>
      <ClientOnly>
        <div class="h-64">
          <Gantt
            :data="taskStore.tasks"
            item-text="任务"
            :active-date="dayjs().format('YYYY-MM-DD')"
            date-text="时间"
            :item-height="25"
            :date-range-list="[datePickerRange.start, datePickerRange.end]"
          />
        </div>
        <template #fallback>
          <div class="flex flex-col space-y-3">
            <Skeleton class="h-[75px] w-full rounded-md" />
            <div class="space-y-2">
              <Skeleton class="h-4 w-full" />
              <Skeleton class="h-4 w-[90%]" />
              <Skeleton class="h-4 w-[95%]" />
            </div>
          </div>
        </template>
      </ClientOnly>
    </div>
    <ToDo />
  </div>
</template>
