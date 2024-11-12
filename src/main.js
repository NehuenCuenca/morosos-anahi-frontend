import { createApp } from 'vue'
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import '@fontsource/carter-one';
import '@fontsource/readex-pro';
import 'boxicons';
import './style.css'
import App from './App.vue'



createApp(App)
    .use(Toast, {})
    .mount('#app')
