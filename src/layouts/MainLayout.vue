<template>
  <q-layout view="lHh Lpr lFf" class="bg-white">
    <q-header elevated>
      <q-toolbar class="bg-black text-white">
        <q-btn
          flat
          dense
          round
          
          @click="toggleLeftDrawer"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title>
          Боулинг
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      
      bordered
      class="bg-grey-2"
    >
    <div class="q-pa-md q-gutter-sm">
      <q-btn-group rounded  v-for="(item, index) in menuDataSource()" v-bind:key="index">  
        <q-btn  color="brown" @click="menuItemClick(item)"  :label="item.Title"  />
      </q-btn-group>
    </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from 'vue'
import { useStore } from 'vuex'
import {useRouter,useRoute} from 'vue-router'
export default {
  name: 'MyLayout',

  setup () {
    const leftDrawerOpen = ref(false)
    const menu = ref(null)
    const store = useStore()
    const router = useRouter()
    const route = useRoute()
    function toggleLeftDrawer () {
      leftDrawerOpen.value = !leftDrawerOpen.value
      const getter = store.getters["getPages"]
      if(getter !== undefined) {
        menu.value = getter
  }
}
    function menuDataSource() {
            return store.getters.getPages//.filter(page => page.LoadAction && this.currentUserIsAllowedAction(page.LoadAction.Name));
            
            
    }
    function menuItemClick(e) {
            
            if(e.Path && e.Path != route.path) {
                console.log("e.Path",e.Path)
            console.log("this.$route.path",route.path)
                router.push(e.Path);
            }
        }
    return {
      leftDrawerOpen,
      toggleLeftDrawer,
      menuDataSource,
      menuItemClick,
      menu
    }
  }
}
</script>

