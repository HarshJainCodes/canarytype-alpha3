<template>
    <v-navigation-drawer>
        <div class="pa-4">
            <v-list>
                <v-tooltip v-for="item in navBarItems" :key="item.name" :disabled="!item.disabled">
                    <template #activator="{ props }">
                        <div v-bind="props">
                            <v-list-item
                                :value="item.name"
                                :title="item.name"
                                :prepend-icon="item.icon"
                                :disabled="item.disabled"
                                @click="item.clicked"
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
import { useRouter } from 'vue-router';

const userDetails = useUserDetailsStore()
const router = useRouter()

const navBarItems = computed(() => {
    return [
        {
            name: userDetails.isLoggedIn ? 'Profile' : 'Login',
            icon: 'mdi-account-circle-outline',
            disabled: false,
            clicked: () => {
                if (userDetails.isLoggedIn) {
                    router.push(`/u/${userDetails.userName}`);
                } else {
                    router.replace('/Login')
                }
            }
        },
        {
            name: 'TypingArena',
            icon: 'mdi-keyboard',
            disabled: false,
            clicked: () => {
                router.replace('/TypingArena')
            }
        },
        {
            name: 'Analysis',
            icon: 'mdi-poll',
            disabled: !userDetails.isLoggedIn,
            clicked: () => {
                router.replace('/Analysis')
            }
        },
        {
            name: 'Leaderboard',
            icon: 'mdi-trophy',
            disabled: !userDetails.isLoggedIn,
            clicked: () => {
                router.replace('/Leaderboard')
            }
        },
        {
            name: 'MapVisualization',
            icon: 'mdi-map-check',
            disabled: false,
            clicked: () => {
                router.replace('/MapVisualization')
            }
        }
    ]
})
</script>
