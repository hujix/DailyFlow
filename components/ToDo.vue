<script setup lang="ts">
import dayjs from "dayjs";

import { useToast } from "@/components/ui/toast/use-toast";
import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();
const { tasks: sourceTasks } = storeToRefs(taskStore);

const { toast } = useToast();

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
      if (item.finish !== null) {
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

async function onClickTaskCheckbox(sid: string) {
  const label = `${sid}:${today.format("YYYY-MM-DD")}`;
  let finish = false;
  if (finishDates.value.includes(label)) {
    finishDates.value = finishDates.value.filter((item) => item !== label);
  } else {
    finish = true;
    finishDates.value.push(label);
  }
  const updateResult = await taskStore.updateTaskSchedule(sid);
  if (typeof updateResult === "boolean" && updateResult) {
    toast({
      title: "🎉更新任务成功",
      description: finish ? "又完成一项！杠八的！" : "再接再厉！",
    });
  } else if (typeof updateResult === "string") {
    toast({
      title: "😭更新任务失败",
      description: updateResult,
    });
  }
}
</script>

<template>
  <div class="mt-4 h-full w-64 rounded-md border p-2">
    <h3 class="font-bold">今日待办：（{{ doneTaskCount }}/{{ todayTaskCount }}）</h3>
    <ScrollArea class="mt-2 w-full">
      <template v-for="task of tasks" :key="task.tid">
        <template v-for="schedule in task.schedule" :key="schedule.id">
          <Button
            variant="ghost"
            class="inline-flex w-full items-center justify-between truncate"
            :class="{
              'opacity-55': finishDates.includes(`${schedule.id}:${today.format('YYYY-MM-DD')}`),
            }"
            @click="onClickTaskCheckbox(schedule.id)"
          >
            <label :for="`${schedule.id}-${today.format('YYYY-MM-DD')}`" class="cursor-pointer">
              <span v-if="!finishDates.includes(`${schedule.id}:${today.format('YYYY-MM-DD')}`)">
                [{{ task.name }}] : {{ schedule.name }}
              </span>
              <span v-else>
                <del>[{{ task.name }}] : {{ schedule.name }}</del>
              </span>
            </label>
            <Checkbox
              :id="`${schedule.id}-${today.format('YYYY-MM-DD')}`"
              :checked="finishDates.includes(`${schedule.id}:${today.format('YYYY-MM-DD')}`)"
              name="finishDates"
              class="rounded"
              :value="`${schedule.id}:${today.format('YYYY-MM-DD')}`"
            />
          </Button>
        </template>
      </template>
    </ScrollArea>
    <Toaster />
  </div>
</template>
