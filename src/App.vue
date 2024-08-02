<template>
    <v-app class="h-100">
        <top-nav-bar></top-nav-bar>
        <navigation-panels></navigation-panels>
        <v-main>
            <v-container>
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component
                            :is="Component"
                            class="w-100 h-100"
                            @init-map="() => {
                                console.log('the map emitted something')
                            }"
                            @load-map="(instance) => {
                                console.log('the map has been loaded emitted from style(dot)load', instance)
                            }"
                            @zoom="(zoom) => {
                                console.log('zoom is changing', zoom)
                            }"
                        > </component>
                    </keep-alive>
                </router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import TopNavBar from './components/TopNavBar.vue'
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
