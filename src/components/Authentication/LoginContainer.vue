<template>
  <div class="w-100 h-100 d-flex">
    <div class="ml-10 mt-10 h-100" :style="{ width: contentWidth + '%' }">
      <div class="text-h5">
        <slot name="heading"> </slot>
      </div>

      <div class="h-100">
        <v-text-field
          class="mr-5 mt-10"
          max-width="50%"
          label="User Name"
          variant="solo"
          v-model="userName"
          @update:model-value="emit('update:userName', userName)"
        >
        </v-text-field>
        <v-text-field
          max-width="50%"
          label="Password"
          variant="solo"
          :type="passwordType"
          v-model="password"
          @update:model-value="emit('update:password', password)"
        >
        </v-text-field>

        <v-text-field
          max-width="50%"
          label="Confirm Password"
          variant="solo"
          :type="passwordType"
          v-model="confirmPass"
          :rules="[confirmPassRules.match]"
          validate-on="blur"
        >
        </v-text-field>

        <slot name="passSuggestion"> </slot>

        <v-checkbox label="Show Password" v-model="showPassword"></v-checkbox>

        <v-btn :disabled="isActionBtnDisabled" @click="emit('onSubmit')">
          <slot name="actionBtn"> </slot>
        </v-btn>
      </div>
    </div>

    <v-divider class="mx-5" vertical></v-divider>

    <div :style="{ width: imageWidth + '%' }">
      <v-img class="w-100 h-100" cover :src="imageUrl"> </v-img>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
defineProps({
  contentWidth: {
    type: Number,
    required: true
  },
  imageWidth: {
    type: Number,
    requied: true
  },
  imageUrl: {
    type: String,
    requied: true
  }
})

const emit = defineEmits(['update:userName', 'update:password', 'onSubmit'])

const userName = ref('')

const showPassword = ref(false)
const password = ref('')
const confirmPass = ref('')

const passwordType = computed(() => {
  return showPassword.value ? 'text' : 'password'
})

const isActionBtnDisabled = computed(() => {
  return (
    userName.value && password.value && confirmPass.value && password.value !== confirmPass.value
  )
})

const confirmPassRules = {
  match: () => {
    return password.value == confirmPass.value || 'Passwords do not match'
  }
}
</script>
