<template>
    <v-app>
        <top-nav-bar />
        <navigation-panels></navigation-panels>
        <v-main style="max-height: 100vh;">
            <router-view v-slot="{ Component }">
                <keep-alive>
                    <component :is="Component" class="w-100 h-100"> </component>
                </keep-alive>
            </router-view>
        </v-main>
    </v-app>
</template>

<script setup>
import NavigationPanels from './components/NavigationPanels.vue'
import TopNavBar from './components/TopNavBar.vue';
</script>

<style scoped></style>
