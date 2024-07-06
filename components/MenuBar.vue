<script setup lang="ts">
import { ref } from "vue";

const items = ref([
  { label: "New", icon: "pi pi-plus", shortcut: "⌘+N" },
  { label: "Search", icon: "pi pi-search" },
]);
</script>

<template>
  <Menu :model="items" class="w-36" />
</template>
