<template>
    <v-navigation-drawer rail expand-on-hover permanent class="fill-height">
        <div>
            <v-list class="py-6">
                <v-list-item>
                    <template #prepend>
                        <v-icon icon="mdi-account" size="large">
                        </v-icon>
                    </template>
                    <div>
                        <div class="text-h6 d-flex flex-column">
                            <div>
                                {{ userDetails.userName || '' }}
                            </div>
                        </div>
                    </div>
                </v-list-item>
            </v-list>

            <v-divider></v-divider>
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

        <v-divider></v-divider>
        <v-list v-if="userDetails.isLoggedIn">
            <v-list-item @click="() => console.log('hello')">
                <template #prepend>
                    <v-icon icon="mdi-logout">
                    </v-icon>
                </template>
                Logout
            </v-list-item>
        </v-list>

    </v-navigation-drawer>

</template>

<script setup>
import { computed, ref } from 'vue'
import { useUserDetailsStore } from '../stores/userDetails.js'
import { useRouter } from 'vue-router'

const userDetails = useUserDetailsStore()
const router = useRouter()

// need to do something with this
const rail = ref(true)

const navBarItems = computed(() => {
    return [
        {
            name: userDetails.isLoggedIn ? 'Profile' : 'Login',
            icon: 'mdi-account-circle-outline',
            disabled: userDetails.isPlayingMultiplayer,
            clicked: () => {
                if (userDetails.isLoggedIn) {
                    router.push(`/u/${userDetails.userName}`)
                } else {
                    router.replace('/Login')
                }
            }
        },
        {
            name: 'TypingArena',
            icon: 'mdi-keyboard',
            disabled: userDetails.isPlayingMultiplayer,
            clicked: () => {
                router.replace('/TypingArena')
            }
        },
        // {
        //     name: 'Analysis',
        //     icon: 'mdi-poll',
        //     disabled: !userDetails.isLoggedIn || userDetails.isPlayingMultiplayer,
        //     clicked: () => {
        //         router.replace('/Analysis')
        //     }
        // },
        // {
        //     name: 'Leaderboard',
        //     icon: 'mdi-trophy',
        //     disabled: !userDetails.isLoggedIn || userDetails.isPlayingMultiplayer,
        //     clicked: () => {
        //         router.replace('/Leaderboard')
        //     }
        // },
        // {
        //     name: 'MapVisualization',
        //     icon: 'mdi-map-check',
        //     disabled: userDetails.isPlayingMultiplayer,
        //     clicked: () => {
        //         router.replace('/MapVisualization')
        //     }
        // },
        {
            name: 'PlayOnline',
            icon: 'mdi-message-outline',
            disabled: !userDetails.isLoggedIn,
            clicked: () => {
                router.replace('/PlayOnline')
            }
        }
    ]
})
</script>
