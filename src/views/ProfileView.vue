<template>
    <!-- <div class="d-flex flex-column w-100 h-100">
        <div class="d-flex w-100 text-h6 justify-center">Welcome {{ userName }}</div>
        <div class="d-flex w-100 h-100 py-5 overflow-hidden">
            <div class="d-flex w-25 h-100 flex-column">
                <div class="d-flex flex-column w-100">
                    <div class="text-h6 w-100 text-center">Single Player</div>
                    <v-list>
                        <v-list-group v-for="(date, index) in userSubmissionsByDate" :key="index">
                            <template #activator="{ props }">
                                <v-list-item v-bind="props">
                                    {{ date[0].submissionDate.split('T')[0] }}
                                </v-list-item>
                            </template>
                            <v-list-item>
                                <v-card class="d-flex w-100 flex-column elevation-10">
                                    <v-card-text>
                                        <v-timeline side="end" class="w-100">
                                            <v-timeline-item
                                                v-for="(submission, index) in date"
                                                :key="index"
                                                dot-color="pink"
                                                class="w-100"
                                                elevation="10"
                                            >
                                                <v-btn
                                                    class="w-100"
                                                    @click="
                                                        setCurrSelectedSubmission({
                                                            type: 'singleplayer',
                                                            submission
                                                        })
                                                    "
                                                >
                                                    <div class="text-h6">
                                                        {{
                                                            submission.submissionDate
                                                                .split('T')[1]
                                                                .split('.')[0]
                                                        }}
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

                <div class="d-flex w-100 flex-column">
                    <div class="text-h6 w-100 text-center">Multiplayer</div>
                    <v-list>
                        <v-list-group
                            v-for="(onlineMatch, index) in userOnlineMatchesByDate"
                            :key="index"
                        >
                            <template #activator="{ props }">
                                <v-list-item v-bind="props">
                                    {{ onlineMatch[0].matchDate.split('T')[0] }}
                                </v-list-item>
                            </template>

                            <v-list-item>
                                <v-card class="d-flex w-100 flex-column elevation-10">
                                    <v-card-text>
                                        <v-timeline side="end" class="w-100">
                                            <v-timeline-item
                                                v-for="(submission, index) in onlineMatch"
                                                :key="index"
                                                dot-color="green"
                                                class="w-100"
                                                elevation="10"
                                            >
                                                <v-btn
                                                    class="w-100"
                                                    @click="
                                                        setCurrSelectedSubmission({
                                                            type: 'multiplayer',
                                                            submission
                                                        })
                                                    "
                                                >
                                                    <div class="text-h6">
                                                        {{ submission.player1Name }} vs
                                                        {{ submission.player2Name }}
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
                <typing-result
                    v-if="currSelectedSubmission.type === 'singleplayer'"
                    :line-chart-data="currSelectedSubmission.submission.typingSpeedPerSecond"
                    :raw-line-chart-data="currSelectedSubmission.submission.rawTypingSpeedPerSecond"
                >
                </typing-result>

                <multiplayer-result-display
                    v-if="currSelectedSubmission.type === 'multiplayer'"
                    no-go-back
                    :opp-name="
                        currSelectedSubmission.submission.player1Name === userName
                            ? currSelectedSubmission.submission.player2Name
                            : currSelectedSubmission.submission.player1Name
                    "
                    :line-chart-data="
                        currSelectedSubmission.submission.player1Name === userName
                            ? currSelectedSubmission.submission.player1Submissions
                            : currSelectedSubmission.submission.player2Submissions
                    "
                    :raw-line-chart-data="
                        currSelectedSubmission.submission.player1Name === userName
                            ? currSelectedSubmission.submission.player1SubmissionsRaw
                            : currSelectedSubmission.submission.player2SubmissionsRaw
                    "
                    :opp-line-chart-data="
                        currSelectedSubmission.submission.player1Name === userName
                            ? currSelectedSubmission.submission.player2Submissions
                            : currSelectedSubmission.submission.player1Submissions
                    "
                    :opp-raw-line-chart-data="
                        currSelectedSubmission.submission.player1Name === userName
                            ? currSelectedSubmission.submission.player2SubmissionsRaw
                            : currSelectedSubmission.submission.player1SubmissionsRaw
                    "
                >   
                </multiplayer-result-display>
            </div>
        </div>
    </div> -->

    <div class="w-100 h-100">
        <v-row class="w-100 h-100" justify="center">
            <v-col cols="3" class="w-100 h-100">
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

            <v-col cols="6" class="w-100 h-100 d-flex justify-center align-center" justify="center">
                <v-row class="w-100 h-100">
                    <v-col cols="6" class="w-100" style="height: 20%;">
                        <v-card class="w-100 h-100 elevation-6">

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
                    <v-col cols="12" class="w-100 overflow" style="height: 60%;">
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
                                                            <div class="w-100 h-25 d-flex flex-column justify-center align-center">
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
            return userSubmissions.value.reduce((acc, current) => {
                const date = current.submissionDate.split('T')[0]
                if (!acc[date]) {
                    acc[date] = []
                }
                acc[date].push(current)
                return acc
            }, {})
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

                console.log('online matches', userOnlineMatches.value)
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

<style>
activity-graph.github {
  --size: 10px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif,
    'Apple Color Emoji', 'Segoe UI Emoji';
  gap: 3px;
  border: 1px solid #d0d7de;
  border-radius: 0.375em;
  padding: 1em;
  display: inline-grid;
}

activity-graph.github::part(weekday-header),
activity-graph.github::part(month-header) {
  font-size: 12px;
}

activity-graph.github::part(weekday-header),
activity-graph.github::part(day) {
  height: var(--size);
  line-height: var(--size);
}

activity-graph.github::part(weekday-header) {
  padding-right: 0.25em;
}

activity-graph.github::part(weekday-header--even) {
  display: none;
}

activity-graph.github::part(month-header) {
  height: 13px;
  line-height: 13px;
}

activity-graph[month-limits='middle'].github::part(month-header) {
  text-align: center;
}

activity-graph.github::part(day) {
  border-radius: 2px;
  outline-offset: -1px;
  outline: 1px solid #1b1f230f;
  width: var(--size);
}

activity-graph.github::part(day--data-0) {
  background-color: #ebedf0;
}

activity-graph.github::part(day--data-1) {
  background-color: #9be9a8;
}

activity-graph.github::part(day--data-2) {
  background-color: #40c463;
}

activity-graph.github::part(day--data-3) {
  background-color: #30a14e;
}

activity-graph.github::part(day--data-4) {
  background-color: #216e39;
}

</style>