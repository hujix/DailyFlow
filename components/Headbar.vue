<script lang="ts" setup>
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast/use-toast";
import { cn } from "@/lib/utils";

const { toast } = useToast();

const supabase = useSupabaseClient();

const user = useSupabaseUser();

async function onClickLogout() {
  const result = await supabase.auth.signOut();
  if (result.error) {
    toast({
      title: "退出失败",
      description: result.error.message,
      variant: "destructive",
    });
  } else {
    toast({
      title: "退出成功",
      description: "您已成功退出登录",
    });
    navigateTo("/");
  }
}
</script>

<template>
  <div class="flex h-10 items-center justify-between">
    <h2 class="mt-2 text-2xl font-bold">👋Hello ! xxx</h2>
    <div class="inline-flex items-center gap-2">
      <HoverCard>
        <HoverCardTrigger as-child>
          <Avatar class="cursor-pointer">
            <AvatarImage
              :src="`/avatar/${user.user_metadata.avator}.png`"
              :alt="user.user_metadata.name"
            />
            <AvatarFallback>{{ user.user_metadata.name.slice(0, 2) }}</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent class="w-44 p-2">
          <div class="flex flex-col items-center gap-1">
            <Avatar class="cursor-pointer" size="base">
              <AvatarImage
                :src="`/avatar/${user.user_metadata.avator}.png`"
                :alt="user.user_metadata.name"
              />
              <AvatarFallback>{{ user.user_metadata.name.slice(0, 2) }}</AvatarFallback>
            </Avatar>
            <div class="truncate text-center text-xl font-medium">
              {{ user.user_metadata.name }}
            </div>
            <div class="text-center text-xs text-muted-foreground">{{ user.email }}</div>
          </div>
          <div class="mt-2 flex w-full flex-col gap-1">
            <NuxtLink
              :class="cn(buttonVariants({ variant: 'ghost' }), 'w-full cursor-pointer')"
              to="/profile"
            >
              <span class="inline-flex w-full items-center gap-2">
                <LucideSlidersHorizontal class="h-4 w-4" />
                个人中心
              </span>
            </NuxtLink>
            <Separator />
            <Button variant="ghost" class="w-full cursor-pointer" @click.stop="onClickLogout">
              <span class="inline-flex w-full items-center gap-2 text-red-600">
                <LucideLogOut class="h-4 w-4" />
                退出登录
              </span>
            </Button>
          </div>
        </HoverCardContent>
      </HoverCard>
      <div class="flex items-center gap-2">
        <Button variant="ghost" class="cursor-pointer">
          <LucideSun class="h-4 w-4" />
        </Button>
      </div>
    </div>
  </div>
</template>
