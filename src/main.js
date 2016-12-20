import Vue from 'vue';
import App from './App';
import store from './store';
import 'jquery-ui-bundle';
import "./css";

new Vue({
    el: '#app',
    components: { App },
    store: store
});
