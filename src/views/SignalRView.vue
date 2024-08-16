<template>
    <div class="w-100 h-100 d-flex justify-center align-center">
        <div class="d-flex w-50 flex-column">
            <div class="text-h4">
                <v-text-field label="UserName" v-model="userName">
                </v-text-field>
                <v-text-field label="ChatRoomName" v-model="chatRoomName">
                </v-text-field>
            </div>
            <div class="d-flex justify-center w-100">
                <v-btn @click="joinChatRoom(userName, chatRoomName)">
                    Join Chat Room
                </v-btn>
            </div>
        </div>
    </div>
</template>

<script>
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { defineComponent, ref } from 'vue'

export default defineComponent({
    setup() {
        const conn = ref();
        const userName = ref();
        const chatRoomName = ref();

        const joinChatRoom = async (username, chatRoom) => {
            console.log('joining chat room');

            try {
                conn.value = new HubConnectionBuilder()
                    .withUrl("https://canarytype-alpha3.azurewebsites.net/Chat")
                    // .withUrl("https://localhost:7161/Chat")
                    .configureLogging(LogLevel.Information)
                    .build();

                conn.value.on("JoinSpecificChatRoom", (username, msg, allUsers) => {
                    console.log('username: ', username);
                    console.log('msg: ', msg);
                    console.log('allUsers: ', allUsers);
                })

                await conn.value.start();
                await conn.value.invoke("JoinSpecificChatRoom", {username, chatRoom});
            } catch (e) {
                console.log(e)
            }
        }

        return {
            joinChatRoom,
            userName,
            chatRoomName
        }
    },
})
</script>
