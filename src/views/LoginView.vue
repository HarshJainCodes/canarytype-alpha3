<template>
    <div class="d-flex w-100 bg-teal-lighten-4 h-100">
        <div class="bg-teal-lighten-4 h-100" style="width: 40%;">
            <div class="text-h4 pa-10 text-white">
                Compete with others in realtime and save your result 
            </div>
        </div>
    
        <div class="position-absolute" style="top: 20%; left: 10%;">
            <v-img width="900" :src="random_shapes">
            </v-img>
        </div>

        <div class="h-100 pa-5 bg-white d-flex flex-column align-center justify-center" style="width: 60%;">
            <div class="text-h4 pt-10 font-weight-bold text-center">
                <div v-if="currentView === LoginModes.CreateAccount">
                    CREATE ACCOUNT
                </div>
                <div v-if="currentView === LoginModes.LoginToAccount">
                    WELCOME BACK
                </div>
            </div>

            <google-login class="pa-10" :callback="onGoogleAuthenticated" popup-type="TOKEN" ux-mode="redirect">
                <v-btn prepend-icon="mdi-google" color="teal-lighten-4" size="large">
                    Continue With Google
                </v-btn>
            </google-login>

            <div class="text-h5 text-blue-grey-lighten-3 text-center">
                - OR -
            </div>

            <div class="w-50 d-flex flex-column pt-5">
                <v-text-field v-model="userName" label="UserName" type="text" variant="underlined"></v-text-field>
                <v-text-field v-model="email" label="Email" type="email" variant="underlined"></v-text-field>
                <v-text-field v-model="password"
                              label="Password"
                              :type="showPassword ? 'text' : 'password'" 
                              :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" 
                              @click:append-inner="onClickPasswordEye"
                              variant="underlined"
                ></v-text-field>
            </div>

            <v-btn color="teal-lighten-4 w-50 border-radius-10" border="md" rounded size="x-large" @click="onClickLoginOrRegister">
                <div class="text-white h-100">
                    <div v-if="currentView === LoginModes.CreateAccount">
                        CREATE ACCOUNT
                    </div>
                    <div v-if="currentView === LoginModes.LoginToAccount">
                        LOGIN
                    </div>
                </div>
            </v-btn>
            <div class="text-h5 pa-5">
                <div v-if="currentView === LoginModes.CreateAccount">
                    Already have an account? <span class="text-teal-lighten-2 login-custom-class" 
                                                   @click="onClickAlreadyHaveAnAccountOrSignup"> Login </span>
                </div>
                <div v-if="currentView === LoginModes.LoginToAccount">
                    Don't have an account? <span class="text-teal-lighten-2 login-custom-class" @click="onClickAlreadyHaveAnAccountOrSignup">Sign Up</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserDetailsStore } from '@/stores/userDetails'
import { useRouter } from 'vue-router'
import { onActivated } from 'vue'
import { TYPE, useToast } from 'vue-toastification'
import random_shapes from '../assets/images/random_shapes.png'
import type { CallbackTypes } from 'vue3-google-login'
import { LoginModes } from './Constants'

const router = useRouter()
const userDetails = useUserDetailsStore()
const toast = useToast()

const userName = ref('')
const email = ref('')
const password = ref('')

onMounted(() => {
    // I have added this comment to test if i get any merge conflicts
})

onActivated(() => {

})

const showPassword = ref(false);
const currentView = ref(LoginModes.CreateAccount);

const onClickPasswordEye = () => {
    showPassword.value = !showPassword.value
}

const onClickAlreadyHaveAnAccountOrSignup = () => {
    if (currentView.value === LoginModes.CreateAccount){
        currentView.value = LoginModes.LoginToAccount;
    }else if (currentView.value === LoginModes.LoginToAccount){
        currentView.value = LoginModes.CreateAccount
    }
}

const onGoogleAuthenticated: CallbackTypes.TokenResponseCallback = async (res) => {
    console.log(res);
    const google_jwt = res.access_token;

    const googleLoginCall = await fetch(
        'https://canarytype-alpha3.azurewebsites.net/api/GoogleLogin', {
        // 'https://localhost:7161/api/GoogleLogin', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8'
            },
            body: JSON.stringify({
                idToken: google_jwt
            }),
            credentials: 'include'
        }
    )

    const response = await googleLoginCall.json();

    if (googleLoginCall.status === 200){
        localStorage.setItem("canaryalpha3Username", response.userName)
        userDetails.setIsLoggedIn(true)
        userDetails.userName = response.userName
        router.push('TypingArena')
    }
}

const onClickLoginOrRegister = async () => {
    if (currentView.value === LoginModes.LoginToAccount){
        const createAccountCall = await fetch(
            'https://canarytype-alpha3.azurewebsites.net/api/Login', {
            // 'https://localhost:7161/api/Login', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    UserName: userName.value,
                    Email: email.value,
                    Password: password.value
                }),
                credentials: 'include'
            })

        if (createAccountCall.status === 400){
            toast("Invalid Password for given Username and Email", {
                type: TYPE.ERROR
            });
        } else if (createAccountCall.status === 404) {
            toast("User with given Username and Email not found", {
                type: TYPE.ERROR
            });
        } else if (createAccountCall.status === 200){
            toast("Logged in Successfully", {
                type: TYPE.SUCCESS
            });
            localStorage.setItem("canaryalpha3Username", userName.value)
            userDetails.setIsLoggedIn(true)
            userDetails.userName = userName.value
            router.push('TypingArena')
        }
    } else if (currentView.value === LoginModes.CreateAccount){
        const createAccountCall = await fetch(
            'https://canarytype-alpha3.azurewebsites.net/api/Register', {
            // 'https://localhost:7161/api/Register', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json; charset=UTF-8'
                },
                body: JSON.stringify({
                    UserName: userName.value,
                    Email: email.value,
                    Password: password.value
                }),
                credentials: 'include'
            })

        if (createAccountCall.status === 409){
            toast("User Already exists for given Email", {
                type: TYPE.ERROR
            });
        } else if (createAccountCall.status === 200){
            toast("Registered Successfully", {
                type: TYPE.SUCCESS
            });
            localStorage.setItem("canaryalpha3Username", userName.value)
            userDetails.setIsLoggedIn(true)
            userDetails.userName = userName.value
            router.push('TypingArena')
        }
    }
}

</script>

<style scoped>
.login-custom-class:hover{
cursor: pointer;
}
</style>