<script setup lang="ts">
import dayjs from "dayjs";

import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();
const { tasks: sourceTasks } = storeToRefs(taskStore);

const today = dayjs();

function showTodayTask(schedule: Schedule): boolean {
  const start = dayjs(schedule.days[0]);
  if (today.diff(start, "day") % Number(schedule.cycle) !== 0) {
    return false;
  }
  const end = dayjs(schedule.days[1]);
  if (today.isSame(start, "day") || today.isSame(end, "day")) {
    return true;
  }
  if (today.isAfter(start, "day") && today.isBefore(end, "day")) {
    return true;
  }
  return false;
}

const tasks: ComputedRef<TaskItem[]> = computed(() => {
  const results: TaskItem[] = [];
  for (const task of sourceTasks.value) {
    const current = unref(task);
    const schedules = task.schedule.filter(item => {
      return showTodayTask(item);
    });
    if (schedules.length > 0) {
      current.schedule = schedules;
      results.push(current);
    }
  }
  return results;
});

const doneTaskCount: ComputedRef<number> = computed(() => {
  let count: number = 0;
  for (const task of tasks.value) {
    for (const schedule of task.schedule) {
      if (schedule.finish) {
        count++;
      }
    }
  }
  return count;
});

const todayTaskCount: ComputedRef<number> = computed(() => {
  let count: number = 0;
  for (const task of tasks.value) {
    count += task.schedule.length;
  }
  return count;
});
async function updateTaskSchedule(id: number) {
  await taskStore.updateTaskSchedule(id);
}
</script>

<template>
  <Card class="w-64">
    <template #title> 今日待办：（{{ doneTaskCount }}/{{ todayTaskCount }}） </template>
    <template #content>
      <ScrollPanel class="w-64">
        <div class="w-f flex flex-col gap-2">
          <template v-for="task of tasks" :key="task.tid">
            <template v-for="schedule in task.schedule" :key="`${task.tid}-${schedule.id}`">
              <div
                class="inline-flex w-full items-center gap-2 truncate py-1"
                @click="updateTaskSchedule(schedule.id!)"
              >
                <Checkbox v-model="schedule.finish" :binary="true" />
                <label> [{{ task.name }}] : {{ schedule.name }} </label>
              </div>
            </template>
          </template>
        </div>
      </ScrollPanel>
    </template>
  </Card>
</template>
