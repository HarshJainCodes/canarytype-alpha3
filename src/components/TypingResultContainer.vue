<template>
    <div class="d-flex w-100 h-100">
        <div class="d-flex w-100 h-100 mx-5 flex-column justify-center">
            <div>
                <v-btn :prepend-icon="'mdi-arrow-left'"> Type Again </v-btn>
            </div>
            <div class="d-flex w-100 h-75">
                <v-card class="w-100 my-5 mr-5" elevation="3">
                    <typing-result
                        :line-chart-data="lineChartData"
                        :raw-line-chart-data="rawLineChartData"
                    ></typing-result>
                </v-card>

                <v-card
                    class="d-flex flex-column justify-center align-center w-25 my-5"
                    elevation="5"
                >
                    <v-list>
                        <v-list-item>
                            <v-card variant="outlined">
                                <v-card-title>
                                    <div class="d-flex justify-center">
                                        Average Typing Speed
                                    </div></v-card-title
                                >
                                <v-card-text>
                                    <div class="d-flex justify-center text-h5">65 WPM!</div>
                                </v-card-text>
                            </v-card>
                        </v-list-item>

                        <v-list-item>
                            <v-card variant="outlined">
                                <v-card-title>
                                    <div class="d-flex justify-center">Faster than</div>
                                </v-card-title>
                                <v-card-text>
                                    <div class="d-flex justify-center text-h5">95% of users</div>
                                </v-card-text>
                            </v-card>
                        </v-list-item>
                    </v-list>
                </v-card>
            </div>
            <v-card class="d-flex justify-center" elevation="3" variant="outlined" color="red">
                <div v-if="!userDetails.isLoggedIn" class="text-h6">
                    Please Login to save your result
                </div>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import TypingResult from './TypingResult.vue'
import { useUserDetailsStore } from '@/stores/userDetails'

const props = defineProps(['lineChartData', 'rawLineChartData'])

const userDetails = useUserDetailsStore()
</script>
