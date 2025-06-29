
<template>
  <div :style="MYSTYLE">
    <div class="q-pa-md" style="max-width: 300px">
      <q-btn 
        :loading="progress.loading"
        :percentage="progress.percentage"
        :color="color" 
        :text-color="textColor" 
        :label="label"
        :background="background"
        :disable="disable()"
        @click="click"
        >
        <template v-slot:loading>
        <q-spinner-gears class="on-left" />
          Выполняю...
        </template>
        <q-tooltip class="bg-black text-white text-body2 shadow-4" :offset="[10, 10]">{{ disable()? disableTooltipText: tooltipText }}</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>
<script>

import {  ref } from 'vue';

export default {
  components: { 

  },
  props: {
    progress: {
      type: Object,
      default: () => {return { loading: false, percentage: 0 }}
    },
    text: {
      type: String,
      default: () => ""
    },
    label: {
      type: String,
      default:  "myQButtonr"
    },
    myId: {
        type: String,
        default: () => "myQButtonr"
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    objectType: {
      type: Object,
      default: () => {}
    },
    color: {
      type: String,
      default:  "amber"
    },
    background: {
      type: String,
      default:  "goldenrod"
    },
    tooltipText: {
      type: String,
      default:  ""
    },
    disableTooltipText: {
      type: String,
      default:  ""
    },
    textColor: {
      type: String,
      default:  "black"
    },
    disable: {
      type: Function,
      default: () => false
    },
  },
  methods:{
    click(){
      
      this.$emit('q-button-click', {senderProps: this.$props})
    }
  },
  computed:{
    cGetStyle(){
      return this.MYSTYLE
    },
    cGetText(){
      return this.text

    }
    
  },
  data(){
    return{
      date: ref(new Date())
    } 
  }
  ,
  mounted() {
    
  }
}
</script>