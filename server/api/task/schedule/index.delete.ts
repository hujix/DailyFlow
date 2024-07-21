import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const { id } = await readBody(event);
  if (!id) {
    return {
      status: 400,
      message: "缺少参数",
    };
  }

  const supabase = await serverSupabaseClient<Database>(event);

  const deleteResult = await supabase.from("schedule").delete().eq("sid", id);
  if (deleteResult.error) {
    return {
      status: deleteResult.error.code,
      message: deleteResult.error.message,
    };
  }
  return {
    status: 200,
    message: "删除成功",
  };
});
