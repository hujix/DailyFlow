<script lang="ts" setup>
import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const currentTaskSchedule: Ref<Schedule[]> = ref(tasks.value[0]?.schedule ?? []);

// const cycleOptions: Ref<string[]> = ref(["1", "2", "3", "4", "5", "6", "7"]);

const showCreateDialog = ref(false);

const toast = useToast();

async function deleteSchedule(schedule: Schedule) {
  await taskStore.deleteSchedule(schedule);
  if (schedule !== undefined) {
    toast.add({
      severity: "success",
      summary: `删除【${schedule.name}】成功`,
      detail: `备注：${schedule.desc}\n时间：${schedule.days[0]} - ${schedule.days[1]}`,
      life: 3000,
    });
  }
}

async function onClickDeleteTask(task: TaskItem) {
  await taskStore.deleteTask(task);
  showCreateDialog.value = false;
}
</script>

<template>
  <div>
    <Button label="任务管理" @click="showCreateDialog = true" />
    <Dialog
      v-model:visible="showCreateDialog"
      modal
      :dismissable-mask="true"
      :draggable="false"
      class="w-[50rem]"
    >
      <template #header>
        <div class="inline-flex items-center justify-center gap-2">
          <i class="pi pi-box" />
          <span class="whitespace-nowrap font-bold">任务管理</span>
        </div>
      </template>
      <div class="flex flex-row gap-3">
        <div class="flex flex-col gap-2">
          <Listbox :options="tasks" option-label="name" scroll-height="100%" class="h-96 w-64">
            <template #option="{ option }">
              <div
                class="flex w-full items-center justify-between"
                @click="currentTaskSchedule = option.schedule"
              >
                <span class="font-bold">
                  {{ option.name }}
                </span>
                <Button
                  text
                  icon="pi pi-trash"
                  size="small"
                  severity="danger"
                  @click="onClickDeleteTask(option)"
                />
              </div>
            </template>
          </Listbox>
          <CreateTask />
        </div>
        <ScrollPanel class="h-[25rem] w-[50rem] pr-3">
          <div
            v-for="schedule in currentTaskSchedule"
            :key="schedule.id"
            class="mb-3 flex w-full flex-col gap-2 rounded-md border p-3"
          >
            <div class="flex items-center justify-between">
              <span>名称：{{ schedule.name }}</span>
              <Button
                text
                icon="pi pi-trash"
                size="small"
                severity="danger"
                @click="deleteSchedule(schedule)"
              />
            </div>
            <span>描述：{{ schedule.desc }}</span>
            <span>时间：{{ schedule.days[0] }} - {{ schedule.days[1] }}</span>
            <div class="inline-flex items-center justify-start gap-2">
              周期（天）：{{ schedule.cycle }}
            </div>
            <div class="flex flex-row items-center justify-start gap-2">
              <span>背景色： <ColorPicker :model-value="schedule.backgroundColor.substring(1)" disabled /></span>
              <span>文字颜色： <ColorPicker :model-value="schedule.textColor.substring(1)" disabled /></span>
            </div>
          </div>
        </ScrollPanel>
      </div>
    </Dialog>
  </div>
</template>
