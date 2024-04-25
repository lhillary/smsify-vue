import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router/router';
import PrimeVue from 'primevue/config';
import DialogService from 'primevue/dialogservice';
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Ripple from 'primevue/ripple';
import StyleClass from 'primevue/styleclass';
import Password from 'primevue/password';
import ProgressSpinner from 'primevue/progressspinner';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import ScrollPanel from 'primevue/scrollpanel';
import TabMenu from 'primevue/tabmenu';
import DynamicDialog from 'primevue/dynamicdialog';
import Tag from 'primevue/tag';
import InputMask from 'primevue/inputmask';
import Toast from 'primevue/toast';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import AutoComplete from 'primevue/autocomplete';
import ConfirmDialog from 'primevue/confirmdialog';
import Editor from 'primevue/editor';
import Avatar from 'primevue/avatar';
import Tooltip from 'primevue/tooltip';


import 'primevue/resources/themes/aura-light-teal/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(createPinia());

app.use(router);
app.use(PrimeVue, { ripple: true });
app.use(DialogService);
app.use(ToastService);
app.use(ConfirmationService);

app.component('Button', Button);
app.component('InputText', InputText);
app.component('Password', Password);
app.component('ProgressSpinner', ProgressSpinner);
app.component('Dialog', Dialog);
app.component('Dropdown', Dropdown);
app.component('Textarea', Textarea);
app.component('ScrollPanel', ScrollPanel);
app.component('TabMenu', TabMenu);
app.component('DynamicDialog', DynamicDialog);
app.component('Tag', Tag);
app.component('InputMask', InputMask);
app.component('Toast', Toast);
app.component('DataTable', DataTable);
app.component('Column', Column);
app.component('AutoComplete', AutoComplete);
app.component('ConfirmDialog', ConfirmDialog);
app.component('Editor', Editor);
app.component('Avatar', Avatar);

app.directive('ripple', Ripple);
app.directive('styleclass', StyleClass);
app.directive('tooltip', Tooltip);

app.mount('#app');
