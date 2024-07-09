<script setup lang="ts">
import dayjs from "dayjs";

import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();
const { tasks: sourceTasks } = storeToRefs(taskStore);

const today = dayjs();

const finishDates: Ref<string[]> = ref([]);

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

const doneTaskCount: Ref<number> = ref(0);

const todayTaskCount: Ref<number> = ref(0);

const tasks: ComputedRef<TaskItem[]> = computed(() => {
  const todayTask = {
    done: 0,
    total: 0,
  };
  const results: TaskItem[] = [];
  for (const task of sourceTasks.value) {
    const current = unref(task);
    const schedules = task.schedule.filter((item) => {
      if (item.finish) {
        item.finish.forEach((date) => {
          if (!finishDates.value.includes(`${item.id}:${date}`)) {
            finishDates.value.push(`${item.id}:${date}`);
          }
        });
      }
      const show = showTodayTask(item);
      if (show) {
        todayTask.total++;
        if (item.finish && item.finish.includes(today.format("YYYY-MM-DD"))) {
          todayTask.done++;
        }
      }
      doneTaskCount.value = todayTask.done;
      todayTaskCount.value = todayTask.total;

      return show;
    });
    if (schedules.length > 0) {
      current.schedule = schedules;
      results.push(current);
    }
  }
  return results;
});
</script>

<template>
  <Card class="w-64">
    <template #title>
      今日待办：（{{ doneTaskCount }}/{{ todayTaskCount }}）
    </template>
    <template #content>
      <ScrollPanel class="w-64">
        <div class="w-f flex flex-col gap-2">
          <template v-for="task of tasks" :key="task.tid">
            <template v-for="schedule in task.schedule" :key="schedule.id">
              <div
                class="inline-flex w-full items-center gap-2 truncate py-1"
                @click.stop="taskStore.updateTaskSchedule(schedule.id!)"
              >
                <Checkbox
                  v-model="finishDates"
                  :input-id="`${schedule.id}-${today.format('YYYY-MM-DD')}`"
                  name="finishDates"
                  :value="`${schedule.id}:${today.format('YYYY-MM-DD')}`"
                />
                <label :for="`${schedule.id}-${today.format('YYYY-MM-DD')}`">
                  <span
                    v-if="!finishDates.includes(`${schedule.id}:${today.format('YYYY-MM-DD')}}`)"
                  >
                    [{{ task.name }}] : {{ schedule.name }}
                  </span>
                  <span v-else><del>[{{ task.name }}] : {{ schedule.name }}</del></span>
                </label>
              </div>
            </template>
          </template>
        </div>
      </ScrollPanel>
    </template>
  </Card>
</template>
