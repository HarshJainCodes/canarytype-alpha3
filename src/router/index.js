import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AnalysisView from '../views/AnalysisView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            name: 'default',
            path: '/',
            redirect: '/TypingArena'
        },
        {
            name: 'TypingArena',
            path: '/TypingArena',
            component: HomeView
        },
        {
            name: 'LoginPage',
            path: '/Login',
            component: LoginView
        },
        {
            name: 'Analysis',
            path: '/Analysis',
            component: AnalysisView
        }
    ]
})

export default router
