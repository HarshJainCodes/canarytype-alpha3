<template>
    Welcome {{ userName }}

    <v-list>
        <v-list-group v-for="(submission, index) in userSubmissions" :key="index">
            <template #activator="{ props }">
                <v-list-item v-bind="props" :title="submission.submissionDate">
                </v-list-item>
            </template>

            <div>
                <typing-result class="w-50 h-50" :line-chart-data="submission.typingSpeedPerSecond" :raw-line-chart-data="submission.rawTypingSpeedPerSecond"></typing-result>
            </div>
        </v-list-group>
    </v-list>
</template>

<script>
import { defineComponent, onActivated, ref } from 'vue'
import { useRoute } from 'vue-router';
import TypingResult from '@/components/TypingResult.vue';

export default defineComponent({
    components: { TypingResult },
    setup() {
        const route = useRoute();
        const userSubmissions = ref([]);

        const userName = route.params.username;

        onActivated(async () => {
            const call = await fetch(`https://canarytype-alpha3.azurewebsites.net/api/TypingArena/UserSubmission/${userName}`, {
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
            })

            if (call.status === 200) {
                userSubmissions.value = await call.json()
            }
        })

        return { 
            userName,
            userSubmissions
        }
    },
})
</script>
