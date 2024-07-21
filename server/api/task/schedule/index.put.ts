import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const requestBody = (await readBody(event)) as { sid: number; finish: string[] };

  const supabase = await serverSupabaseClient<Database>(event);

  const updateResult = await supabase
    .from("schedule")
    .update({
      finish: requestBody.finish,
    })
    .eq("sid", requestBody.sid);

  if (updateResult.error) {
    return {
      status: updateResult.error.code,
      message: updateResult.error.message,
    };
  }
  if (updateResult.status === 204) {
    return {
      status: 200,
      message: "更新成功！",
    };
  }

  return {
    status: updateResult.status,
    message: updateResult.statusText,
  };
});
