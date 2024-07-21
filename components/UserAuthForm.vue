<script lang="ts" setup>
import { useToast } from "@/components/ui/toast/use-toast";
import { cn } from "@/lib/utils";

const supabase = useSupabaseClient();

const isLoading = ref(false);

const email: Ref<string> = ref("");

const countDown = ref(60);

let timer: NodeJS.Timeout | undefined;

const { toast } = useToast();

async function signInWithEmail() {
  if (
    email.value === undefined ||
    email.value.trim().length === 0 ||
    /^[\w.-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i.test(email.value) === false
  ) {
    toast({
      title: "🙅‍♂️错误邮箱",
      description: "请输入正确的邮箱地址!",
      variant: "destructive",
    });
    return;
  }

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
    options: {
      data: {
        display_name: email.value.split("@")[0].slice(0, 5),
        avator: String(Math.floor(Math.random() * 53) + 1001),
      },
    },
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
        <Input id="email" v-model="email" type="email" placeholder="Email" autofocus />
        <div class="inline-flex items-center gap-2">
          <PinInput v-model="value" placeholder="" @complete="handleComplete">
            <PinInputGroup>
              <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
            </PinInputGroup>
          </PinInput>
          <Button type="submit" :disabled="isLoading" class="w-full">
            {{ isLoading ? `${countDown}s` : "发送" }}
          </Button>
        </div>
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
