import { defineStore } from 'pinia'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserDetailsStore = defineStore('userDetails', () => {
    const router = useRouter()
    const userName = ref('')
    const uniqueUserName = ref('')
    const userProfilePicUrl = ref('')

    const isLoggedIn = ref(false)
    const isPlayingMultiplayer = ref(false)

    function setIsLoggedIn(val) {
        isLoggedIn.value = val
    }

    async function preventUnauthorizedRouteNavigation() {
        const loginCheckCall = await fetch(
            'https://canarytype-alpha3.azurewebsites.net/api/TypingArena/CheckLogin',
            //'https://localhost:7161/api/TypingArena/CheckLogin',
            {
                credentials: 'include'
            }
        )

        if (loginCheckCall.status === 401) {
            if (!isLoggedIn.value) {
                router.push('/Login')
            }
        }
    }

    onMounted(async () => {
        const call = await fetch(
            'https://canarytype-alpha3.azurewebsites.net/api/TypingArena/CheckLogin',
            // 'https://localhost:7161/api/TypingArena/CheckLogin',
            {
                credentials: 'include'
            }
        )

        if (call.status === 401) {
            userName.value = ''
            setIsLoggedIn(false)
        } else if (call.status === 200) {
            const response = await call.json();
            userName.value = response.userName;
            uniqueUserName.value = response.uniqueUserName;
            userProfilePicUrl.value = response.profilePicUrl;

            setIsLoggedIn(true)
        }
    })

    return {
        isLoggedIn,
        userName,
        uniqueUserName,
        userProfilePicUrl,
        isPlayingMultiplayer,
        setIsLoggedIn,
        preventUnauthorizedRouteNavigation
    }
})
