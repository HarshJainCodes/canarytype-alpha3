<template>
    <div class="w-100 h-100 d-flex pa-5 justify-center">
        <div class="d-flex w-100 h-100">
            <div v-if="!roomId" class="d-flex w-100 h-100">
                <div class="d-flex w-25 h-100 ">
                    <div class="d-flex w-100 h-100 flex-column align-center justify-center">
                        <div>
                            <v-icon size="100" icon="mdi-fencing">
                            </v-icon>
                        </div>
                        <div class="d-flex text-h5 align-center pa-5">
                            Play with random person online
                        </div>
                        <v-btn v-if="!isSearchingForOpponent" variant="outlined" @click="onSearchButtonClicked">
                            Play Online
                        </v-btn>
                        <v-btn v-else variant="outlined" @click="onCancelButtonClicked">
                            Cancel
                        </v-btn>
                    </div>
                </div>

                <v-divider vertical :thickness="5" color="green"/>
                <div class="w-75 h-100">
                    <div v-if="isSearchingForOpponent" class="w-100 h-100 d-flex justify-center align-center flex-column">
                        <div class="text-h5">
                            Searching for opponent
                        </div>

                        <v-progress-circular indeterminate/>
                    </div>
                </div>
            </div>
            <div class="d-flex w-100 h-100" v-else>
                <div class="d-flex w-100 h-100 flex-column">
                    <div class="w-100 d-flex justify-center text-h4">
                        {{ userDetails.userName }} VS {{ opponent }}
                    </div>

                    <component
                        class="w-100 h-100"
                        :is="currComponent"
                        :mode="'multiplayer'"
                        :opp-name="opponent"
                        v-model:typingFinished="typingFinished"
                        v-model:lineChartData="lineChartData"
                        v-model:rawLineChartData="rawLineChartData"
                        :opp-line-chart-data="oppLineChartData"
                        :opp-raw-line-chart-data="oppRawLineChartData"
                        v-model:typingSpeed="typingSpeed"
                        @navigate-to-pairing="navigateToPairing"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useUserDetailsStore } from '@/stores/userDetails';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import TypingArea from '@/components/TypingArea.vue';
import TypingResultContainer from '@/components/TypingResultContainer.vue';
import MultiplayerResultDisplay from '@/components/Multiplayer/MultiplayerResultDisplay.vue';

export default defineComponent({
    components: { TypingArea, TypingResultContainer, MultiplayerResultDisplay },
    setup() {
        const userDetails = useUserDetailsStore();

        const conn = ref();

        const roomId = ref('');
        const opponent = ref('')

        const typingFinished = ref(false)
        const lineChartData = ref([])
        const rawLineChartData = ref([])
        const oppLineChartData = ref([])
        const oppRawLineChartData = ref([])
        const typingSpeed = ref(0)

        const isSearchingForOpponent = ref(false);

        const onSearchButtonClicked = async () => {
            // try for a connection
            try {
                conn.value = new HubConnectionBuilder()
                    .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                    // .withUrl("https://localhost:7161/Chat")
                    .configureLogging(LogLevel.Information)
                    .withAutomaticReconnect()
                    .build();

                conn.value.on("OnConnected", () => {
                    isSearchingForOpponent.value = true;
                    console.log('connected to the server');
                })

                conn.value.on("MatchStarted", (groupName, player1, player2) => {
                    roomId.value = groupName;
                    if (player1.userName === userDetails.userName) {
                        opponent.value = player2.userName;
                    } else {
                        opponent.value = player1.userName;
                    }
                })

                conn.value.on("MatchResult", (matchInfo) => {
                    console.log(matchInfo);
                    if (matchInfo.player1Name === userDetails.userName) {
                        oppLineChartData.value = matchInfo.player2Submissions
                        oppRawLineChartData.value = matchInfo.player2SubmissionsRaw
                    } else {
                        oppLineChartData.value = matchInfo.player1Submissions
                        oppRawLineChartData.value = matchInfo.player1SubmissionsRaw
                    }
                })

                await conn.value.start();
                await conn.value.invoke("JoinChat", {username: userDetails.userName, password: 'something'})
                userDetails.isPlayingMultiplayer = true;
            } catch (e) {
                console.log(e);
            }
        }

        const currComponent = computed(() => {
            return typingFinished.value ? MultiplayerResultDisplay : TypingArea
        })

        const navigateToPairing = () => {
            roomId.value = '';
            isSearchingForOpponent.value = false;
            typingFinished.value = false;
            userDetails.isPlayingMultiplayer = false
            lineChartData.value = []
            rawLineChartData.value = []
            oppLineChartData.value = []
            oppRawLineChartData.value = []
        }

        watch(typingFinished, async (newVal) => {
            if (newVal) {
                if (lineChartData.value.length) {
                    await conn.value.invoke("ClientSubmitResult", roomId.value, userDetails.userName, lineChartData.value, rawLineChartData.value);
                }
            }
        })

        const onCancelButtonClicked = () => {
            conn.value.stop();
            isSearchingForOpponent.value = false
            userDetails.isPlayingMultiplayer = false
        }

        onMounted(() => {
            userDetails.preventUnauthorizedRouteNavigation()
        })

        return {
            userDetails,
            typingFinished,
            lineChartData,
            rawLineChartData,
            oppLineChartData,
            oppRawLineChartData,
            typingSpeed,
            opponent,
            isSearchingForOpponent,
            currComponent,
            roomId,
            onSearchButtonClicked,
            onCancelButtonClicked,
            navigateToPairing,
        }
    },
})
</script>
