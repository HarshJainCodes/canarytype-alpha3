<template>
    <div class="d-flex flex-column w-100 h-100">
        <div class="d-flex w-100 text-h6 justify-center">
            Welcome {{ userName}}
        </div>
        <div class="d-flex w-100 h-100 py-5 overflow-hidden">
            <div class="d-flex w-25 h-100 flex-column">
                <div class="d-flex flex-column w-100" style="border: 2px solid tomato;">
                    <div class="text-h6 w-100 text-center">
                        Single Player
                    </div>
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
                                                <v-btn class="w-100" @click="setCurrSelectedSubmission({type: 'singleplayer', submission })">
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
                
                <div class="d-flex w-100 flex-column" style="border: 2px solid springgreen;">
                    <div class="text-h6 w-100 text-center">
                        Multiplayer
                    </div>
                    <v-list>
                        <v-list-group v-for="(onlineMatch, index) in userOnlineMatchesByDate" :key="index">
                            <template #activator="{ props }">
                                <v-list-item v-bind="props">
                                    {{ onlineMatch[0].matchDate.split("T")[0] }}
                                </v-list-item>
                            </template>

                            <v-list-item>
                                <v-card class="d-flex w-100 flex-column elevation-10">
                                    <v-card-text>
                                        <v-timeline side="end" class="w-100">
                                            <v-timeline-item v-for="(submission, index) in onlineMatch" :key="index" dot-color="green" class="w-100" elevation="10">
                                                <v-btn class="w-100" @click="setCurrSelectedSubmission({type: 'multiplayer', submission})">
                                                    <div class="text-h6">
                                                        {{ submission.player1Name }} vs {{ submission.player2Name }}
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
            </div>

            <div class="d-flex w-75 h-100 elevation-10 mx-5">
                <typing-result v-if="currSelectedSubmission.type === 'singleplayer'" :line-chart-data="currSelectedSubmission.submission.typingSpeedPerSecond" :raw-line-chart-data="currSelectedSubmission.submission.rawTypingSpeedPerSecond">
                </typing-result>

                <multiplayer-result-display v-if="currSelectedSubmission.type === 'multiplayer'"
                    no-go-back
                    :opp-name="currSelectedSubmission.submission.player1Name === userName ? currSelectedSubmission.submission.player2Name : currSelectedSubmission.submission.player1Name"
                    :line-chart-data="currSelectedSubmission.submission.player1Name === userName ? currSelectedSubmission.submission.player1Submissions : currSelectedSubmission.submission.player2Submissions"
                    :raw-line-chart-data="currSelectedSubmission.submission.player1Name === userName ? currSelectedSubmission.submission.player1SubmissionsRaw: currSelectedSubmission.submission.player2SubmissionsRaw"
                    :opp-line-chart-data="currSelectedSubmission.submission.player1Name === userName ? currSelectedSubmission.submission.player2Submissions: currSelectedSubmission.submission.player1Submissions"
                    :opp-raw-line-chart-data="currSelectedSubmission.submission.player1Name === userName ? currSelectedSubmission.submission.player2SubmissionsRaw : currSelectedSubmission.submission.player1SubmissionsRaw"
                >
                </multiplayer-result-display>

            </div>
        </div>
    </div>
</template>

<script>
import { computed, defineComponent, onActivated, ref, watch } from 'vue'
import { useRoute } from 'vue-router';
import TypingResult from '@/components/TypingResult.vue';
import MultiplayerResultDisplay from '@/components/Multiplayer/MultiplayerResultDisplay.vue';

export default defineComponent({
    components: { TypingResult, MultiplayerResultDisplay },
    setup() {
        const route = useRoute();
        const userSubmissions = ref([]);
        const userOnlineMatches = ref([]);
        const currSelectedSubmission = ref({})

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

        const userOnlineMatchesByDate = computed(() => {
            console.log(userOnlineMatches.value);
            const r =  userOnlineMatches.value.reduce((acc, current) => {
                const date = current.matchDate.split("T")[0];
                if (!acc[date]) {
                    acc[date] = [];
                }
                acc[date].push(current);
                return acc;
            }, {})

            console.log(r);
            return r;
        })

        const setCurrSelectedSubmission = (submission) => {
            currSelectedSubmission.value = submission;
        }

        const fetchUserOnlineSubmissionFromBackend = async () => {
            const call = await fetch(`https://canarytype-alpha3.azurewebsites.net/api/TypingArena/UserOnlineMatches/${userName.value}`, {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            });

            if (call.status == 200) {
                userOnlineMatches.value = await call.json();
            }
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
            fetchUserOnlineSubmissionFromBackend()
        })

        return { 
            userName,
            userSubmissions,
            userSubmissionsByDate,
            userOnlineMatchesByDate,
            currSelectedSubmission,
            setCurrSelectedSubmission
        }
    },
})
</script>
