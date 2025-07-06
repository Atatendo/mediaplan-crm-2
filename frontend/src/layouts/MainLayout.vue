<template>
  <div class="flex h-screen">
    <SidebarMenu :items="items" />
    <main class="flex-1 overflow-auto bg-gray-50 dark:bg-gray-800">
      <MenuBar class="border-0 shadow-none" />
      <router-view/>
    </main>
  </div>
</template>

<script setup>
import SidebarMenu from '../components/SidebarMenu.vue'
import MenuBar from '../components/MenuBar.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = [
  {
    label: 'Планирование',
    items: [
      {
        label: 'Главная',
        icon: ['fas', 'home'],
        to: '/',
        class: '',
      },
      {
        label: 'Медиаплан',
        icon: ['fas', 'calendar'],
        to: '/mediaplan',
      },
      {
        label: 'Ссылки',
        icon: ['fas', 'external-link'],
        to: '/mediaplan',
      },
    ],
  },
  {
    separator: true,
  },
  {
    label: 'Справочно',
    items: [
      {
        label: 'Список СМИ',
        icon: ['fas', 'list-alt'],
        to: '/settings',
        //shortcut: '⌘+O',
      },
      {
        label: 'Техническое оснащение',
        icon: ['fas', 'camera'],
        badge: 2,
        to: '/messages',
      },
    ],
  },
  {
    separator: true,
  },
  
]


</script>