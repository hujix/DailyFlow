<script setup lang="ts">
import dayjs from "dayjs";
import { ref } from "vue";

import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();
const { tasks: sourceTasks } = storeToRefs(taskStore);

const today = dayjs();

function showTodayTask(schedule: Schedule): boolean {
  const start = dayjs(schedule.days[0]);
  if (today.diff(start, "day") % schedule.cycle !== 0) {
    return false;
  }
  if (today.isAfter(start, "day") && today.isBefore(dayjs(schedule.days[1]), "day")) {
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
</script>

<template>
  <Card class="w-64">
    <template #title>今日待办：（{{ doneTaskCount }}/{{ todayTaskCount }}）</template>
    <template #content>
      <ScrollPanel class="w-64">
        <div class="w-f flex flex-col gap-2">
          <template v-for="task of tasks" :key="task.tid">
            <template v-for="schedule in task.schedule" :key="`${task.tid}-${schedule.id}`">
              <div
                class="inline-flex items-center gap-2 truncate"
                @click="taskStore.updateTaskSchedule(task.tid, schedule.id)"
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
