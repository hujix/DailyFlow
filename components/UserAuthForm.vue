<script lang="ts" setup>
import { useToast } from "./ui/toast/use-toast";

import { cn } from "@/lib/utils";

const supabase = useSupabaseClient();

const isLoading = ref(false);

const email = ref("1668819658@qq.com");

const countDown = ref(60);

let timer: NodeJS.Timeout | undefined;

const { toast } = useToast();

async function signInWithEmail() {
  isLoading.value = true;
  countDown.value = 60;
  timer = setInterval(() => {
    if (countDown.value > 0) {
      countDown.value--;
    } else {
      isLoading.value = false;
      clearInterval(timer);
    }
  }, 1000);
  const { data, error } = await supabase.auth.signInWithOtp({
    email: email.value,
  });
  if (error === null && data.user === null && data.session === null) {
    toast({
      title: "验证码已发送",
      description: `请查收您的邮箱：${email.value}`,
    });
  }
  isLoading.value = false;
}

const value = ref<string[]>([]);

async function handleComplete(e: string[]) {
  const { data, error } = await supabase.auth.verifyOtp({
    email: email.value,
    token: e.join(""),
    type: "email",
  });
  if (data.user === null && data.session === null && error !== null) {
    toast({
      title: "验证码失效或错误",
      description: "请重新输入验证码",
    });
  }
}
</script>

<template>
  <div :class="cn('grid gap-6', $attrs.class ?? '')">
    <form @submit.prevent="signInWithEmail">
      <div class="grid gap-2">
        <div class="flex w-full items-center gap-1.5">
          <Input id="email" v-model="email" type="email" placeholder="Email" autofocus />
          <Button type="submit" :disabled="isLoading">
            {{ isLoading ? `${countDown}s` : "发送" }}
          </Button>
        </div>
        <PinInput v-model="value" placeholder="" @complete="handleComplete">
          <PinInputGroup>
            <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
          </PinInputGroup>
        </PinInput>
        <!-- <Button :disabled="isLoading">
          <LucideCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          登录
        </Button> -->
      </div>
    </form>
    <div class="relative">
      <div class="absolute inset-0 flex items-center">
        <span class="w-full border-t" />
      </div>
      <div class="relative flex justify-center text-xs uppercase">
        <span class="bg-background px-2 text-muted-foreground">第三方登录</span>
      </div>
    </div>
    <Button variant="outline" type="button" disabled>
      <LucideCircle v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
      <LucideGithub v-else class="mr-2 h-4 w-4" />
      GitHub
    </Button>
    <Toaster />
  </div>
</template>
