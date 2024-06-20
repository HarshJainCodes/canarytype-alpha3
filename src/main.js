import { createApp } from 'vue'
import { createPinia } from 'pinia'

//vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

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

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
