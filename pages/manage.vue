<script lang="ts" setup>
import dayjs from "dayjs";

import { useToast } from "@/components/ui/toast/use-toast";

const taskStore = useTaskStore();
const { tasks } = storeToRefs(taskStore);

const currentTask: Ref<TaskItem> = ref(tasks.value[0] ?? []);

const defaultBackgroundColors: Ref<string[]> = ref([
  "#f8fafc",
  "#f1f5f9",
  "#e2e8f0",
  "#cbd5e1",
  "#94a3b8",
]);
const taskBackgroundColors: Ref<Record<string, string[]>> = ref({
  Red: ["#fef2f2", "#fee2e2", "#fecaca", "#fca5a5", "#f87171"],
  Orange: ["#fff7ed", "#ffedd5", "#fed7aa", "#fdba74", "#fb923c"],
  Yellow: ["#fefce8", "#fef9c3", "#fef08a", "#fde047", "#facc15"],
  Green: ["#f0fdf4", "#dcfce7", "#bbf7d0", "#86efac", "#4ade80"],
  Blue: ["#eff6ff", "#dbeafe", "#bfdbfe", "#93c5fd", "#60a5fa"],
});

const scheduleBackgroundColors: Ref<Record<string, string>[]> = ref([
  { bg: "#fb923c", text: "#ffff" },
  { bg: "#d6d3d1", text: "#000" },
  { bg: "#f87171", text: "#ffff" },
  { bg: "#60a5fa", text: "#ffff" },
  { bg: "#fca5a5", text: "#000" },
  { bg: "#86efac", text: "#000" },
  { bg: "#93c5fd", text: "#ffff" },
  { bg: "#4ade80", text: "#ffff" },
  { bg: "#38bdf8", text: "#ffff" },
]);

const newTaskItem = ref({
  name: "",
  color: "",
});

const dateRange = ref({
  start: dayjs().format("YYYY-MM-DD"),
  end: dayjs().add(20, "day").format("YYYY-MM-DD"),
});

function onUpdateDateRange(range: { start: string | undefined; end: string | undefined }) {
  let start = range.start;
  if (start === undefined) {
    start = dayjs().format("YYYY-MM-DD");
  }
  let end = range.end;
  if (end === undefined) {
    end = dayjs().add(20, "day").format("YYYY-MM-DD");
  }

  dateRange.value = {
    start,
    end,
  };
}

const newScheduleItem = ref({
  name: "",
  desc: "",
  cycle: 1,
  backgroundColor: scheduleBackgroundColors.value[0].bg,
  textColor: scheduleBackgroundColors.value[0].text,
});

const { toast } = useToast();

const createPopoverOpen = ref(false);
const createDialogOpen = ref(false);
const isCreating = ref(false);

async function onClickCreateTask() {
  isCreating.value = true;
  if (newTaskItem.value.name === "") {
    toast({
      title: "任务名称不能为空",
      description: "请输入任务名称",
      variant: "destructive",
    });
    return;
  }
  const result = await taskStore.createTask(newTaskItem.value);
  if (typeof result === "string") {
    toast({
      title: "任务创建失败",
      description: result,
      variant: "destructive",
    });
  } else {
    newTaskItem.value.name = "";
    newTaskItem.value.color = "";
    currentTask.value = result;
    toast({
      title: `🎉任务创建成功：${newTaskItem.value.name}`,
      description: "又有了新的目标！加油~",
    });
    createPopoverOpen.value = false;
  }
  isCreating.value = false;
}

async function onClickCreateSchedule() {
  isCreating.value = true;
  if (newScheduleItem.value.name === "") {
    toast({
      title: "🙅‍♂️日程名称不能为空",
      description: "请输入日程名称",
      variant: "destructive",
    });

    isCreating.value = false;
    return;
  }
  const result = await taskStore.createSchedule({
    ...newScheduleItem.value,
    tid: currentTask.value.tid,
    days: [dateRange.value.start, dateRange.value.end],
  });
  if (typeof result === "string") {
    toast({
      title: "日程创建失败",
      description: result,
      variant: "destructive",
    });
  } else {
    toast({
      title: `🎉日程创建成功：${newScheduleItem.value.name}`,
    });
    newScheduleItem.value.name = "";
    newScheduleItem.value.desc = "";
    newScheduleItem.value.cycle = 1;
    newScheduleItem.value.backgroundColor = "";
    newScheduleItem.value.textColor = "";
    createDialogOpen.value = false;
  }
  isCreating.value = false;
}
</script>

