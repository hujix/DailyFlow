<script setup lang="ts">
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const route = useRoute();
</script>

<template>
  <div :class="cn($attrs.class ?? '')">
    <div class="space-y-4">
      <div class="px-3 py-2">
        <h2 class="h-12 bg-clip-text pb-2 text-center text-2xl font-bold">DailyFlow</h2>
        <Separator />
        <div class="my-2 space-y-1">
          <NuxtLink
            :class="
              cn(
                buttonVariants({ variant: route.name === 'dashboard' ? 'outline' : 'ghost' }),
                'w-full justify-start hover:bg-secondary'
              )
            "
            to="/dashboard"
          >
            <LucideHome class="mr-2 h-4 w-4" />
            首页
          </NuxtLink>
          <NuxtLink
            :class="
              cn(
                buttonVariants({ variant: route.name === 'manage' ? 'outline' : 'ghost' }),
                'w-full justify-start hover:bg-secondary'
              )
            "
            to="/manage"
          >
            <LucideLayoutList class="mr-2 h-4 w-4" />
            任务管理
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
