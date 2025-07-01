import { createRouter, createWebHistory } from 'vue-router'

// Страницы
import LoginView from '../views/LoginView.vue'
import HomeView from '../views/HomeView.vue'
import PlannerView from '../views/PlannerView.vue'
import ProfileView from '../views/ProfileView.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('../layouts/AuthLayout.vue'),
    children: [
      {
        path: '',
        name: 'Login',
        component: LoginView
      }
    ]
  },
  {
    path: '/',
    name: 'main',
    component: () => import('../layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'dashboard',
        component: HomeView
      },
      {
        path: 'mediaplan',
        name: 'mediaplan',
        component: PlannerView
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('token')

  if (to.path === '/login' && isAuthenticated) {
    next('/')
  } else if (!isAuthenticated && to.path !== '/login') {
    next('/login')
  } else {
    next()
  }
})

export default router