<template>
    <div class="w-100 h-100 d-flex pa-5 justify-center">
        <div v-if="shouldLoad" class="d-flex w-100 h-100">
            <div v-if="!roomId" class="d-flex w-100 h-100">
                <div class="d-flex w-25 h-100 ">
                    <div class="d-flex w-100 h-100 flex-column align-center justify-center">
                        <div>
                            <v-icon size="100" icon="mdi-sword">
                            </v-icon>
                        </div>
                        <div class="d-flex text-h5 align-center pa-5">
                            Play with random person online
                        </div>
                        <v-btn v-if="!isSearchingForOpponent" variant="outlined" @click="onSearchButtonClicked" :disabled="isHostingPrivateRoom || isJoiningPrivateRoom">
                            Play Online
                        </v-btn>
                        <v-btn v-else variant="outlined" @click="onCancelButtonClicked">
                            Cancel
                        </v-btn>
                        <v-divider class="w-100 mt-5" />
                        <div class="my-5 d-flex flex-column">
                            <div class="d-flex justify-center">
                                <v-icon size="100" icon="mdi-sword-cross"></v-icon>
                            </div>
                            <div v-if="isHostingPrivateRoom && privateRoomIdToShare">
                                <div class="text-h6 pa-5" style="border: 2px solid green; border-radius: 5px">
                                    Join using this code - {{ privateRoomIdToShare }}
                                </div>
                            </div>
                            <v-btn variant="outlined" class="my-4" @click="onClickPrivateRoom" :disabled="isSearchingForOpponent || isJoiningPrivateRoom">
                                <div v-if="!isHostingPrivateRoom">
                                    Create Private Room
                                </div>
                                <div v-else>
                                    Cancel
                                </div>
                            </v-btn>
                            <div v-if="isJoiningPrivateRoom" class="w-100 h-100 d-flex flex-row align-center justify-center">
                                <div class="w-100 d-flex">
                                    <v-text-field class="w-100" label="Enter Room Code" v-model="privateRoomText">
                                        <template #append>
                                            <v-btn icon="mdi-arrow-right" density="comfortable" @click="onClickJoinWithCode">
                                            </v-btn>
                                        </template>
                                    </v-text-field>
                                </div>
                            </div>
                            <v-btn variant="outlined" @click="onClickJoinPrivateRoom" :disabled="isSearchingForOpponent || isHostingPrivateRoom">
                                <div v-if="!isJoiningPrivateRoom">
                                    Join Private Room
                                </div>
                                <div v-else>
                                    Cancel
                                </div>
                            </v-btn>
                        </div>
                    </div>
                </div>

                <v-divider vertical :thickness="5" color="green" class="mx-5"/>
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
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { computed, defineComponent, onMounted, Ref, ref, watch } from 'vue'
import TypingArea from '@/components/TypingArea.vue';
import TypingResultContainer from '@/components/TypingResultContainer.vue';
import MultiplayerResultDisplay from '@/components/Multiplayer/MultiplayerResultDisplay.vue';
import { useToast } from 'vue-toastification';

export default defineComponent({
    components: { TypingArea, TypingResultContainer, MultiplayerResultDisplay },
    setup() {
        const toast = useToast()
        const userDetails = useUserDetailsStore();

        const conn: Ref<HubConnection> = ref();

        const roomId = ref('');
        const opponent = ref('')

        const typingFinished = ref(false)
        const lineChartData = ref([])
        const rawLineChartData = ref([])
        const oppLineChartData = ref([])
        const oppRawLineChartData = ref([])
        const typingSpeed = ref(0)

        const isSearchingForOpponent = ref(false);

        // private room
        const isHostingPrivateRoom = ref(false);
        const privateRoomIdToShare: Ref<String> = ref('');

        const isJoiningPrivateRoom = ref(false);
        const privateRoomText = ref('');

        const shouldLoad = ref(false);

        const onClickJoinWithCode = async () => {
            // first need to check if a room exists with the given code

            try {
                if (conn.value) {
                    // this is the case when the button is clicked two times, in that case need to close previous connection
                    conn.value.stop();
                }
                conn.value = new HubConnectionBuilder()
                    .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                    // .withUrl("https://localhost:7161/Chat")
                    .configureLogging(LogLevel.Information)
                    .withAutomaticReconnect()
                    .build()

                conn.value.on("PrivateRoomNotExists", exists => {
                    if (!exists){
                        toast("Invalid Room Id", {
                            type: 'error',
                        })
                    }
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
                await conn.value.invoke("JoinPrivateRoomWithCode", { userName: userDetails.userName, roomCode: privateRoomText.value })
            } catch(e) {
                console.log(e);
            }
        }

        const onClickJoinPrivateRoom = async () => {
            if (isJoiningPrivateRoom.value === false) {
                isJoiningPrivateRoom.value = true;
                userDetails.isPlayingMultiplayer = true;
            } else {
                isJoiningPrivateRoom.value = false;
                userDetails.isPlayingMultiplayer = false;
                conn.value.stop();
            }
        }

        const onClickPrivateRoom = async () => {
            if (isHostingPrivateRoom.value === false) {
                isHostingPrivateRoom.value = true;
                userDetails.isPlayingMultiplayer = true;

                try {
                    conn.value = new HubConnectionBuilder()
                        .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                        // .withUrl("https://localhost:7161/Chat")
                        .configureLogging(LogLevel.Information)
                        .withAutomaticReconnect()
                        .build();
    
                    conn.value.on("PrivateRoomCode", (roomId) => {
                        privateRoomIdToShare.value = roomId;
    
                        console.log('share this code with others to join the room : ', roomId);
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
                    console.log('starting connection');
                    await conn.value.invoke('CreatePrivateRoom', { username: userDetails.userName });
                } catch(e) {
                    console.log(e);
                }
            } else {
                await conn.value.stop();
                isHostingPrivateRoom.value = false;
                userDetails.isPlayingMultiplayer = false
                privateRoomIdToShare.value = ''
            }
        }

        const onSearchButtonClicked = async () => {
            // try for a connection
            isSearchingForOpponent.value = true;
            userDetails.isPlayingMultiplayer = true;

            try {
                conn.value = new HubConnectionBuilder()
                    .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                    // .withUrl("https://localhost:7161/Chat")
                    .configureLogging(LogLevel.Information)
                    .withAutomaticReconnect()
                    .build();

                conn.value.on("OnConnected", () => {
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
            } catch (e) {
                console.log(e);
                isSearchingForOpponent.value = false;
                userDetails.isPlayingMultiplayer = false
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
            isHostingPrivateRoom.value = false;
            isJoiningPrivateRoom.value = false;
            privateRoomText.value = '';
            privateRoomIdToShare.value = '';
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

        onMounted(async () => {
            shouldLoad.value = false;
            await userDetails.preventUnauthorizedRouteNavigation()
            shouldLoad.value = true;
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
            privateRoomText,
            isJoiningPrivateRoom,
            isHostingPrivateRoom,
            privateRoomIdToShare,
            shouldLoad,
            onClickJoinWithCode,
            onClickJoinPrivateRoom,
            onClickPrivateRoom,
            onSearchButtonClicked,
            onCancelButtonClicked,
            navigateToPairing,
        }
    },
})
</script>
