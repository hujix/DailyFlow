<script lang="ts" setup>
const user = useSupabaseUser();

definePageMeta({
  layout: false,
});

watchEffect(() => {
  if (user.value) {
    navigateTo("/dashboard");
  }
});
</script>

<template>
  <div
    class="container relative grid h-screen flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0"
  >
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex items-center text-lg font-medium">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          class="mr-2 h-6 w-6"
        >
          <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
        </svg>
        DailyFlow
      </div>
      <div class="relative z-20 mt-auto">
        <blockquote class="space-y-2">
          <p class="text-lg">
            “忙碌的人，心中有无数的小虫在咬，拖延的人，却用时间的刀割断了自己的手臂。DailyFlow，不是束缚，而是自由的钥匙。”
          </p>
          <footer class="text-sm">
            鲁迅
          </footer>
        </blockquote>
      </div>
    </div>
    <div class="lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div class="flex flex-col space-y-2 text-center">
          <h1 class="text-2xl font-semibold tracking-tight">
            登陆/创建账户
          </h1>
          <p class="text-sm text-muted-foreground">
            输入邮箱账号来登陆或注册
          </p>
        </div>
        <UserAuthForm />
        <p class="px-8 text-center text-sm text-muted-foreground">
          点击继续则代表，您同意我们的
          <a href="/terms" class="underline underline-offset-4 hover:text-primary">
            服务条款
          </a>
          和
          <a href="/privacy" class="underline underline-offset-4 hover:text-primary">
            隐私策略
          </a>
          。
        </p>
      </div>
    </div>
  </div>
</template>
