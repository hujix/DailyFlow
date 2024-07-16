<script setup lang="ts">
import "vue3-gantt/dist/style.css";
import dayjs from "dayjs";
import Gantt from "vue3-gantt";

import { useGanttStore } from "@/stores/gantt";
import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();

const ganttStore = useGanttStore();
const { ganttDateRange } = storeToRefs(ganttStore);
</script>

<template>
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
      <Gantt
        class="!h-fit"
        :data="taskStore.tasks"
        item-text="任务"
        :active-date="dayjs().format('YYYY-MM-DD')"
        date-text="时间"
        item-height="25"
        :date-range-list="ganttDateRange"
      />
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
</template>
