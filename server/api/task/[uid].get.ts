import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const supabase = await serverSupabaseClient<Database>(event);

  const uid = event.context.params?.uid;

  if (!uid) {
    return {
      status: 400,
      message: "Invalid uid",
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
      schedule(id,name,cycle,desc,background_color,finish,text_color,start_time,end_time)
      `
    )
    .eq("uid", uid);

  if (data === null) {
    return {
      status,
      message: error,
      data: [],
    };
  }

  return { status, message: "success", data };
});
