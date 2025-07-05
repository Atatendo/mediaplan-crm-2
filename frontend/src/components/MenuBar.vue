<template>
  <div class="border-0 shadow-none">
    <Menubar class="flex">
      
      <template #end>
        <div class="card flex justify-center border-0 shadow-none">
          <Menu ref="menuRef" :popup="true" :model="items" @show="isUserMenuOpen = true" @hide="isUserMenuOpen = false" border-0 shadow-none/>
        </div>

        <button @click="toggleUserMenu" class="flex items-center gap-3 cursor-pointer focus:outline-none">
          <Avatar :image="this.avatar" />
          <span>
                <span class="font-bold">Анастасия Красногородская</span>
                <FontAwesomeIcon :icon="['fas', isUserMenuOpen? 'angle-up' : 'angle-down']" class="mr-2 ml-4 font-light" />
            </span>
        </button>
      </template>
    </Menubar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      avatar: 'https://primefaces.org/cdn/primevue/images/avatar/amyelsner.png',
      isUserMenuOpen: false,
      items: [
        
            {
              label: 'Настройки',
              icon: ['fas', 'cog'],
              to: '/settings',
            },
            {
              separator: true,
            },
            {
              label: 'Выход',
              icon: ['fas', 'sign-out-alt'],
              command: () => this.logout(),
            },
          
        
      ],
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token')
      this.$router.push('/login')
    },
    toggleUserMenu(event) {
      this.$refs.menuRef.toggle(event)
    },
  },
}
</script>