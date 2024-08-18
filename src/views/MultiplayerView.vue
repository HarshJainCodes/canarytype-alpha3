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
                        v-model:typingFinished="typingFinished"
                        v-model:lineChartData="lineChartData"
                        v-model:rawLineChartData="rawLineChartData"
                        v-model:typingSpeed="typingSpeed"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { useUserDetailsStore } from '@/stores/userDetails';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { computed, defineComponent, onMounted, ref } from 'vue'
import TypingArea from '@/components/TypingArea.vue';
import TypingResultContainer from '@/components/TypingResultContainer.vue';

export default defineComponent({
    components: { TypingArea },
    setup() {
        const userDetails = useUserDetailsStore();

        const conn = ref();

        const roomId = ref('');
        const opponent = ref('')

        const typingFinished = ref(false)
        const lineChartData = ref([])
        const rawLineChartData = ref([])
        const typingSpeed = ref(0)

        const isSearchingForOpponent = ref(false);

        const joinChatRoom = async () => {
            console.log('joining chat room');

            try {
                conn.value = new HubConnectionBuilder()
                    // .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                    .withUrl("https://localhost:7161/Chat")
                    .configureLogging(LogLevel.Information)
                    .withAutomaticReconnect()
                    .build();

                conn.value.on("OnConnected", (msg) => {
                    console.log(msg);
                })

                conn.value.on("MatchStarted", (groupName, player1, player2) => {
                    console.log("the group formed is: ", groupName);
                    console.log("the match will be between player1: ", player1);
                    console.log("the match will be between player2: ", player2);
                    roomId.value = groupName;
                })

                conn.value.on("OnDisconnect", (msg) => {
                    console.log(msg);
                })

                await conn.value.start();
                await conn.value.invoke("JoinChat", {username: userDetails.userName, password: 'something'});
            } catch (e) {
                console.log(e)
            }
        }

        const onSearchButtonClicked = async () => {
            // try for a connection
            try {
                conn.value = new HubConnectionBuilder()
                    // .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                    .withUrl("https://localhost:7161/Chat")
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

                    console.log(player1)
                    console.log(player2)
                })

                await conn.value.start();
                await conn.value.invoke("JoinChat", {username: userDetails.userName, password: 'something'})
            } catch (e) {
                console.log(e);
            }
        }

        const currComponent = computed(() => {
            return typingFinished.value ? TypingResultContainer : TypingArea
        })

        const onCancelButtonClicked = () => {
            conn.value.stop();
            isSearchingForOpponent.value = false
        }

        const sendFinalSpeed = async (UserName, speed) => {
            conn.value.invoke("SendFinalSpeed", UserName, speed)
        }

        onMounted(() => {
            userDetails.preventUnauthorizedRouteNavigation()
        })

        return {
            userDetails,
            typingFinished,
            lineChartData,
            rawLineChartData,
            typingSpeed,
            opponent,
            isSearchingForOpponent,
            currComponent,
            roomId,
            joinChatRoom,
            sendFinalSpeed,
            onSearchButtonClicked,
            onCancelButtonClicked,
        }
    },
})
</script>
