import Vue from 'vue';
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-awesome/icons';
import Icon from 'vue-awesome/components/Icon';
Vue.use(require('vue-moment'));

Vue.component('icon', Icon);

Vue.component('fintabwidget', require('./components/fintabwidget.vue').default);

const fintabwidget = new Vue({
    el: '#fintabwidget',
});

