<template>
    <DxTextBox
        ref="textBoxRef"
        :value="value"
        :placeholder="placeholder"
        :width="width"
        :buttons="buttons"
        :show-clear-button="showClearButton"
        @value-changed="onValueChanged"
    />
</template>

<script>

import DxTextBox from 'devextreme-vue/text-box';

export default {
  components: { 
    DxTextBox
  },
  props: {
    value: {
      type: String,
      default: () => ""
    },
    placeholder: {
      type: String,
      default: () => ""
    },
    width: {
    },
    buttons: {
      type: Array,
      default: () => null
    },
    showClearButton: {
      type: Boolean,
      default: () => false
    },
    showInFocus: {
      type: Boolean,
      default: () => false
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  mounted() {
    if(this.showInFocus) {
      this.$refs["textBoxRef"].instance.focus();
    }
  }
}
</script>