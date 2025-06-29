<!-- Компонент в разработке!!! -->
<template>
  <div class="q-pa-md" :style="MYSTYLE">
    Загрузка данных из Excel. Формат файла excel должен соответствовать шаблону.  Можно загружать сразу список файлов.
  </div>
</template>

<script>  

import {  ref } from 'vue';

export default {
  components: { 

  },
  props: {
   
    text: {
      
      default: () => ""
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
    style: {
      type: String,
      default: () => "max-width: 300px"
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
    cGetStyle(){
      return this.MYSTYLE
    },
    cGetText(){
      return this.text
    },

    
  },
  data(){
    return{
      model: ref(null),
    } 
  },
  watch: {
      text() {
        this.model = this.text
      }
  },
  mounted() {
    
  }
}
</script>