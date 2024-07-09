import { serverSupabaseClient } from "#supabase/server";
import type { Database } from "~/types/supabase.type";

export default defineEventHandler(async (event) => {
  const requestBody = (await readBody(event)) as { id: number; finish: string[] };

  const supabase = await serverSupabaseClient<Database>(event);

  const updateResult = await supabase
    .from("schedule")
    .update({
      finish: requestBody.finish,
    })
    .eq("id", requestBody.id);

  return {
    status: updateResult.status,
    message: updateResult.statusText,
  };
});
