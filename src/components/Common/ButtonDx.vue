<template>
  <div :style="cGetStyle">
    <DxButton 
    
        :text="text"
        :icon="icon"
        :enabled="enabled"
        
        @click="mBottonClick"
    />
  </div>
</template>

<script>

import DxButton from 'devextreme-vue/button';

export default {
  components: { 
    DxButton
  },
  props: {
    text: {
      type: String,
      default: () => null
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    icon: {
      type: String,
      default: () => null
    },
    enabled: {
      type: Boolean,
      default: () => true
    },
    onClick: {
      type: Function,
      default: () => function() {}
    },
    buttonclick: {
      type: String,
      default: () => null
    },
    emitParam1: {
      type: Object,
      default: () => null
    },
    emitParam2: {
      type: Object,
      default: () => null
    },
    emitParam3: {
      type: Array,
      default: () => []
    },
    myId: {
        type: String,
        default: () => ""
    },
  },
  methods: {
    mBottonClick(){
      this.$emit(this.buttonclick? this.buttonclick:'click',{emitParam1:this.emitParam1, emitParam2:this.emitParam2, emitParam3:this.emitParam3})
    },
    
  },
  computed: {
    cBottonClick(){
      return this.$emit(this.buttonclick? this.buttonclick:'click',this.emitParam1)
    },
    cGetStyle(){
      return this.MYSTYLE
    }
  }
}
</script>