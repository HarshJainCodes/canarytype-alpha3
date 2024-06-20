<template>
  <v-navigation-drawer>
    <div class="pa-5">
      <v-list>
        <v-list-item
          v-for="item in navBarItems"
          :key="item.name"
          :value="item.name"
          :title="item.name"
          :prepend-icon="item.icon"
          :to="item.name"
        >
        </v-list-item>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<script setup>
const navBarItems = [
  {
    name: 'Profile',
    icon: 'mdi-account-circle-outline'
  },
  {
    name: 'TypingArena',
    icon: 'mdi-keyboard'
  },
  {
    name: 'Analysis',
    icon: 'mdi-poll'
  },
  {
    name: 'Leaderboard',
    icon: 'mdi-trophy'
  }
]
</script>
