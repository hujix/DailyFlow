import { defineStore } from "pinia";

export const useTaskStore = defineStore("task", () => {
  const tasks: Ref<TaskItem[]> = ref([]);

  const updateTasks = (currentTasks: any[]) => {
    tasks.value = [];
    for (const task of currentTasks) {
      const schedules = [];
      for (const s of task.schedule) {
        schedules.push({
          id: s.id,
          name: s.name,
          desc: s.desc,
          backgroundColor: s.background_color,
          finish: s.finish,
          cycle: String(s.cycle),
          textColor: s.text_color,
          days: [s.start_time, s.end_time],
        });
      }
      tasks.value.push({
        tid: task.tid,
        type: "normal",
        color: "",
        name: task.name,
        schedule: schedules,
      });
    }
  };

  const createTask = async (task: TaskItem) => {
    const newSchedules: Schedule[] = [];
    for (const sc of task.schedule) {
      newSchedules.push({
        ...sc,
        id: Number((Math.random() * 1000).toFixed(0)),
        textColor: `#${sc.textColor}`,
        backgroundColor: `#${sc.backgroundColor}`,
      });
    }
    const newTask = { ...task };
    newTask.schedule = newSchedules;
    tasks.value.push(newTask);

    const result = await $fetch("/api/task", {
      method: "POST",
      body: task,
    });
    return result;
  };

  const deleteSchedule = async (schedule: Schedule): Promise<undefined> => {
    await $fetch("/api/task", {
      method: "delete",
      body: { id: schedule.id!, type: "schedule" },
    });

    tasks.value.forEach((task) => {
      task.schedule = task.schedule.filter((s) => s.id !== schedule.id);
    });
  };

  const deleteTask = async (task: TaskItem): Promise<undefined> => {
    await $fetch("/api/task", {
      method: "delete",
      body: { id: task.tid, type: "task" },
    });

    tasks.value = tasks.value.filter((t) => t.tid !== task.tid);
  };

  const updateTaskSchedule = async (id: number) => {
    let targetFinishStatus: boolean = false;
    const updatedTask: TaskItem[] = [];
    tasks.value.forEach((task) => {
      const schedules: Schedule[] = [];
      task.schedule.forEach((schedule) => {
        if (schedule.id === id) {
          targetFinishStatus = !schedule.finish;
          schedule.finish = !schedule.finish;
        }
        schedules.push(schedule);
      });
      updatedTask.push({
        ...task,
        schedule: schedules,
      });
    });
    tasks.value = updatedTask;
    await $fetch("/api/task", {
      method: "put",
      body: { id, finish: targetFinishStatus },
    });
  };

  return { tasks, createTask, updateTasks, deleteTask, deleteSchedule, updateTaskSchedule };
});
