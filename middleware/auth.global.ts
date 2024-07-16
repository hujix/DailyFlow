import type { Database } from "~/types/supabase.type";

export default defineNuxtRouteMiddleware(async (to, _from) => {
  const supabase = useSupabaseClient<Database>();
  const user = await supabase.auth.getUser();
  if (to.path === "/login") {
    if (user.value !== null) {
      return navigateTo("/dashboard");
    }
  } else {
    if (user.value === null) {
      return navigateTo("/");
    }
  }
});
