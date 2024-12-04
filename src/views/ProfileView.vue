<template>
    <div class="w-100 h-100 background-image">
        <v-row class="w-100 h-100" justify="center" align-content="center">
            <v-col cols="3" class="w-100 h-100 pa-6">
                <v-card class="w-100 h-100 elevation-10">
                    <div class="d-flex w-100 pa-5 justify-center">
                        <v-img class="w-25 rounded-lg" rounded :src="userDetails.userProfilePicUrl" alt="user profile pic">
                        </v-img>
    
                        <div class="d-flex flex-column w-75 px-5">
                            <div class="text-h5">
                                {{ userName }}
                            </div>
    
                            <v-spacer></v-spacer>
    
                            <div class="d-flex">
                                <div class="text-h6">
                                    Rank &nbsp;
                                </div>
                                <div class="text-h6">
                                    23
                                </div>
                            </div>
                        </div>
                    </div>
    
                    <div class="w-100 pa-5">
                        <v-btn class="w-100" color="green" variant="tonal">
                            Edit Profile
                        </v-btn>
                    </div>
                </v-card>
            </v-col>

            <v-col cols="6" class="w-100 h-100 d-flex justify-center align-center " justify="center">
                <v-row class="w-100 h-100">
                    <v-col cols="6" class="w-100" style="height: 20%;">
                        <v-card class="w-100 h-100 elevation-6 pa-5">
                            <div class="d-flex flex-wrap justify-center">
                                <v-chip class="ma-1" variant="outlined" label color="blue" @click="() => {}">
                                    <span class="text-h6">
                                        Personal Best
                                    </span>
                                    <v-tooltip :text="'Calculated as your best score from all your single player submissions'"
                                               content-class="bg-blue-lighten-1"
                                               max-width="300px"
                                               location="top">
                                        <template #activator="{ props }">
                                            <span v-bind="props" class="mx-1 d-flex align-center">
                                                <v-icon icon="mdi-information-outline" size="medium" color="blue">
                                                </v-icon>
                                            </span>
                                        </template>
                                    </v-tooltip>
                                    <span class="text-h6">
                                        {{ userDetails.personalBestWPM }} WPM
                                    </span>
                                </v-chip>
        
                                <v-chip class="ma-1" variant="outlined" label color="purple" @click="() => {}">
                                    <span class="text-h6">
                                        Average WPM
                                    </span>
                                    <v-tooltip :text="'Calculated as average over last 10 submissions'"
                                               content-class="bg-deep-purple-lighten-1"
                                               max-width="300px"
                                               location="top">
                                        <template #activator="{ props }">
                                            <span v-bind="props" class="mx-1 d-flex align-center">
                                                <v-icon icon="mdi-information-outline" size="medium" color="purple">
                
                                                </v-icon>
                                            </span>
                                        </template>
                                    </v-tooltip>
                                    <span class="text-h6">
                                        {{ userDetails.averageWPM }} WPM
                                    </span>
                                </v-chip>
    
                                <v-chip class="ma-1" variant="outlined" label color="pink" @click="() => {}">
                                    <span class="text-h6">
                                        Rank: 12
                                    </span>
                                </v-chip>

                                <v-chip class="ma-1" variant="outlined" color="teal-darken-1" label @click="() => {}">
                                    <span class="text-h6">
                                        Better then 84%
                                    </span>
                                </v-chip>
                            </div>
                        </v-card>
                    </v-col>

                    <v-col cols="6" class="w-100" style="height: 20%">
                        <v-card class="w-100 h-100 elevation-6">

                        </v-card>
                    </v-col>

                    <v-col cols="12" class="w-100" style="height: 20%">
                        <v-card class="w-100 h-100 elevation-6 pa-3">
                            <contribution-graph :dates-contributed="datesFrequency"></contribution-graph>
                        </v-card>
                    </v-col>
                    <v-col cols="12" class="w-100 overflow pa-1" style="height: 60%;">
                        <v-card class="d-flex flex-column w-100 h-100 elevation-6">
                            <div class="w-100">
                                <div class="w-100 d-flex justify-center">
                                    <v-tabs v-model="tabIndex">
                                        <v-tab>
                                            Single Player
                                        </v-tab>
                                        <v-tab>
                                            Multiplayer
                                        </v-tab>
                                    </v-tabs>
                                </div>
                            </div>
                            <div class="w-100 h-100">
                                <v-window class="w-100 h-100" v-model="tabIndex">
                                    <v-window-item class="w-100 h-100">
                                        <div class="d-flex w-100 h-100 pa-3">
                                            <div class="w-33 h-100">
                                                <show-match-history class="w-100 h-100" 
                                                                    :user-submissions-by-date="userSubmissionsByDate"
                                                                    @select-user-submission="onSelectUserSubmission"
                                                ></show-match-history>
                                            </div>
    
                                            <div class="w-66 h-100">
                                                <v-card class="w-100 h-100 d-flex align-center elevation-4">
                                                    <typing-result
                                                        v-if="currSelectedSubmission"
                                                        :line-chart-data="currSelectedSubmission.typingSpeedPerSecond"
                                                        :raw-line-chart-data="currSelectedSubmission.rawTypingSpeedPerSecond"
                                                    >
                                                    </typing-result>
                                                </v-card>
                                            </div>
                                        </div>
                                    </v-window-item>

                                    <v-window-item class="w-100 h-100">
                                        <div class="d-flex w-100 h-100 pa-3">
                                            <div class="w-33 h-100">
                                                <show-multiplayer-history class="w-100 h-100" 
                                                                          :user-online-matches-by-date="userOnlineMatchesByDate"
                                                                          @select-online-match = "onSelectOnlineMatch"
                                                ></show-multiplayer-history>
                                            </div>

                                            <div class="w-66 h-100">
                                                <v-card class="w-100 h-100 d-flex justify-center align-center elevation-4">
                                                    <v-dialog class="w-100 h-100 d-flex justify-center">
                                                        <template #activator="{ props }">
                                                            <div v-if="currOnlineSelectedMatch" class="w-100 h-25 d-flex flex-column justify-center align-center">
                                                                <div class="text-h5 text-center">
                                                                    {{ userName }} VS {{ currOnlineSelectedMatch.player1Name === userName
                                                                        ? currOnlineSelectedMatch.player2Name
                                                                        : currOnlineSelectedMatch.player1Name }}
                                                                </div>
                                                                <v-spacer></v-spacer>
                                                                <v-btn v-bind="props" class="d-flex align-center w-50">
                                                                    View Result
                                                                </v-btn>
                                                            </div>
                                                        </template>

                                                        <template #default>
                                                            <div class="d-flex justify-center">
                                                                <v-card class="elevation-5 pa-10" style="width: 80%;">
                                                                    <multiplayer-result-display v-if="currOnlineSelectedMatch"
                                                                                                no-go-back
                                                                                                :opp-name="
                                                                                                    currOnlineSelectedMatch.player1Name === userName
                                                                                                        ? currOnlineSelectedMatch.player2Name
                                                                                                        : currOnlineSelectedMatch.player1Name
                                                                                                "
                                                                                                :line-chart-data="
                                                                                                    currOnlineSelectedMatch.player1Name === userName
                                                                                                        ? currOnlineSelectedMatch.player1Submissions
                                                                                                        : currOnlineSelectedMatch.player2Submissions
                                                                                                "
                                                                                                :raw-line-chart-data="
                                                                                                    currOnlineSelectedMatch.player1Name === userName
                                                                                                        ? currOnlineSelectedMatch.player1SubmissionsRaw
                                                                                                        : currOnlineSelectedMatch.player2SubmissionsRaw
                                                                                                "
                                                                                                :opp-line-chart-data="
                                                                                                    currOnlineSelectedMatch.player1Name === userName
                                                                                                        ? currOnlineSelectedMatch.player2Submissions
                                                                                                        : currOnlineSelectedMatch.player1Submissions
                                                                                                "
                                                                                                :opp-raw-line-chart-data="
                                                                                                    currOnlineSelectedMatch.player1Name === userName
                                                                                                        ? currOnlineSelectedMatch.player2SubmissionsRaw
                                                                                                        : currOnlineSelectedMatch.player1SubmissionsRaw
                                                                                                "
                                                                    >
                
                                                                    </multiplayer-result-display>
                                                                </v-card>
                                                            </div>
                                                        </template>
                                                    </v-dialog>
                                                </v-card>
                                            </div>
                                        </div>
                                    </v-window-item>
                                </v-window>
                            </div>
                        </v-card>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </div>
