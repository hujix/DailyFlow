<script lang="ts" setup>
import dayjs from "dayjs";

import { useTaskStore } from "@/stores/task";

const taskStore = useTaskStore();

const visible = ref(false);
const visibleRight = ref(false);
const cycleOptions = ref(["1", "2", "3", "4", "5", "6", "7"]);

const presetsColors: Ref<{ bg: string;text: string }[]> = ref([
  { bg: "#ff6b6b", text: "#ffffff" },
  { bg: "#ff8f6b", text: "#ffffff" },
  { bg: "#ffd66b", text: "#ffffff" },
  { bg: "#6bff6b", text: "#ffffff" },
  { bg: "#6b99ff", text: "#ffffff" },
  { bg: "#6b6bff", text: "#ffffff" },
  { bg: "#ff6bff", text: "#ffffff" },
  { bg: "#ffffff", text: "#000000" },
]);

const toast = useToast();

const newTaskItem: Ref<TaskItem> = ref({
  tid: uuid(),
  type: "normal",
  color: "",
  name: "",
  schedule: [],
});

const newTaskSchedule: Ref<Schedule> = ref({
  name: "",
  desc: "",
  cycle: "1",
  finish: [],
  backgroundColor: "",
  textColor: "",
  days: [],
});

function onClickCreateSchedule() {
  newTaskItem.value.schedule.push({
    ...newTaskSchedule.value,
    days: [
      dayjs(newTaskSchedule.value.days[0]).format("YYYY-MM-DD"),
      dayjs(newTaskSchedule.value.days[1]).format("YYYY-MM-DD"),
    ],
  });
  newTaskSchedule.value = {
    name: "",
    desc: "",
    cycle: "1",
    finish: [],
    backgroundColor: "",
    textColor: "",
    days: [],
  };
  visibleRight.value = false;
}

function onClickDeleteSchedule(schedule: Schedule) {
  newTaskItem.value.schedule.forEach((item) => {
    if (item.name === schedule.name) {
      newTaskItem.value.schedule.splice(newTaskItem.value.schedule.indexOf(item), 1);
    }
  });
}
async function onClickChangePresetColor(item: { bg: string;text: string }) {
  newTaskSchedule.value.backgroundColor = item.bg;
  newTaskSchedule.value.textColor = item.text;
}

async function onClickCreateTask() {
  const result = await taskStore.createTask(newTaskItem.value);
  if (result.status === 200) {
    toast.add({
      severity: "success",
      summary: "创建成功",
      detail: "成功创建新的任务",
      life: 3000,
    });
  }
  newTaskItem.value = {
    tid: uuid(),
    type: "normal",
    color: "",
    name: "",
    schedule: [],
  };
  visible.value = false;
}
</script>

<template>
  <div>
    <Button label="新增" class="w-full" @click="visible = true" />
    <Dialog
      v-model:visible="visible"
      modal
      header="新建任务"
      :style="{ width: '25rem' }"
      :dismissable-mask="true"
      :draggable="false"
    >
      <div class="mb-3 flex w-full flex-col gap-2 rounded-md p-2">
        <div class="flex flex-col gap-2">
          <label for="name">任务名称</label>
          <InputText id="name" v-model="newTaskItem.name" />
        </div>
        <Button label="新增详细任务" class="w-full" @click="visibleRight = true" />
        <ScrollPanel>
          <div
            v-for="schedule in newTaskItem.schedule"
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
                @click="onClickDeleteSchedule(schedule)"
              />
            </div>
            <span>描述：{{ schedule.desc }}</span>
            <span>时间：{{ schedule.days[0] }} - {{ schedule.days[1] }}</span>
            <div class="inline-flex items-center justify-start gap-2">
              周期（天）：{{ schedule.cycle }}
            </div>
            <div class="flex flex-row items-center justify-start gap-2">
              <span>背景色： <ColorPicker v-model="schedule.backgroundColor" /></span>
              <span>文字颜色： <ColorPicker v-model="schedule.textColor" /></span>
            </div>
          </div>
        </ScrollPanel>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <Button type="button" label="取消" severity="secondary" @click="visible = false" />
          <Button type="button" label="创建" @click="onClickCreateTask()" />
        </div>
      </template>
    </Dialog>

    <Drawer v-model:visible="visibleRight" header="任务详情" position="right" class="w-[30rem]">
      <div class="mb-3 flex w-full flex-col gap-2 rounded-md p-3">
        <div class="flex items-center">
          名称：<InputText v-model="newTaskSchedule.name" class="w-60" type="text" />
        </div>
        <div class="flex flex-row">
          描述：<Textarea v-model="newTaskSchedule.desc" rows="5" cols="38" />
        </div>
        <div class="inline-flex items-center justify-start gap-2">
          时间：<DatePicker
            v-model="newTaskSchedule.days"
            date-format="yy-mm-dd"
            :manual-input="false"
            selection-mode="range"
            class="w-60"
          />
        </div>
        <div class="inline-flex items-center justify-start gap-2">
          周期（天）：<SelectButton
            v-model="newTaskSchedule.cycle"
            :options="cycleOptions"
            aria-labelledby="basic"
          />
        </div>
        <div>
          <span>配色：</span>
          <div class="border p-3 rounded-md">
            <div class="flex flex-col rounded-md">
              <div
                :style="{
                  backgroundColor: newTaskSchedule.backgroundColor,
                  color: newTaskSchedule.textColor,
                }"
                class="h-10 rounded-md flex items-center justify-center text-2xl"
              >
                {{ newTaskSchedule.name.length === 0 ? "示例文本" : newTaskSchedule.name }}
              </div>
            </div>
            <div class="grid grid-cols-4 gap-2 mt-2 border-2 p-2 rounded-md">
              <div v-for="item in presetsColors" :key="`${item.bg}:${item.text}`">
                <Button
                  :style="{ backgroundColor: item.bg, color: item.text }"
                  class="h-10 w-20 rounded-md text-xl flex items-center justify-center border-none"
                  @click="onClickChangePresetColor(item)"
                >
                  文字
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div class="mt-10 flex flex-row items-center justify-around">
          <Button label="取消" severity="secondary" @click="visibleRight = false" />
          <Button label="确认" severity="success" @click="onClickCreateSchedule()" />
        </div>
      </div>
    </Drawer>
  </div>
</template>
