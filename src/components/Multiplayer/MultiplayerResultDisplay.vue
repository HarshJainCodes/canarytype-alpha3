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
                <v-card class="w-100 my-5 mr-5 py-5" elevation="3">
                    <typing-result
                        :line-chart-data="lineChartData"
                        :raw-line-chart-data="rawLineChartData"
                    ></typing-result>
                </v-card>
                <!-- Opponent -->
                <v-card class="w-100 my-5 py-5 ml-5" elevation="3">
                    <div v-if="oppLineChartData.length === 0">
                        <div class="d-flex w-100 h-100 justify-center align-center">
                            <v-progress-circular indeterminate></v-progress-circular>
                        </div>
                    </div>
                    <typing-result
                        v-else
                        :line-chart-data="oppLineChartData"
                        :raw-line-chart-data="oppRawLineChartData"
                    ></typing-result>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue'
import TypingResult from '../TypingResult.vue';

export default defineComponent({
    components: { TypingResult },
    props: {
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
        const returnToTypingArea = () => {
            emit('navigate-to-pairing')
        }

        return {
            returnToTypingArea
        }
    },
})
</script>
