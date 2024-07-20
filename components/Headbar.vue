<script lang="ts" setup>
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
</script>

<template>
  <div class="flex h-10 items-center justify-between">
    <h2 class="mt-2 text-2xl font-bold">👋Hello ! xxx</h2>
    <div class="inline-flex items-center gap-2">
      <HoverCard>
        <HoverCardTrigger as-child>
          <Avatar class="cursor-pointer">
            <AvatarImage src="/avatar/1001.png" alt="vue" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </HoverCardTrigger>
        <HoverCardContent class="w-44 p-2">
          <div class="flex flex-col items-center gap-1">
            <Avatar class="cursor-pointer" size="base">
              <AvatarImage src="/avatar/1001.png" alt="vue" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <div class="text-center text-xl font-medium">xxxxxxxx</div>
            <div class="text-center text-xs text-muted-foreground">ssss@qq.com</div>
          </div>
          <div class="mt-2 flex w-full flex-col gap-1">
            <NuxtLink :class="cn(buttonVariants({ variant: 'ghost' }), 'w-full cursor-pointer')">
              <span class="inline-flex w-full items-center gap-2">
                <LucideSlidersHorizontal class="h-4 w-4" />
                个人中心
              </span>
            </NuxtLink>
            <Separator />
            <NuxtLink :class="cn(buttonVariants({ variant: 'ghost' }), 'w-full cursor-pointer')">
              <span class="inline-flex w-full items-center gap-2 text-red-600">
                <LucideLogOut class="h-4 w-4" />
                退出登录
              </span>
            </NuxtLink>
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
