import dayjs from "dayjs";
import { defineStore } from "pinia";

export const useGanttStore = defineStore("gantt", () => {
  const dateRange = ref<string[]>([]);
  /**
   * 计算甘特图的日期范围
   *
   * @returns {string[]} 日期范围数组
   */
  const ganttDateRange: ComputedRef<string[]> = computed(() => {
    if (dateRange.value.length === 0) {
      const now = dayjs();
      const start = now.subtract(5, "days").format("YYYY-MM-DD");
      const end = now.add(25, "days").format("YYYY-MM-DD");
      return [start, end];
    } else if (
      dateRange.value.length === 1
      || (dateRange.value.length === 2 && dateRange.value[1] === null)
    ) {
      const current = dayjs(dateRange.value[0]);
      const start = current.format("YYYY-MM-DD");
      const end = current.add(30, "days").format("YYYY-MM-DD");
      return [start, end];
    } else {
      const start = dayjs(dateRange.value[0]).format("YYYY-MM-DD");
      const end = dayjs(dateRange.value[1]).format("YYYY-MM-DD");
      return [start, end];
    }
  });
  return { dateRange, ganttDateRange };
});