</template>

<script>
import { computed, defineComponent, onActivated, ref } from 'vue'
import { useRoute } from 'vue-router'
import TypingResult from '@/components/TypingResult.vue'
import MultiplayerResultDisplay from '@/components/Multiplayer/MultiplayerResultDisplay.vue'
import { useUserDetailsStore } from '@/stores/userDetails'
import ContributionGraph from '@/components/ContributionGraph.vue'
import ShowMatchHistory from '@/components/ShowMatchHistory.vue'
import ShowMultiplayerHistory from '@/components/ShowMultiplayerHistory.vue'

export default defineComponent({
    components: { TypingResult, MultiplayerResultDisplay, ContributionGraph, ShowMatchHistory, ShowMultiplayerHistory },
    setup() {
        const userDetails = useUserDetailsStore()
        const route = useRoute()
        const userSubmissions = ref([])
        const userOnlineMatches = ref([])
        const currSelectedSubmission = ref(null)
        const currOnlineSelectedMatch = ref(null)
        const tabIndex = ref(0)

        const userName = computed(() => route.params.username)

        const userSubmissionsByDate = computed(() => {
            const reducedUserSubmission = userSubmissions.value.reduce((acc, current) => {
                const date = current.submissionDate.split('T')[0]
                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(current)
                return acc
            }, {})

            const sortedByKeys = Object.keys(reducedUserSubmission).sort((dateA, dateB) => new Date(dateB) - new Date(dateA)).reduce((acc, key) => {
                acc[key] = reducedUserSubmission[key]
                return acc;
            }, {})

            return sortedByKeys
        })

        const userOnlineMatchesByDate = computed(() => {
            const r = userOnlineMatches.value.reduce((acc, current) => {
                const date = current.matchDate.split('T')[0]
                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(current)
                return acc
            }, {})
            console.log(r);
            return r
        })

        const datesFrequency = computed(() => userSubmissions.value.reduce((acc, entry) => {
            const date = entry.submissionDate.split("T")[0]
            acc[date] = (acc[date] || 0) + 1
            return acc
        }, {}))

        const onSelectUserSubmission = (submission) => {
            currSelectedSubmission.value = submission
        }

        const onSelectOnlineMatch = (match) => {
            console.log('curr online selected match', match);
            currOnlineSelectedMatch.value = match
        }

        const fetchUserProfileStats = async () => {
            const call = await fetch(`https://canarytype-alpha3.azurewebsites.net/api/UserStats/GetStat?UserName=${userName.value}`)

            if (call.status === 200){
                const res = await call.json();
                userDetails.personalBestWPM = res.personalBestSpeed;
                userDetails.averageWPM = res.averageSpeed;
                userDetails.userProfilePicUrl = res.profileURL;
            }
        }

        const fetchUserOnlineSubmissionFromBackend = async () => {
            const call = await fetch(
                `https://canarytype-alpha3.azurewebsites.net/api/TypingArena/UserOnlineMatches/${userName.value}`,
                {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }
            )

            if (call.status == 200) {
                userOnlineMatches.value = await call.json()
            }
        }

        const fetchUserSubmissionFromBackend = async () => {
            const call = await fetch(
                `https://canarytype-alpha3.azurewebsites.net/api/TypingArena/UserSubmission/${userName.value}`,
                {
                    headers: {
                        'Content-type': 'application/json; charset=UTF-8'
                    }
                }
            )

            if (call.status === 200) {
                userSubmissions.value = await call.json()
            }
        }

        onActivated(() => {
            fetchUserProfileStats()
            fetchUserSubmissionFromBackend()
            fetchUserOnlineSubmissionFromBackend()            
        })

        return {
            tabIndex,
            userDetails,
            datesFrequency,
            userName,
            userSubmissions,
            userSubmissionsByDate,
            userOnlineMatchesByDate,
            currSelectedSubmission,
            currOnlineSelectedMatch,
            onSelectUserSubmission,
            onSelectOnlineMatch
        }
    }
})
</script>

<style lang="scss">
$tooltip-background-color: green;

.background-image{
    --opacity: 0.5;
    background-image: linear-gradient(-45deg, rgba(238, 118, 82, var(--opacity)), rgba(231, 60, 126, var(--opacity)), rgba(35, 166, 213, var(--opacity)), rgba(35, 213, 171, var(--opacity)));
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
}

@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>