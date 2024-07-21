<script setup lang="ts">
import "vue3-gantt/dist/style.css";
import dayjs from "dayjs";
import Gantt from "vue3-gantt";

const taskStore = useTaskStore();

const defaultDateRange = ref({
  start: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
  end: dayjs().add(20, "day").format("YYYY-MM-DD"),
});

const dateRange = ref(defaultDateRange.value);

function onUpdateDateRange(range: { start: string | undefined; end: string | undefined }) {
  let start = range.start;
  if (start === undefined) {
    start = defaultDateRange.value.start;
  }
  let end = range.end;
  if (end === undefined) {
    end = defaultDateRange.value.end;
  }

  dateRange.value = {
    start,
    end,
  };
}
</script>

<template>
  <div>
    <div class="rounded-md border bg-card p-4 text-card-foreground">
      <div class="mb-4 flex items-center">
        <label>时间：</label>
        <DateRangePicker :date-range="dateRange" @update:date-range="onUpdateDateRange" />
      </div>
      <ClientOnly>
        <div class="h-64">
          <Gantt
            :data="taskStore.tasks"
            item-text="任务"
            :active-date="dayjs().format('YYYY-MM-DD')"
            date-text="时间"
            :item-height="25"
            :date-range-list="[dateRange.start, dateRange.end]"
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
