//import Vue from "vue"
//import Vuex from "vuex"
import {createStore} from 'vuex'
//Vue.use(Vuex)

function loadStores() {
    const context = require.context('./modules', true, /\.js$/);
    //console.log("context.keys()",context.keys())
    return context.keys()
        .map(context)
        .map(m => m.default);
}

const resourceModules = {};

loadStores().forEach((resource) => {
    resourceModules[resource.name] = resource;
});
//console.log("resourceModules",resourceModules)
const store = createStore({modules: resourceModules})
export default store
