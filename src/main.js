import {createApp} from 'vue';
import App from './App.vue';
import store from './store';
import router from './router';
//import { useQuasar } from 'quasar'
import { Quasar } from 'quasar'
import localizeFilter from './localize';
import LoadPanel from '@/components/Common/LoadPanel.vue';
import quasarUserOptions from './quasar-user-options'
import 'devextreme/dist/css/dx.common.css';
import 'devextreme/dist/css/dx.light.compact.css';
//import resize from "vue-element-resize-detector";

const app = createApp(App)
app.config.globalProperties.$filters = {
  localise(value) {
    return localizeFilter(value)
  }
}
app.component('LoadPanel', LoadPanel)




async function start() {
  app.use(store)
  await store.dispatch("loadConfigSettings"); 
  //await store.dispatch("loadSystem");
  await store.dispatch("loadPages");

  let routes = [];
  
  const pages = store.getters.getPages;
  for(let i in pages) {
      const page = pages[i];
      const route = {
        title: page.Name,
          path: page.Path,
          name: page.Name,
          icon: page.IconName,
          component: () => import('@/pages/' + page.Name + '.vue'),
          meta: {
              title: page.Title,
              layout: 'main-layout',
              action: page.LoadAction ? page.LoadAction.Name : null,
          }
      };
      routes.push(route);
  }
  //store.commit('setPages', routes)



  routes = routes.concat({
      path: '/access-denied',
      name: 'AccessDenied',
      component: () => import('@/pages/system/AccessDenied.vue'),
      meta: {
          title: localizeFilter('AccessDenied'),
          layout: 'empty-layout',
          isPublicPage: true
      }
    },{
      path: '/service-is-not-available',
      name: 'ServiceIsNotAvailable',
      component: () => import('@/pages/system/ServiceIsNotAvailable.vue'),
      meta: {
          title: localizeFilter('ServiceIsNotAvailable'),
          layout: 'empty-layout',
          isPublicPage: true
      }
    },{
      path: '/browser-not-supported',
      name: 'BrowserNotSupported',
      component: () => import('@/pages/system/BrowserNotSupported.vue'),
      meta: {
          title: localizeFilter('BrowserNotSupported'),
          layout: 'empty-layout',
          isPublicPage: true
        }
    },{
      path: '/:pathMatch(.*)',
      name: 'PageNotFound',
      component: () => import('@/pages/system/PageNotFound.vue'),
      meta: {
          title: localizeFilter('PageNotFound'),
          layout: 'empty-layout',
          isPublicPage: true
      }
    }
  );
  routes.forEach(route => {
    router.addRoute(route)
  })
  
  
  app.use(router)
  app.use(Quasar,quasarUserOptions)
  app.mount('#app')
}

start();