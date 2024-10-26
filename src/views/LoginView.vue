<template>
    <v-card class="d-flex w-100 h-100 flex-column">
        <div class="w-100">
            <v-tabs align-tabs="center" v-model:model-value="tabIndex">
                <v-tab> Register </v-tab>

                <v-tab data-qa-id="login-tab"> Login </v-tab>
            </v-tabs>
        </div>

        <div class="d-flex justify-center">
            <google-login :callback="onGoogleAuthenticated">
            </google-login>
        </div>

        <v-window v-model="tabIndex">
            <v-window-item>
                <login-container
                    :content-width="65"
                    :image-width="35"
                    :image-url="loginPageBg"
                    @update:user-name="registerUserName = $event"
                    @update:password="registerPass = $event"
                    @onSubmit="onRegisterUser"
                >
                    <template #heading> Create Account </template>

                    <template #passSuggestion>
                        <div class="text-h8 mt-0">
                            Use 8 or more characters with a mix of letters numbers & symbols
                        </div>
                    </template>

                    <template #actionBtn> Create Account </template>
                </login-container>
            </v-window-item>

            <v-window-item>
                <login-container
                    :content-width="65"
                    :image-width="35"
                    :image-url="loginPageBg2"
                    @update:user-name="loginUserName = $event"
                    @update:password="loginPass = $event"
                    @on-submit="onLoginUser"
                >
                    <template #heading> Welcome Back </template>

                    <template #actionBtn> Login </template>
                </login-container>
            </v-window-item>
        </v-window>
    </v-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import LoginContainer from '../components/Authentication/LoginContainer.vue'
import { useUserDetailsStore } from '@/stores/userDetails'
import { useRouter } from 'vue-router'
import { onActivated } from 'vue'
import { useToast } from 'vue-toastification'
import loginPageBg from '../assets/images/loginPageBg.png'
import loginPageBg2 from '../assets/images/loginPageBg2.png'
import type { CallbackTypes } from 'vue3-google-login'

const router = useRouter()
const userDetails = useUserDetailsStore()
const toast = useToast()

const tabIndex = ref(0)
const registerUserName = ref('')
const loginUserName = ref('')

const registerPass = ref('')

const loginPass = ref('')

onMounted(() => {
    // if already logged in then send to typing Arena
})

onActivated(() => {
    console.log('on activating login view')
    console.log(userDetails.isLoggedIn)
    if (userDetails.isLoggedIn) {
        router.push('/TypingArena')
    }
})

const onGoogleAuthenticated: CallbackTypes.CredentialCallback = async (res) => {
    console.log(res)
    const client_id = res.clientId;
    const google_jwt = res.credential;

    // need to make an api call to backend to check if user is new or existing
    const googleLoginCall = await fetch(
        'https://canarytype-alpha3.azurewebsites.net/api/GoogleLogin', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                idToken: google_jwt
            })
        }
    )

    console.log(await googleLoginCall.json());
}

const onRegisterUser = async () => {
    const res = await fetch('https://canarytype-alpha3.azurewebsites.net/api/Register', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            UserName: registerUserName.value,
            password: registerPass.value
        }),
        credentials: 'include'
    })

    const response = await res.json()
    console.log(response)

    if (res.status === 200) {
        localStorage.setItem('canaryalpha3Username', registerUserName.value)
        userDetails.setIsLoggedIn(true)
        userDetails.userName = registerUserName.value
        router.push('TypingArena')
    }
}

const onLoginUser = async () => {
    const res = await fetch('https://canarytype-alpha3.azurewebsites.net/api/Login', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        },
        body: JSON.stringify({
            UserName: loginUserName.value,
            Password: loginPass.value
        }),
        credentials: 'include'
    })

    const response = await res.json()

    if (res.status === 200) {
        localStorage.setItem('canaryalpha3Username', loginUserName.value)

        userDetails.setIsLoggedIn(true)
        userDetails.userName = loginUserName.value
        router.push('TypingArena')
    } else if (res.status === 404) {
        toast.error('Invalid username or password')
        console.log('invalid username or password')
    } else {
        console.log('some unknown error occured')
        console.log(response)
    }
}
</script>
