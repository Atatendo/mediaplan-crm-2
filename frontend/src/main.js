import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Ripple from 'primevue/ripple'
import './index.css';
import './assets/scss/main.scss'

// Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import '@fortawesome/fontawesome-svg-core/styles.css';
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Card from 'primevue/card'
import Checkbox from 'primevue/checkbox'
import Dock from 'primevue/dock';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message'
import Password from 'primevue/password'


// Регистрация иконок
library.add(fas, far, fab);

const app = createApp(App);

app.directive('ripple', Ripple); 
app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.use(router);

app.component('Avatar', Avatar);
app.component('Badge', Badge);
app.component('Button', Button);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Dock', Dock);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('Password', Password);

app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');