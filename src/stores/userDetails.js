import { defineStore } from 'pinia'
import { onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

export const useUserDetailsStore = defineStore('userDetails', () => {
    const router = useRouter()
    const userName = ref('')

    const isLoggedIn = ref(false);

    function setIsLoggedIn(val) {
        isLoggedIn.value = val
    }

    function preventUnauthorizedRouteNavigation() {
        if (!isLoggedIn.value) {
            router.push('/Login')
        }
    }

    onMounted(async () => {
        const call = await fetch('https://canarytype-alpha3.azurewebsites.net/api/TypingArena/CheckLogin', {
            credentials: 'include'
        })
    
        if (call.status === 401) {
            userName.value = '';
            setIsLoggedIn(false);
        } else if (call.status === 200) {
            userName.value = localStorage.getItem('canaryalpha3Username');
            console.log('setting isloggedin to true')
            setIsLoggedIn(true);
        }
    })

    return { isLoggedIn, userName, setIsLoggedIn, preventUnauthorizedRouteNavigation }
})
