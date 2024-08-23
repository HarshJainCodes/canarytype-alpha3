<template>
    <div class="d-flex w-100 h-100">
        <div class="d-flex w-100 h-100 justify-center mx-5 flex-column">
            <div>
                <v-btn :prepend-icon="'mdi-arrow-left'" @click="returnToTypingArea">
                        Go Back
                </v-btn>
            </div>
    
            <div class="w-100 d-flex">
                <!-- Yours -->
                 <div class="d-flex flex-column w-100 h-100">
                     <div class="w-100 d-flex text-h4 justify-center">
                        {{ userDetails.userName }}
                     </div>
                    <v-card class="w-100 my-5 py-5" elevation="3">
                        <typing-result
                            :line-chart-data="lineChartData"
                            :raw-line-chart-data="rawLineChartData"
                        ></typing-result>
                    </v-card>
                    <div class="w-100 d-flex justify-center text-h5">
                        Typing speed: {{ Math.round(lineChartData[lineChartData.length - 1]) }} WPM!
                    </div>
                 </div>
                <!-- Opponent -->
                 <div class="d-flex flex-column w-100 h-100">
                    <div class="w-100 text-h4 d-flex justify-center">
                        {{ oppName }}
                    </div>
                    <v-card class="w-100 my-5 py-5" elevation="3">
                        <div v-if="oppLineChartData.length === 0">
                            <div class="d-flex w-100 h-100 justify-center align-center">
                                <v-progress-circular indeterminate></v-progress-circular>
                            </div>
                        </div>
                        <div v-else>
                            <typing-result
                                :line-chart-data="oppLineChartData"
                                :raw-line-chart-data="oppRawLineChartData"
                            ></typing-result>
                        </div>
                    </v-card>
                    <div class="w-100 d-flex text-h5 justify-center">
                        Typing speed: {{ Math.round(oppLineChartData[oppLineChartData.length - 1]) }} WPM!
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import TypingResult from '../TypingResult.vue';
import { useUserDetailsStore } from '@/stores/userDetails';

export default defineComponent({
    components: { TypingResult },
    props: {
        oppName: {
            type: String,
            required: true,
        },
        lineChartData: {
            type: Array,
            required: true,
        },
        rawLineChartData: {
            type: Array,
            required: true,
        },
        oppLineChartData: {
            type: Array,
            required: true,
        },
        oppRawLineChartData: {
            type: Array,
            required: true,
        }
    },
    emits: ['navigate-to-pairing'],
    setup(props, { emit }) {
        const userDetails = useUserDetailsStore();

        const returnToTypingArea = () => {
            emit('navigate-to-pairing')
        }

        return {
            userDetails,
            returnToTypingArea
        }
    },
})
</script>
