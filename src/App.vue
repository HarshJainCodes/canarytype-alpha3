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

const setLoginStatusIfComingFromAnotherRoute = () => {
    const userName = localStorage.getItem('canaryalpha3Username')
    if (userName) {
        userDetails.userName = userName
        userDetails.setIsLoggedIn(true)
    }
}
</script>

<style scoped></style>