<template>
  <div class="flex h-[500px] gap-4">
    <div class="relative h-full w-64 rounded-md border p-2">
      <ScrollArea class="h-[450px] w-full">
        <template v-for="task in tasks" :key="task.tid">
          <div
            class="group flex h-10 w-full cursor-pointer items-center justify-between rounded-md px-2 hover:bg-secondary"
            :class="{ 'bg-secondary': currentTask.tid === task.tid }"
            @click="currentTask = task"
          >
            <span class="font-bold">
              {{ task.name }}
            </span>
            <Button variant="ghost" class="hidden group-hover:block">
              <LucideTrash2 class="h-4 w-4" color="red" />
            </Button>
          </div>
        </template>
      </ScrollArea>
      <Popover v-model:open="createPopoverOpen">
        <PopoverTrigger as-child>
          <Button variant="ghost" class="absolute bottom-2 left-1/2 -translate-x-1/2">
            <LucidePlus class="h-6 w-6" color="green" />
            添加任务
          </Button>
        </PopoverTrigger>
        <PopoverContent class="flex w-fit flex-col gap-3">
          <h4 class="text-lg font-bold leading-none">新建任务</h4>
          <div class="inline-flex items-center justify-between gap-2 text-nowrap">
            <Label for="name">名称</Label>
            <Input id="name" v-model="newTaskItem.name" type="text" class="h-8 w-56" />
          </div>
          <div class="inline-flex items-center justify-between gap-2 text-nowrap">
            <Label for="color">背景色</Label>
            <div class="inline-flex items-center gap-2">
              <p
                :style="{
                  backgroundColor: newTaskItem.color,
                }"
                class="col-span-2 h-8 w-full rounded-md p-2 text-sm"
              >
                {{ newTaskItem.name.length > 0 ? newTaskItem.name : "示例文本" }}
              </p>
              <Button variant="ghost" size="xs" @click="newTaskItem.color = ''">
                <LucideX class="h-4 w-4" color="red" />
              </Button>
            </div>
          </div>
          <Collapsible class="w-full space-y-2">
            <div class="flex items-center justify-between space-x-4 px-4">
              <h4 class="text-sm font-semibold">背景预设</h4>
              <CollapsibleTrigger as-child>
                <Button variant="ghost" size="sm" class="w-9 p-0">
                  <LucideChevronsUpDown class="h-4 w-4" />
                </Button>
              </CollapsibleTrigger>
            </div>
            <div
              class="w-68 inline-flex items-center justify-between gap-2 rounded-md border px-4 py-3 font-mono text-sm"
            >
              <span class="w-16">Slate</span>
              <p
                v-for="color in defaultBackgroundColors"
                :key="color"
                class="h-8 w-8 cursor-pointer rounded-md border"
                :style="{ backgroundColor: color }"
                :title="color"
                @click="newTaskItem.color = color"
              />
            </div>
            <CollapsibleContent class="space-y-2">
              <div class="flex flex-col gap-1">
                <div
                  v-for="colorName in Object.keys(taskBackgroundColors)"
                  :key="colorName"
                  class="inline-flex items-center gap-2 rounded-md border px-4 py-3 font-mono text-sm"
                >
                  <span class="w-16">{{ colorName }}</span>
                  <p
                    v-for="color in taskBackgroundColors[colorName]"
                    :key="color"
                    class="h-8 w-8 cursor-pointer rounded-md border"
                    :style="{ backgroundColor: color }"
                    :title="color"
                    @click="newTaskItem.color = color"
                  />
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
          <div class="w-full text-right">
            <Button
              type="button"
              variant="default"
              :disabled="isCreating"
              class="w-24"
              @click="onClickCreateTask()"
            >
              <LucideLoaderCircle v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
              创建
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
    <ScrollArea class="h-full w-full">
      <div class="flex flex-wrap gap-2">
        <Card
          v-for="schedule in currentTask.schedule"
          :key="schedule.id"
          class="group h-40 w-60 p-3"
        >
          <CardHeader class="p-0">
            <div class="inline-flex h-8 items-center justify-between">
              <CardTitle>{{ schedule.name }}</CardTitle>
              <Button variant="ghost" class="hidden group-hover:block">
                <LucideTrash2 class="h-4 w-4" color="red" />
              </Button>
            </div>
            <CardDescription>
              {{ schedule.desc.length > 0 ? schedule.desc : "暂无" }}
            </CardDescription>
          </CardHeader>
          <CardContent class="flex flex-col gap-1 px-0 py-2">
            <span>{{ schedule.days[0] }} 至 {{ schedule.days[schedule.days.length - 1] }}</span>
            <div class="inline-flex items-center justify-between">
              <div class="inline-flex items-center justify-start gap-2">
                周期/天：{{ schedule.cycle }}
              </div>
              <div class="inline-flex items-center justify-start gap-2">
                配色：
                <p
                  class="rounded-md bg-red-200 p-1 text-sm"
                  :style="{
                    backgroundColor: schedule.backgroundColor,
                    color: schedule.textColor,
                  }"
                >
                  {{ schedule.name.slice(0, 2) }}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Dialog v-model:open="createDialogOpen">
          <DialogTrigger as-child>
            <Button variant="ghost" class="h-40 w-60 cursor-pointer rounded-lg border p-3 shadow">
              <LucidePlus class="h-6 w-6" color="green" />
              <span class="text-lg font-bold">添加计划</span>
            </Button>
          </DialogTrigger>
          <DialogContent class="w-[400px]">
            <DialogHeader>
              <DialogTitle>添加任务计划</DialogTitle>
            </DialogHeader>
            <div class="flex flex-col gap-4">
              <div class="inline-flex items-center justify-between gap-4 text-nowrap">
                <Label for="s_name" class="text-right">名称</Label>
                <Input id="s_name" v-model="newScheduleItem.name" class="w-72" />
              </div>
              <div class="inline-flex items-start justify-between gap-4 text-nowrap">
                <Label for="s_name" class="text-right">描述</Label>
                <Textarea placeholder="Type your message here." class="w-72" />
              </div>
              <div class="inline-flex items-center justify-between gap-4 text-nowrap">
                <Label for="username" class="text-right">时间</Label>
                <DateRangePicker :date-range="dateRange" @update:date-range="onUpdateDateRange" />
              </div>
              <div class="inline-flex items-center justify-between gap-4 text-nowrap">
                <Label for="username" class="text-right">周期/天</Label>
                <NumberField
                  id="age"
                  v-model="newScheduleItem.cycle"
                  :default-value="1"
                  :min="1"
                  locale="zh-CN"
                >
                  <NumberFieldContent>
                    <NumberFieldDecrement />
                    <NumberFieldInput />
                    <NumberFieldIncrement />
                  </NumberFieldContent>
                </NumberField>
              </div>
              <div class="inline-flex items-start gap-4 text-nowrap">
                <Label for="username" class="text-right">配色</Label>
                <div class="flex flex-wrap gap-2">
                  <p
                    v-for="item in scheduleBackgroundColors"
                    :key="`${item.bg}:${item.text}`"
                    class="h-10 cursor-pointer rounded-md border p-2 text-sm ring-primary"
                    :class="{
                      'ring-2':
                        item.bg === newScheduleItem.backgroundColor &&
                        item.text === newScheduleItem.textColor,
                    }"
                    :style="{ backgroundColor: item.bg, color: item.text }"
                    @click="
                      newScheduleItem.backgroundColor = item.bg;
                      newScheduleItem.textColor = item.text;
                    "
                  >
                    {{
                      newScheduleItem.name.length > 0 ? newScheduleItem.name.slice(0, 2) : "示例"
                    }}
                  </p>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button :disabled="isCreating" class="w-20" @click="onClickCreateSchedule">
                <LucideLoaderCircle v-if="isCreating" class="mr-2 h-4 w-4 animate-spin" />
                添加
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  </div>
</template>
