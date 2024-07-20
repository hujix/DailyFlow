import dayjs from "dayjs";
import { defineStore } from "pinia";

export const useGanttStore = defineStore("gantt", () => {
  const datePickerRange = ref({
    start: dayjs().subtract(3, "day").format("YYYY-MM-DD"),
    end: dayjs().add(22, "day").format("YYYY-MM-DD"),
  }) as Ref<{ start: string; end: string }>;

  return { datePickerRange };
});
