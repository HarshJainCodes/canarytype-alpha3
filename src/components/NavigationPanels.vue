<template>
  <v-navigation-drawer>
    <div class="pa-5">
      <v-list>
        <v-tooltip v-for="item in navBarItems" :key="item.name" :disabled="!item.disabled">
          <template #activator="{ props }">
            <div v-bind="props">
              <v-list-item
                :value="item.name"
                :title="item.name"
                :prepend-icon="item.icon"
                :disabled="item.disabled"
                :to="item.name"
              >
              </v-list-item>
            </div>
          </template>
          You need to login to view
        </v-tooltip>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
import { computed } from 'vue'
import { useUserDetailsStore } from '../stores/userDetails.js'

const userDetails = useUserDetailsStore()

const navBarItems = computed(() => {
  return [
    {
      name: userDetails.isLoggedIn ? 'Profile' : 'Login',
      icon: 'mdi-account-circle-outline',
      disabled: false
    },
    {
      name: 'TypingArena',
      icon: 'mdi-keyboard',
      disabled: false
    },
    {
      name: 'Analysis',
      icon: 'mdi-poll',
      disabled: !userDetails.isLoggedIn
    },
    {
      name: 'Leaderboard',
      icon: 'mdi-trophy',
      disabled: !userDetails.isLoggedIn
    }
  ]
})
</script>
