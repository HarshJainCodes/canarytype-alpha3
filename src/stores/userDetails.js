import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useUserDetailsStore = defineStore('userDetails', () => {
    const router = useRouter()

    const isLoggedIn = ref(false)
    const userName = ref('')

    function setIsLoggedIn(val) {
        isLoggedIn.value = val
    }

    function preventUnauthorizedRouteNavigation() {
        if (!isLoggedIn.value) {
            router.push('/Login')
        }
    }

    return { isLoggedIn, userName, setIsLoggedIn, preventUnauthorizedRouteNavigation }
})
