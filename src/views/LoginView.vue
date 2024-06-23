<template>
  <v-card class="d-flex w-100 h-100 flex-column">
    <div class="w-100">
      <v-tabs align-tabs="center" v-model:model-value="tabIndex">
        <v-tab> Register </v-tab>

        <v-tab> Login </v-tab>
      </v-tabs>
    </div>
    <v-window v-model="tabIndex">
      <v-window-item>
        <login-container
          :content-width="65"
          :image-width="35"
          :image-url="'src/assets/images/loginPageBg.png'"
          @update:user-name="registerUserName = $event"
          @update:password="registerPass = $event"
        >
          <template #heading> Create An Account </template>

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
          :image-url="'src/assets/images/loginPageBg2.png'"
          @update:user-name="loginUserName = $event"
          @update:password="loginPass = $event"
        >
          <template #heading> Welcome Back </template>

          <template #actionBtn> Login </template>
        </login-container>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import LoginContainer from '../components/Authentication/LoginContainer.vue'

const tabIndex = ref(0)
const registerUserName = ref('')
const loginUserName = ref('')

const registerPass = ref('')

const loginPass = ref('')
</script>
