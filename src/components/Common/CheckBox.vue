<template>
  <div :style="cGetStyle">
    <DxCheckBox
        :ref="checkBoxRef"
        :text="text"
        :hint="hint"
        :icon-size="iconSize"
        :value="value"
        @value-changed="mOnValueChanged"
    />
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import DxCheckBox from 'devextreme-vue/check-box';

export default {
  components: { 
    DxCheckBox
  },
  props: {
    checkBoxRef: {
      type: String,
      default: () => "checkBoxRef"
    },
    myId: {
        type: String,
        default: () => "checkBoxId"
    },
    value: {
      type: Boolean,
      default: () => false
    },
    text: {
      type: String,
      default: () => ""
    },
    hint: {
      type: String,
      default: () => ""
    },
    iconSize: {
      type: String,
      default: () => "25"
    },
    MYSTYLE: {
      type: Object,
      default: () => null
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  methods: {
    
    ...mapMutations([
        "setGraph",  
        "setValue",
    ]),
    mOnValueChanged(e){
      
      this.onValueChanged()
      e.checkBoxId = this.myId
      this.$emit('check-box-changed', e);
      //console.log("Checkbox value!!!!!!!!!! = ", e.value)
    },
  },
  computed:{
    ...mapGetters([
        "getSetting",
        "getValue",
        "getGraph",
    ]),
    cGetStyle(){
      return this.MYSTYLE
    }
  },
  mounted() {
    if(this.showInFocus) {
      this.$refs["checkBoxRef"].instance.focus();
    }
  }
}
</script>