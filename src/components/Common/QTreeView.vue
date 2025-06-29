<template>
  <div style=" display: flexbox ">
  <q-input ref="filterRef" filled v-model="filter" label="">
            <template v-slot:append>
              <q-icon v-if="filter !== ''" name="clear" class="cursor-pointer" @click="resetFilter" />
            </template>
          </q-input>
   </div>
  <q-scroll-area style="height: 80vh;">
  <div class="q-pa-md" >
      <div class="q-pa-md q-gutter-sm"  >
        <div  v-if="!!root">
          <q-tree 
            ref="qtree"
            :nodes="root"
            v-model:expanded="expanded"
            v-model:selected="selected"
            :label-key="props.labelKey"
            :node-key="props.nodeKey"
            :filter="filter"
            :children-key="props.childrenKey"
            v-model:ticked="ticked"
            @lazy-load="onLazyLoad"
            @update:selected="onItemSelected"
            @update:expanded="onItemExpanded">
            <template v-slot:default-header="prop">
              <div class="row items-center">
                <q-icon class="text-dark" size="lg">
                  <img :src=prop.node.icon  class="q-mr-sm" style="width:20px;height:20px">
                </q-icon>
                <div class="text-weight-bold text-black">{{ mGetItemName(prop.node.NameForTreeView) }}</div>
              </div>
            </template>
          </q-tree>
        </div>
      </div>
  </div>
</q-scroll-area>
</template>

<script setup>
//import {  mapGetters } from 'vuex'
import { useStore } from 'vuex'
import { ref,
    onMounted,
    //onUpdated,
    //watch,
    //watchPostEffect,
    //computed,
    //toRefs,
    defineProps,
    defineEmits
} from 'vue'

const store = useStore()

const props = defineProps({

    myId: {
        type: String,
        default: () => "mainTreeView"
    },

    myRef: {
        type: String,
        default: () => "qtree"
    },

    labelKey: {
        type: String,
        default: () => "Title"
    },

    nodeKey: {
        type: String,
        default: () => "Title"
    },

    MYSTYLE: {
        type: Object,
        default: () => {}
    },

    actionName: {
      type: String,
      default: () => ""
    },

    getterDataName: {
      type: String,
      default: () => ""
    },

    childrenKey: {
      type: String,
      default: () => "children"
    },

    createChildrenFilter: {
      type: Number,
      default: () => null
    },

    parentIdExpr: {
      type: String,
      default: () => "ParentId"
    },

    displayExpr: {
      type: String,
      default: () => "NameForTreeView"
    },

    rootLable: {
      type: String,
      default: () => ""
    },

    keyExpr: {
      type: String,
      default: () => "Id"
    },

    useLazyStategy: {
      type: Boolean,
      default: () => false
    },
})

function simple(nodes) { root.value = nodes}
//let rootNodes = null
const root = ref(null)
const filter = ref('')
const filterRef = ref(null)
const expanded = ref([props.rootLable])
const selected = ref(props.rootLable)
const ticked = ref([ ])
const emits = defineEmits(['q-tree-view-create-children',
  'q-tree-view-object-selected','q-tree-view-item-expanded'])
const qtree = ref(props.myRef)
onMounted(()=>{emits('q-tree-view-create-children', 
  { node:null, key:null, done:simple, fail:null, senderProps: props})})

  function resetFilter () {
  filter.value = ''
  filterRef.value.focus()
}

function onLazyLoad ({ node, key, done, fail }) {
  emits('q-tree-view-create-children', { node, key, done, fail, senderProps: props})
}

function mGetItemName(name) {
  if (!name) return "";
  const names = name.split("|");
  return names[names.length-1];
}

async function onItemSelected(key){
  if(key!=null){
    const node = qtree.value.getNodeByKey(key)
    if(node){
      if (!cSelectedObj(node)) {
        await mLoadObjectById(node)
      }
    }
    emits('q-tree-view-object-selected', {node, senderProps: props})
  }
}

function onItemExpanded(keys){

  //if(keys[0]!="root"){
    const node = qtree.value.getNodeByKey(keys[keys.length-1])
    emits('q-tree-view-item-expanded', {node, senderProps: props})
 // }
}

function cSelectedObj(node) {
  const getterName = "get" + node.Type  + "ById"
  const getter = store.getters[getterName]
  if(getter !== undefined) {
    return getter(node.Id)
  }
  return null
}

async function mLoadObjectById(node){
  const actionName = "load" + node.Type + "ById"
  await store.dispatch(actionName,node.Id);
}

</script>