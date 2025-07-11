import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import Ripple from 'primevue/ripple'
import './index.css';
import './assets/scss/main.scss'
import { ru } from './locales/ru';
import 'primeicons/primeicons.css';


import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

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
import Tooltip from 'primevue/tooltip';

import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import Avatar from 'primevue/avatar';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import Calendar from 'primevue/calendar';
import Card from 'primevue/card';
import Checkbox from 'primevue/checkbox';
import ConfirmDialog from 'primevue/confirmdialog'
import Column from 'primevue/column';
import DatePicker from 'primevue/datepicker';
import DataTable from 'primevue/datatable'
import Dialog from 'primevue/dialog';
import Dock from 'primevue/dock';
import InputText from 'primevue/inputtext';
import Menu from 'primevue/menu';
import Menubar from 'primevue/menubar';
import Message from 'primevue/message'
import Panel from 'primevue/panel';
import Password from 'primevue/password';
import Popover from 'primevue/popover';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import Toast from 'primevue/toast';
import ToggleSwitch from 'primevue/toggleswitch';





//Кастомные компоненты
import ItemPost from './components/ItemPost.vue';
import CalendarSelector from './components/CalendarSelector.vue';

// Регистрация иконок
library.add(fas, far, fab);

const app = createApp(App);

app.directive('ripple', Ripple); 
app.directive('tooltip', Tooltip);


app.use(PrimeVue, {
    theme: {        
        preset: Aura    
    },
    locale: ru,
});

app.use(router);
app.use(ConfirmationService);
app.use(ToastService);


app.component('Accordion', Accordion);
app.component('AccordionPanel', AccordionPanel);
app.component('AccordionHeader', AccordionHeader);
app.component('AccordionContent', AccordionContent);
app.component('Avatar', Avatar);
app.component('Badge', Badge);
app.component('Button', Button);
app.component('Calendar', Calendar);
app.component('Card', Card);
app.component('Checkbox', Checkbox);
app.component('Column', Column);
app.component('ConfirmDialog', ConfirmDialog)
app.component('DataTable', DataTable);
app.component('DatePicker', DatePicker);
app.component('Dialog', Dialog);
app.component('Dock', Dock);
app.component('InputText', InputText);
app.component('Menu', Menu);
app.component('Menubar', Menubar);
app.component('Message', Message);
app.component('Password', Password);
app.component('Panel', Panel);
app.component('Popover', Popover);
app.component('Select', Select);
app.component('Textarea', Textarea);
app.component('Toast', Toast);
app.component('ToggleSwitch', ToggleSwitch);


app.component('ItemPost', ItemPost);
app.component('CalendarSelector', CalendarSelector);

app.component('FontAwesomeIcon', FontAwesomeIcon);
app.mount('#app');