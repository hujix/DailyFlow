<script lang="ts" setup>
const user = useSupabaseUser();
</script>

<template>
  <Tabs default-value="information" class="flex w-full gap-8">
    <TabsList class="mt-16 flex h-full w-40 flex-col gap-2">
      <TabsTrigger value="information" class="h-10 w-full">我的信息</TabsTrigger>
      <TabsTrigger value="password" class="h-10 w-full" disabled>Password</TabsTrigger>
    </TabsList>
    <TabsContent value="information">
      <div class="flex items-center gap-4">
        <div class="relative">
          <Avatar class="cursor-pointer" size="lg" shape="square">
            <AvatarImage
              :src="`/avatar/${user.user_metadata.avator}.png`"
              :alt="user.user_metadata.display_name"
            />
            <AvatarFallback>{{ user.user_metadata.display_name.slice(0, 2) }}</AvatarFallback>
          </Avatar>
          <Button
            size="sm"
            class="absolute bottom-1 left-1/2 -translate-x-1/2 transform rounded-full bg-muted-foreground/10"
            variant="ghost"
          >
            更换
          </Button>
        </div>
        <div>
          <h2 class="text-3xl">{{ user.user_metadata.display_name }}</h2>
          <span class="text-sm text-muted-foreground">{{ user.email }}</span>
        </div>
      </div>
    </TabsContent>
    <TabsContent value="password">Change your password here.</TabsContent>
  </Tabs>
</template>
