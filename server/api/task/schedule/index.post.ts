import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    tid: string;
    sid: string;
    name: string;
    desc: string;
    cycle: number;
    backgroundColor: string;
    textColor: string;
    days: string[];
  };
  if (body.name.length === 0) {
    return {
      status: 400,
      message: "name参数错误",
    };
  }
  if (body.days.length !== 2) {
    return {
      status: 400,
      message: "days参数错误",
    };
  }
  const supabase = await serverSupabaseClient<Database>(event);
  const taskResult = await supabase.from("schedule").insert({
    tid: body.tid,
    sid: body.sid,
    name: body.name,
    desc: body.desc,
    cycle: body.cycle,
    start_time: body.days[0],
    end_time: body.days[1],
    background_color: body.backgroundColor,
    text_color: body.textColor,
  });

  if (taskResult.error) {
    return {
      status: taskResult.error.code,
      message: taskResult.error.message,
    };
  }

  if (taskResult.status !== 201) {
    return {
      status: taskResult.status,
      message: taskResult.statusText,
    };
  }
  return {
    status: 200,
    message: "计划新建成功",
  };
});
