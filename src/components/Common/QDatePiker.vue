
<template>
  <div :style="MYSTYLE">
    
    <div  style="max-width: 320px;  min-width: 320px; padding: 5px;">
      <q-input 
        v-model.date="date" 
        filled 
        dense
        :label="label"
        :error="cError"
        :readonly="readonly"
        :hint="hint"
        :hide-hint="hideHint"
        >
        
        <template v-slot:prepend>
          <q-icon name="event" class="cursor-pointer">
          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date 
                v-model="date" 
                first-day-of-week="1"
                mask='DD.MM.YYYY'
                @update:model-value="onItemSelected">
              <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Ok" color="primary" flat />
              </div>
              </q-date>
          </q-popup-proxy>
          </q-icon>
        </template>
        <!-- <template v-slot:label>
            {{date}}
            
          </template> -->
      </q-input>
    </div>
  
  </div>
</template>
<script>

import {  ref } from 'vue';
//import utils from '@/utils'
export default {
  components: { 

  },
  props: {
   
    selected: {
      default: () => null
    },
    label: {
      type: String,
      default: () => ""
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
    myId: {
        type: String,
        default: () => "myDatePiker"
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
   
    
  },
  methods:{
    onItemSelected(node){
      if(!node) return
      
      this.$emit('q-data-piker-object-changed', {node, ...this.$props})
    }
  },
  computed:{
    cError(){
      if(!this.useErrorFunc){
        return this.error
      }
      else{
        return this.errorFunc(this.date)
      }
    },
    cGetStyle(){
      return this.MYSTYLE
    },
  },

  data(){
    return{
      date: ref(window.dt.ru.date(this.selected))
    } 
  },
  watch: {
    selected() {
      this.date = ref(window.dt.ru.date(this.selected))
    }
  },
  mounted() {
    
  }
}
</script>