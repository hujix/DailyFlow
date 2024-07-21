import { serverSupabaseClient, serverSupabaseUser } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const user = await serverSupabaseUser(event);
  if (!user) {
    return {
      status: 401,
      message: "用户校验失败",
      data: [],
    };
  }

  const { status, error, data } = await supabase
    .from("task")
    .select(
      `
      tid,
      type,
      name,
      schedule(sid,name,cycle,desc,background_color,finish,text_color,start_time,end_time)
      `
    )
    .eq("uid", user.id);

  if (error) {
    return {
      status: error.code,
      message: error.message,
      data: [],
    };
  }

  if (data === null) {
    return {
      status,
      message: "unknown error",
      data: [],
    };
  }

  return { status: 200, message: "success", data };
});
