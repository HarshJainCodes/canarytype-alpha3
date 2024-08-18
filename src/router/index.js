import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import AnalysisView from '../views/AnalysisView.vue'
import MapView from '../views/MapView.vue'
import UserProfile from '../views/ProfileView.vue'
import SignalRView from '@/views/SignalRView.vue'

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
            name: 'Profile',
            path: '/u/:username',
            component: UserProfile,
        },
        {
            name: 'Analysis',
            path: '/Analysis',
            component: AnalysisView
        },
        {
            name: 'MapVisualization',
            path: '/MapVisualization',
            component: MapView,
        },
        {
            name: 'TestingSignalR',
            path: '/TestingSignalR',
            component: SignalRView
        }
    ]
})

export default router
