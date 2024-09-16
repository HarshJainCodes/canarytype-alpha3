<template>
    <div class="d-flex w-100 h-100" data-qa-id="typing-result-container">
        <div class="d-flex w-100 h-100 mx-5 flex-column justify-center">
            <div>
                <v-btn :prepend-icon="'mdi-arrow-left'" @click="returnToTypingArea(false)">
                    Type Again
                </v-btn>
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
                                    <div class="d-flex justify-center text-h5">
                                        {{ typingSpeed }} WPM!
                                    </div>
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
            <v-card
                v-if="!userDetails.isLoggedIn"
                class="d-flex justify-center"
                elevation="3"
                variant="outlined"
                color="red"
                to="/Login"
                data-qa-id="not-login-banner"
            >
                <div class="text-h6">Please Login to save your result</div>
            </v-card>
        </div>
    </div>
</template>

<script setup>
import { onActivated, ref } from 'vue';
import TypingResult from './TypingResult.vue'
import { useUserDetailsStore } from '@/stores/userDetails'
import { useToast } from 'vue-toastification';

const props = defineProps(['lineChartData', 'rawLineChartData', 'typingSpeed'])
const emit = defineEmits('update:typingFinished')

const userDetails = useUserDetailsStore()
const toast = useToast()

const resultSentToDB = ref(false);

onActivated(() => {
    if (!resultSentToDB.value && userDetails.isLoggedIn){
        sendDataToBackend();
    }
})

const returnToTypingArea = () => {
    resultSentToDB.value = false;
    emit('update:typingFinished', false)
}

const sendDataToBackend = async () => {
    const call = await fetch('https://canarytype-alpha3.azurewebsites.net/api/TypingArena/Submit', {
        method: 'POST',
        body: JSON.stringify({
            submissionDate: new Date(),
            score: props.typingSpeed,
            username: userDetails.userName,
            typingSpeedPerSecond: props.lineChartData,
            rawTypingSpeedPerSecond: props.rawLineChartData
        }),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        credentials: 'include'
    })

    if (call.status == 200){
        toast('Result Saved Successfully', {
            type: 'success'
        })
        resultSentToDB.value = true;
    } else if (call.status === 401) {
        userDetails.setIsLoggedIn(false);
        userDetails.userName = ''
    }
}
</script>
