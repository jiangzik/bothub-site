<script setup lang="ts">
const { open } = useContentSearch()
</script>

<template>
  <UButton
    color="neutral"
    variant="outline"
    class="w-full bothub-search-trigger"
    style="border:2px solid var(--black); border-radius:0; background:var(--white); color:var(--black); box-shadow:none;"
    icon="i-lucide-search"
    label="Search..."
    aria-label="Search..."
    :ui="{ leadingIcon: 'size-4 mr-1' }"
    @click="open = true"
  >
    <template #trailing>
      <span data-slot="trailing" class="hidden lg:flex items-center gap-0.5 ms-auto">
        <UKbd value="meta" variant="subtle" />
        <UKbd value="k" variant="subtle" />
      </span>
    </template>
  </UButton>
</template>
