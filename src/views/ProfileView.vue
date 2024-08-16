<template>
    <div class="d-flex flex-column w-100 h-100">
        <div class="d-flex w-100 text-h6 justify-center">
            Welcome {{ userName}}
        </div>
        <div class="d-flex w-100 h-100 py-5 overflow-hidden">
            <div class="d-flex flex-column w-25 h-100">
                <v-list>
                    <v-list-group v-for="(date, index) in userSubmissionsByDate" :key="index">
                        <template #activator="{ props }">
                            <v-list-item v-bind="props">
                                {{ date[0].submissionDate.split("T")[0] }}
                            </v-list-item>
                        </template>
                        <v-list-item>
                            <v-card class="d-flex w-100 flex-column elevation-10">
                                <v-card-text>
                                    <v-timeline side="end" class="w-100">
                                        <v-timeline-item v-for="(submission, index) in date" :key="index" dot-color="pink" class="w-100" elevation="10">
                                            <v-btn class="w-100" @click="setCurrSelectedSubmission(submission)">
                                                <div class="text-h6">
                                                    {{ submission.submissionDate.split("T")[1].split(".")[0]}}
                                                </div>
                                            </v-btn>
                                        </v-timeline-item>
                                    </v-timeline>
                                </v-card-text>
                            </v-card>
                        </v-list-item>
                    </v-list-group>
                </v-list>
            </div>                    

            <div class="d-flex w-75 h-100 elevation-10 mx-5">
                <typing-result v-if="currSelectedSubmission" :line-chart-data="currSelectedSubmission.typingSpeedPerSecond" :raw-line-chart-data="currSelectedSubmission.rawTypingSpeedPerSecond">
                </typing-result>
            </div>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, onActivated, ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import TypingResult from '@/components/TypingResult.vue';

export default defineComponent({
    components: { TypingResult },
    setup() {
        const route = useRoute();
        const userSubmissions = ref([]);
        const currSelectedSubmission = ref()

        const userName = computed(() => route.params.username);

        const userSubmissionsByDate = computed(() => {
            return userSubmissions.value.reduce((acc, current) => {
                const date = current.submissionDate.split("T")[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(current);
                return acc;
            }, {})
        })

        const setCurrSelectedSubmission = (submission) => {
            currSelectedSubmission.value = submission;
        }

        const fetchUserSubmissionFromBackend = async () => {
            const call = await fetch(`https://canarytype-alpha3.azurewebsites.net/api/TypingArena/UserSubmission/${userName.value}`, {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            })

            if (call.status === 200) {
                userSubmissions.value = await call.json()
            }
        }

        onActivated(async () => {
            fetchUserSubmissionFromBackend()
        })

        watch(userName, () => {
            fetchUserSubmissionFromBackend()
        })

        return { 
            userName,
            userSubmissions,
            userSubmissionsByDate,
            currSelectedSubmission,
            setCurrSelectedSubmission
        }
    },
})
</script>
