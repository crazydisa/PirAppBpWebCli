<template>
  <div class="q-pa-md">
    <q-layout view="hHh Lpr lff" container style="height: 100vh" class="shadow-2 rounded-borders">
      <q-header elevated :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
        <q-toolbar>
          <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="menu" />
          <q-toolbar-title>Навигация</q-toolbar-title>
          <q-btn flat @click="drawerRight = !drawerRight" round dense icon="menu" />
        </q-toolbar>
      </q-header>

      <q-drawer
        v-model="drawerLeft"
        show-if-above
        :width="500"
        :breakpoint="500"
        elevated
        class="bg-primary text-white"
      >
        <q-scroll-area class="fit">
          <QDynamicComponent 
            :tabs="oils"
            selected-tab="Программа масла"
            :is-dynamic="false">
          </QDynamicComponent> 
        </q-scroll-area>
      </q-drawer>

      <q-drawer
        side="right"
        v-model="drawerRight"
        show-if-above
        bordered
        :width="200"
        :breakpoint="500"
        :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'"
      >
        <!-- <q-scroll-area class="fit">
          <div class="q-pa-sm">
            <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
          </div>
        </q-scroll-area> -->
      </q-drawer>

      <q-page-container>
        <q-page padding>
          <QDynamicComponent 
            :tabs="events"
            selected-tab="Комплект"
            
            :is-dynamic="false">
          </QDynamicComponent>    
        </q-page>
      </q-page-container>
    </q-layout>
  </div>
</template>


<script setup>
import { ref } from 'vue'
import { useStore } from 'vuex'
import QDynamicComponent from "@/components/UniversalComponents/QDynamicComponent.vue";

const drawerLeft= ref(true)
const drawerRight= ref(true)
const store = useStore()
const setting = store.getters["getSetting"]
//const cPageContentSettings=[setting.complectContent]
const oils=setting["oils"]
const events=setting["events"]
//const cDocumentView=setting["documentContent"]
//const cTransferTask=setting["transferTask"]


</script>