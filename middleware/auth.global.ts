export default defineNuxtRouteMiddleware(async (to, _from) => {
  const user = await useSupabaseUser();

  if (to.path === "/") {
    if (user.value !== null) {
      return navigateTo("/dashboard");
    }
  } else if (user.value === null) {
    return navigateTo("/");
  }
});
