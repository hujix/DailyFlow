<script lang="ts" setup></script>

<template>
  <div class="flex h-screen bg-background">
    <Sidebar class="h-full w-72 border-r bg-secondary" />
    <div class="container">
      <slot />
    </div>
  </div>
</template>
