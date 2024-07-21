import dayjs from "dayjs";
import { defineStore } from "pinia";
import { v4 as uuidv4 } from "uuid";

export const useTaskStore = defineStore("task", () => {
  const tasks: Ref<TaskItem[]> = ref([]);

  const updateTasks = (currentTasks: any[]) => {
    tasks.value = [];
    for (const task of currentTasks) {
      const schedules: Schedule[] = [];
      for (const schedule of task.schedule) {
        schedules.push({
          ...schedule,
          id: schedule.sid,
          backgroundColor: schedule.background_color,
          cycle: String(schedule.cycle),
          textColor: schedule.text_olor,
          days: [schedule.start_time, schedule.end_time],
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

  const createTask = async (task: { name: string; color: string }): Promise<string | TaskItem> => {
    const newTask = {
      ...task,
      tid: uuidv4(),
      type: "normal",
      schedule: [],
    };
    const result = await $fetch("/api/task", {
      method: "POST",
      body: newTask,
    });
    if (result.status === 200) {
      tasks.value.push(newTask);
      return newTask;
    }

    return result.message;
  };

  const createSchedule = async (schedule: {
    tid: string;
    name: string;
    desc: string;
    cycle: number;
    backgroundColor: string;
    textColor: string;
    days: string[];
  }): Promise<string | Schedule> => {
    const sid = uuidv4();
    const newSchedule = {
      ...schedule,
      sid,
    };
    const result = await $fetch("/api/task/schedule", {
      method: "POST",
      body: newSchedule,
    });
    if (result.status === 200) {
      const result = {
        id: sid,
        name: schedule.name,
        desc: schedule.desc,
        cycle: schedule.cycle,
        backgroundColor: schedule.backgroundColor,
        textColor: schedule.textColor,
        days: schedule.days,
        finish: [],
      };
      tasks.value.forEach((task) => {
        if (task.tid === schedule.tid)
          task.schedule.push(result);
      });

      return result;
    }

    return result.message;
  };

  const deleteSchedule = async (schedule: Schedule): Promise<undefined> => {
    await $fetch("/api/task", {
      method: "delete",
      body: { id: schedule.id, type: "schedule" },
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

  const updateTaskSchedule = async (sid: string): Promise<boolean | string | undefined> => {
    const updateItem: { update: boolean; finish: string[] } = {
      update: false,
      finish: [],
    };
    const todayDate: string = dayjs().format("YYYY-MM-DD");
    const updatedTask: TaskItem[] = [];
    tasks.value.forEach((task) => {
      const schedules: Schedule[] = [];
      task.schedule.forEach((schedule) => {
        if (schedule.id === sid) {
          if (schedule.finish === null) {
            schedule.finish = [];
          }
          if (schedule.finish.includes(todayDate)) {
            schedule.finish = schedule.finish.filter((date) => date !== todayDate);
          } else {
            schedule.finish.push(todayDate);
          }
          updateItem.update = true;
          updateItem.finish = schedule.finish;
        }
        schedules.push(schedule);
      });
      updatedTask.push({
        ...task,
        schedule: schedules,
      });
    });
    tasks.value = updatedTask;

    if (updateItem.update) {
      try {
        const fetchResult = await $fetch("/api/task", {
          method: "put",
          body: { sid, finish: updateItem.finish },
        });
        if (fetchResult.status === 200) {
          return true;
        } else {
          return fetchResult.message;
        }
      } catch (error) {
        return String(error);
      }
    }
    return undefined;
  };

  return {
    tasks,
    createTask,
    createSchedule,
    updateTasks,
    deleteTask,
    deleteSchedule,
    updateTaskSchedule,
  };
});
