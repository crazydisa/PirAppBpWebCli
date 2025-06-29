//import Vue from 'vue';
import store from '@/store'
//import Router from 'vue-router';
import { createRouter,createMemoryHistory,createWebHashHistory,createWebHistory} from 'vue-router'
import graphBuilder from "@/utils/graphBuilder.js";
import settings from "@/utils/settings.js";

//Vue.use(Router);


const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)
const router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes: [],

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

router.beforeEach((to, from, next) => {
    
    const system = store.getters.getSystem;
    if(system) {
        document.title = to.meta.title + " | " + system.Title;
    }

    if(to.meta.isPublicPage) {
        next();
    }
    else {
        auth(to, from, next);
    }
    
    if(to.meta.isPublicPage) {
        next();
    }
});

async function auth(to, from, next) {
    if(isInternetExplorer()) {
        next('/browser-not-supported');
        return;
    }
    
    // if(!store.getters.currentUserIsLoaded) {
    //     await store.dispatch("loadCurrentUser");
        
    //     if(!store.getters.currentUserIsLoaded) {
    //         next('/service-is-not-available?page=' + to.path);
    //         return;
    //     }
    //     else if(!store.getters.currentUserIsAuthorized) {
    //         next('/access-denied?page=' + to.path);
    //         return;
    //     }
    // }

    if(!store.getters.objectTypesIsLoaded) {
        await store.dispatch("loadObjectTypes");
        let compSettings = settings.getComponentSettings()
        for(let key of Object.keys(compSettings)){
            settings.setValue(compSettings[key])
        }
        let result = graphBuilder.buildGraph(null,compSettings)
        store.commit('setSetting', compSettings)
        store.commit('setGraph',result.graph)
        console.log("graph",result.graph)
        console.log("compSettings",compSettings)
    }

    if(!store.getters.actionsIsLoaded) {
        await store.dispatch("loadActions");
    }
    
    
    
        //await store.dispatch("loadUsers")
     
     
        await store.dispatch("loadDictionaryTypes");
        //await store.dispatch("loadComplects");
        let requestOptions = {}
        requestOptions.actionName = "loadAnyObjects"
        requestOptions.getterName = "getAnyObjects"
        requestOptions.setterName = "setAnyObjects"
        
        requestOptions.url = "/universal/anyObjects"
        requestOptions.accesName = "GetAnyObjects"
        requestOptions.condition = null
        requestOptions.useFilterIds = false
        requestOptions.idPropName = "Id"
        requestOptions.ids = []
        requestOptions.typeName = "Bowling"
        requestOptions.nameSpace ="GamesResults.Models"
        await store.dispatch(requestOptions.actionName,requestOptions)
        requestOptions.typeName = "User"
        requestOptions.nameSpace ="GamesResults.Models"
        await store.dispatch(requestOptions.actionName,requestOptions)
        requestOptions.typeName = "City"
        requestOptions.nameSpace ="GamesResults.Models"
        await store.dispatch(requestOptions.actionName,requestOptions)
        requestOptions.typeName = "District"
        requestOptions.nameSpace ="GamesResults.Models"
        await store.dispatch(requestOptions.actionName,requestOptions)
    // if(!store.getters.currentUserIsAllowedAction(to.meta.action)) {
    //     next('/access-denied?page=' + to.path);
    //     return;
    // }

    // await store.dispatch("loadSystemSettings", to.path);
    // await store.dispatch("loadUserSettings", to.path);

    next();
}

function isInternetExplorer() {
    return window.navigator.userAgent.indexOf('MSIE ') > -1 || window.navigator.userAgent.indexOf('Trident/') > -1;
}

export default router;