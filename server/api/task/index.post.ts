import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const { tid, name, color } = (await readBody(event)) as {
    tid: string;
    name: string;
    color: string;
  };

  const supabase = await serverSupabaseClient<Database>(event);
  const taskResult = await supabase.from("task").insert({
    type: "normal",
    tid,
    name,
    color,
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
    message: "任务新建成功",
  };
});
