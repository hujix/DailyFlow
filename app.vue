<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/vue";
</script>

<template>
  <NuxtLayout>
    <NuxtLoadingIndicator />
    <NuxtPage />
    <SpeedInsights />
  </NuxtLayout>
</template>
