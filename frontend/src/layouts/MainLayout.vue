<template>
  <div class="main-layout">
    <Menubar :model="menuItems" />
    <router-view />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const menuItems = [
  {
    label: 'Главная',
    icon: ['fas', 'home'],
    command: () => router.push('/')
  },
  {
    label: 'Выход',
    icon: ['fas', 'sign-out-alt'],
    command: () => logout()
  }
]

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}
</script>