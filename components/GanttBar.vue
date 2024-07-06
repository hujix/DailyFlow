<script setup lang="ts">
import dayjs from "dayjs";
import Gantt from "vue3-gantt";

import "vue3-gantt/dist/style.css";
import { useGanttStore } from "@/stores/gantt";
import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();

const ganttStore = useGanttStore();
const { dateRange, ganttDateRange } = storeToRefs(ganttStore);
</script>

<template>
  <div class="mb-2 flex items-center gap-4">
    <div>
      <span>时间：</span>
      <DatePicker
        v-model="dateRange"
        class="w-60"
        selection-mode="range"
        show-button-bar
        date-format="yy-mm-dd"
        :manual-input="false"
      />
    </div>
    <CreateTaskModel />
  </div>
  <ClientOnly>
    <Gantt
      class="h-full"
      :data="taskStore.tasks"
      item-text="任务"
      :active-date="dayjs().format('YYYY-MM-DD')"
      date-text="时间"
      :item-height="25"
      :date-range-list="ganttDateRange"
    />
  </ClientOnly>
</template>
