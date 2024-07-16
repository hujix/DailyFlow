<script lang="ts" setup></script>

<template>
  <div class="flex h-screen w-screen overflow-x-hidden bg-background">
    <aside class="w-64 shrink-0 border-r bg-secondary">
      <Sidebar />
    </aside>
    <main class="container h-full overflow-y-auto py-4">
      <slot />
    </main>
  </div>
</template>
