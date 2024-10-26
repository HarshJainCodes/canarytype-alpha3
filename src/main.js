import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vue3GoogleLogin from 'vue3-google-login'

//vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// toast
import Toast from 'vue-toastification'
// Import the CSS or use your own!
import 'vue-toastification/dist/index.css'

// tanstack
import { VueQueryPlugin } from '@tanstack/vue-query'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
    icons: {
        defaultSet: 'mdi'
    },
    components,
    directives
})

const toastOptions = {}

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(Toast, toastOptions)
app.use(VueQueryPlugin)
app.use(vue3GoogleLogin, {
    clientId: '614723879813-ucnacak95ele14f5fjbqop6f3d8l9a3q'
})

app.mount('#app')
