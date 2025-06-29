<template>
  <div  :style="MYSTYLE">
    <div  style="max-width: 320px;  min-width: 320px; padding: 5px">
    <div class="q-gutter-md" >
      <q-input 
        standout="bg-teal text-white" 
        v-model="model"  
        :type="type"
        :label="label" 
        :hint="hint"
        :hide-hint="hideHint"
        :dense ="true"
        :disable="disable"
        :borderless="borderless"
        :readonly="readonly"
        :autogrow="autogrow"
        :rules="rules"
        :error="cError"
        @update:model-value="onItemSelected"
        />  
    </div>
  </div>
</div>
</template>

<script>  

import {  ref } from 'vue';

export default {
  components: { 

  },
  props: {
   
    text: {
      default: () => null
    },
    rules: {
      default: () => [true]
    },
    useErrorFunc: {
      type: Boolean,
      default: () => false
    },
    errorFunc: {
      type: Function,
      default: () => null
    },
    error: {
      type: Boolean,
      default: () => false
    },
    type: {
      type: String,
      default: () => "text"
    },
    maxWidth: {
      default: () => '300px'
    },
    
    disable: {
      type: Boolean,
      default: () => false
    },
    borderless: {
      type: Boolean,
      default: () => false
    },
    autogrow: {
      type: Boolean,
      default: () => false
    },
    
    readonly: {
      type: Boolean,
      default: () => false
    },
    hint: {
      type: String,
      default: () => ""
    },
    hideHint: {
      type: Boolean,
      default: () => false
    },
    
    style: {
      type: String,
      default: () => "max-width: 320px;  min-width: 320px; padding: 5px;"
    },
    label: {
      type: String,
      default: () => ""
    },
    myId: {
        type: String,
        default: () => "myInputBox"
    },
    dataSource: {
      default: () => null
    },
    objectType: {
      type: Object,
      default: () => {}
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    
  },
  methods:{
    onItemSelected(node){
      if(this.type=="number")
      node = Number(node)

      this.$emit('q-imput-object-changed', {node, senderProps: this.$props, type: this.objectType})
    }
  },
  computed:{
    cError(){
      if(!this.useErrorFunc){
        return this.error
      }
      else{
        return this.errorFunc(this.model)
      }
    },
    cGetStyle(){
      return this.MYSTYLE
    },
    cGetText(){
      return this.text
    },

    
  },
  data(){
    return{
      model: ref(this.text),
    } 
  },
  watch: {
      text() {
        this.model = ref(this.text)
      }
  },
  mounted() {
    
  }
}
</script>