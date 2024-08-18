<template>
    <v-app>
        <navigation-panels></navigation-panels>
        <v-main>
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component
                        :is="Component"
                        class="w-100 h-100"
                    > </component>
                </keep-alive>
            </router-view>
        </v-main>
    </v-app>
</template>

<script setup>
import NavigationPanels from './components/NavigationPanels.vue'
import { onMounted, onActivated } from 'vue'
import { useUserDetailsStore } from './stores/userDetails'

const userDetails = useUserDetailsStore()

onMounted(() => {
    setLoginStatusIfComingFromAnotherRoute()
})

onActivated(() => {
    setLoginStatusIfComingFromAnotherRoute()
})

const setLoginStatusIfComingFromAnotherRoute = async () => {
    const call = await fetch('https://canarytype-alpha3.azurewebsites.net/api/TypingArena/CheckLogin', {
        credentials: 'include'
    })

    if (call.status === 401) {
        userDetails.userName = '';
        userDetails.setIsLoggedIn(false);
    } else if (call.status === 200) {
        userDetails.userName = localStorage.getItem('canaryalpha3Username');
        userDetails.setIsLoggedIn(true);
    }
}
</script>

<style scoped></style>
