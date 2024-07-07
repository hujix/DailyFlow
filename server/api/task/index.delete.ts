import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const { id, type } = await readBody(event);
  const supabase = await serverSupabaseClient<Database>(event);

  let deleteResult;
  if (type === "task") {
    deleteResult = await supabase.from("task").delete().eq("tid", id);
  } else {
    deleteResult = await supabase.from("schedule").delete().eq("id", id);
  }
  return {
    status: deleteResult.status,
    message: deleteResult.statusText,
  };
});
