import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserDetailsStore = defineStore('userDetails', () => {
  const isLoggedIn = ref(false)
  const userName = ref('')

  return { isLoggedIn, userName }
})
