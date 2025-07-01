<template>
  <div class="h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4 flex flex-col">
    <!-- Логотип -->
    <div class="flex items-center gap-2 mb-8">
      <span class="text-xl font-semibold">MEDIAPLAN-CRM<span class="text-primary"></span></span>
    </div>

    <!-- Меню -->
    <Menu :model="items" class="w-full h-full mt-2 border-none shadow-none bg-transparent dark:bg-transparent">

      <!-- Заголовок подменю -->
      <template #submenulabel="{ item }">
        <span class="text-sm font-bold text-gray-500 dark:text-gray-400">{{ item.label }}</span>
      </template>

      <!-- Пункт меню -->
      <template #item="{ item, props }">
        <a v-if="item.to" :href="props.action.href" v-ripple class="flex items-center px-3 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-800 transition-colors cursor-pointer"
        @click.prevent="handleRoute(item)">
           <FontAwesomeIcon v-if="Array.isArray(item.icon)" :icon="item.icon" class="mr-2 text-lg" />
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto text-xs text-gray-500 dark:text-gray-400">{{ item.shortcut }}</span>
        </a>
        <a v-else v-ripple class="flex items-center px-3 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-800 transition-colors cursor-pointer"
           @click.prevent="item.command && item.command()">
           <FontAwesomeIcon v-if="Array.isArray(item.icon)" :icon="item.icon" class="mr-2 text-lg" />
          <span>{{ item.label }}</span>
          <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
          <span v-if="item.shortcut" class="ml-auto text-xs text-gray-500 dark:text-gray-400">{{ item.shortcut }}</span>
        </a>
      </template>

    </Menu>

  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  items: {
    type: Array,
    required: true
  }
})

function handleRoute(item) {
  if (item.to) {
    router.push(item.to)
  } else if (item.command) {
    item.command()
  }
}


</script>