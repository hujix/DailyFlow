<script setup lang="ts">
import { House } from "lucide-vue-next";

import { cn } from "@/lib/utils";
</script>

<template>
  <div :class="cn($attrs.class ?? '')">
    <div class="space-y-4">
      <div class="px-3 py-2">
        <h2 class="h-12 from-green-600 bg-clip-text pb-2 text-center text-2xl font-bold">
          DailyFlow
        </h2>
        <Separator />
        <div class="my-2 space-y-1">
          <Button variant="secondary" class="w-full justify-start">
            <House class="mr-2 h-4 w-4" />
            首页
          </Button>
          <Button variant="ghost" disabled class="w-full justify-start">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              class="mr-2 h-4 w-4"
            >
              <rect width="7" height="7" x="3" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="3" rx="1" />
              <rect width="7" height="7" x="14" y="14" rx="1" />
              <rect width="7" height="7" x="3" y="14" rx="1" />
            </svg>
            Browse
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>
