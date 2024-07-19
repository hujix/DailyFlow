import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as TaskItem;

  const supabase = await serverSupabaseClient<Database>(event);
  const taskResult = await supabase.from("task").insert({
    tid: body.tid,
    type: body.type,
    name: body.name,
    color: body.color,
  });

  if (taskResult.status !== 201) {
    return {
      status: taskResult.status,
      message: taskResult.statusText,
    };
  }

  const newSchedules = [];

  for (const schedule of body.schedule) {
    newSchedules.push({
      tid: body.tid,
      sid: schedule.id,
      name: schedule.name,
      desc: schedule.desc,
      text_color: schedule.textColor,
      background_color: schedule.backgroundColor,
      start_time: schedule.days[0],
      end_time: schedule.days[1],
    });
  }

  const scheduleResult = await supabase.from("schedule").insert(newSchedules);
  return {
    status: 201,
    message: scheduleResult.statusText,
  };
});
