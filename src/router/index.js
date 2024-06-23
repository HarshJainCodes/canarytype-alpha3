import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      name: 'TypingArena',
      path: '/TypingArena',
      component: HomeView
    },
    {
      name: 'LoginPage',
      path: '/Login',
      component: LoginView
    }
  ]
})

export default router
