<template>
  <div class="flex h-screen">
    <SidebarMenu :items="items" />
    <main class="flex-1 overflow-auto p-6 bg-gray-50 dark:bg-gray-800">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import SidebarMenu from '../components/SidebarMenu.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const items = [
  {
    separator: true
  },
  {
    label: 'Documents',
    items: [
      {
        label: 'New',
        icon: 'pi pi-plus',
        to: '/new',
        shortcut: '⌘+N'
      },
      {
        label: 'Search',
        icon: 'pi pi-search',
        to: '/search',
        shortcut: '⌘+S'
      }
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        to: '/settings',
        shortcut: '⌘+O'
      },
      {
        label: 'Messages',
        icon: 'pi pi-inbox',
        badge: 2,
        to: '/messages'
      }
    ]
  },
  {
    separator: true
  },
  {
    label: 'Exit',
    icon: ['fas', 'sign-out-alt'],
    shortcut: 'ctrl+X',
    command: () => logout()
  }
]

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>