<template>
  <div :style="MYSTYLE">
  
  <div  style="max-width: 320px;  min-width: 320px; padding: 5px">
    <div class="q-gutter-md">
      <q-select 
        v-if="!!objectType"
        standout="bg-teal text-white" 
        v-model="model" 
        dense
        :options="objectsDataSource" 
        :label="label"
        option-value="Id" 
        :option-label="cDisplayExpr"
        @update:model-value="onItemSelected"
      /> 
    </div>
  </div>
 
</div>
</template>

<script>

import {  ref } from 'vue';
//import TreeViewVue from './TreeView.vue';

export default {
  components: { 

  },
  props: {
   
    selectedObject: {
      default: () => null
    },
    label: {
      type: String,
      default: () => ""
    },
    displayExpr: {
      type: String,
      default: () => ""
    },
    dataSource: {
      default: () => null
    },
    myId: {
        type: String,
        default: () => "mySelectBox"
    },
    objectType: {
      type: Object,
      default: () => null
    },

    requestOptions: {
      type: Object,
      default: () => null
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    dataFilter: {
        type: Function,
        default: () => function() {return true}
    },
  },
  methods:{
    onItemSelected(node){
      this.$emit('q-select-box-object-selected', {node, senderProps: this.$props, type: this.objectType})
    }
  },

  computed:{
    cGetStyle(){
      return this.MYSTYLE
    },
    cGetText(){
      return this.text
    },
    cDisplayExpr(){
      let result = this.objectType.DisplayExpr
      if (this.displayExpr!="")
        result = this.displayExpr
      return result
    },
    objectsDataSource() {
      if(!this.dataSource) {
        
        const getterName = this.requestOptions.getterName
        if(this.$store.getters[getterName] !== undefined) {
          const typeName = this.objectType.Name
          const nameSpace = this.objectType.NameSpace
          const fullTypeName = nameSpace+"."+typeName
          const getter = this.$store.getters[getterName]
          let dataSource = getter[fullTypeName]
          return dataSource.filter(this.dataFilter);
        }
      }
      if(Object.prototype.toString.call(this.dataSource) === '[object Object]') {
        return [this.dataSource]
      }
      return this.dataSource;
    },
    
  },
  data(){
    return{
      model: ref(this.selectedObject),
    } 
  },
  watch: {
      text() {
        this.model = ref(this.selectedObject)
      }
  },
  async mounted() {
    let requestOptions = {...this.requestOptions}
    if(this.objectType){
      requestOptions.typeName = this.objectType.Name
      requestOptions.nameSpace = this.objectType.NameSpace
      await this.$store.dispatch(requestOptions.actionName,requestOptions)
    }
  }
}
</script>