<script setup lang="ts">
import { CalendarDate, type DateValue, isEqualMonth } from "@internationalized/date";
import dayjs from "dayjs";
import { RangeCalendarRoot, useDateFormatter } from "radix-vue";
import type { DateRange } from "radix-vue";
import { type Grid, createMonth, toDate } from "radix-vue/date";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const props = defineProps({
  dateRange: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:dateRange"]);

const locale = ref("zh-CN");
const formatter = useDateFormatter(locale.value);

const currentDateRange: Ref<DateRange> = ref({
  start: new CalendarDate(
    dayjs(props.dateRange.start).year(),
    dayjs(props.dateRange.start).month() + 1,
    dayjs(props.dateRange.start).date()
  ),
  end: new CalendarDate(
    dayjs(props.dateRange.end).year(),
    dayjs(props.dateRange.end).month() + 1,
    dayjs(props.dateRange.end).date()
  ),
}) as Ref<DateRange>;

watch(currentDateRange, (newValue) => {
  emit("update:dateRange", {
    start: newValue.start?.toString(),
    end: newValue.end?.toString(),
  });
});

const placeholder = ref(currentDateRange.value.start) as Ref<DateValue>;
const secondMonthPlaceholder = ref(currentDateRange.value.end) as Ref<DateValue>;

const firstMonth = ref(
  createMonth({
    dateObj: placeholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  })
) as Ref<Grid<DateValue>>;
const secondMonth = ref(
  createMonth({
    dateObj: secondMonthPlaceholder.value,
    locale: locale.value,
    fixedWeeks: true,
    weekStartsOn: 0,
  })
) as Ref<Grid<DateValue>>;

function updateMonth(reference: "first" | "second", months: number) {
  if (reference === "first") {
    placeholder.value = placeholder.value.add({ months });
  } else {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months,
    });
  }
}

watch(placeholder, (_placeholder) => {
  firstMonth.value = createMonth({
    dateObj: _placeholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  });
  if (isEqualMonth(secondMonthPlaceholder.value, _placeholder)) {
    secondMonthPlaceholder.value = secondMonthPlaceholder.value.add({
      months: 1,
    });
  }
});

watch(secondMonthPlaceholder, (_secondMonthPlaceholder) => {
  secondMonth.value = createMonth({
    dateObj: _secondMonthPlaceholder,
    weekStartsOn: 0,
    fixedWeeks: false,
    locale: locale.value,
  });
  if (isEqualMonth(_secondMonthPlaceholder, placeholder.value))
    placeholder.value = placeholder.value.subtract({ months: 1 });
});
</script>

<template>
  <Popover>
    <PopoverTrigger as-child>
      <Button
        variant="outline"
        :class="
          cn(
            'w-[280px] justify-start text-left font-normal',
            !currentDateRange && 'text-muted-foreground'
          )
        "
      >
        <LucideCalendarDays class="mr-2 h-4 w-4" />
        <template v-if="currentDateRange.start">
          <template v-if="currentDateRange.end">
            {{
              formatter.custom(toDate(currentDateRange.start), {
                dateStyle: "medium",
              })
            }}
            -
            {{
              formatter.custom(toDate(currentDateRange.end), {
                dateStyle: "medium",
              })
            }}
          </template>

          <template v-else>
            {{
              formatter.custom(toDate(currentDateRange.start), {
                dateStyle: "medium",
              })
            }}
          </template>
        </template>
        <template v-else>Pick a date</template>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-auto p-0">
      <RangeCalendarRoot
        v-slot="{ weekDays }"
        v-model="currentDateRange"
        v-model:placeholder="placeholder"
        class="p-3"
      >
        <div class="mt-4 flex flex-col gap-y-4 sm:flex-row sm:gap-x-4 sm:gap-y-0">
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                  )
                "
                @click="updateMonth('first', -1)"
              >
                <LucideChevronLeft class="h-4 w-4" />
              </button>
              <div :class="cn('text-sm font-medium')">
                {{ formatter.fullMonthAndYear(toDate(firstMonth.value)) }}
              </div>
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                  )
                "
                @click="updateMonth('first', 1)"
              >
                <LucideChevronRight class="h-4 w-4" />
              </button>
            </div>
            <RangeCalendarGrid>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-full">
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                <RangeCalendarGridRow
                  v-for="(weekDates, index) in firstMonth.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <RangeCalendarCellTrigger :day="weekDate" :month="firstMonth.value" />
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
          <div class="flex flex-col gap-4">
            <div class="flex items-center justify-between">
              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                  )
                "
                @click="updateMonth('second', -1)"
              >
                <LucideChevronLeft class="h-4 w-4" />
              </button>
              <div :class="cn('text-sm font-medium')">
                {{ formatter.fullMonthAndYear(toDate(secondMonth.value)) }}
              </div>

              <button
                :class="
                  cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                  )
                "
                @click="updateMonth('second', 1)"
              >
                <LucideChevronRight class="h-4 w-4" />
              </button>
            </div>
            <RangeCalendarGrid>
              <RangeCalendarGridHead>
                <RangeCalendarGridRow>
                  <RangeCalendarHeadCell v-for="day in weekDays" :key="day" class="w-full">
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody>
                <RangeCalendarGridRow
                  v-for="(weekDates, index) in secondMonth.rows"
                  :key="`weekDate-${index}`"
                  class="mt-2 w-full"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                  >
                    <RangeCalendarCellTrigger :day="weekDate" :month="secondMonth.value" />
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
        </div>
      </RangeCalendarRoot>
    </PopoverContent>
  </Popover>
</template>
