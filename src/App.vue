<template>
  <v-app>
    <top-nav-bar></top-nav-bar>
    <navigation-panels></navigation-panels>
    <v-main>
      <v-container class="h-100">
        <router-view v-slot="{ Component }">
          <keep-alive>
            <component :is="Component"> </component>
          </keep-alive>
        </router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import TopNavBar from './components/TopNavBar.vue'
import NavigationPanels from './components/NavigationPanels.vue'
</script>

<style scoped></style>
