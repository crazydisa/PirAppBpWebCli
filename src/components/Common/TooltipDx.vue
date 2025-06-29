<template>
    <DxTooltip
        :v-model="visible"
        :close-on-outside-click="closeOnOutsideClick"
        :position="position"
        :target="target">
        <slot name="content">
        </slot>
    </DxTooltip>
</template>

<script>

import { DxTooltip } from 'devextreme-vue/tooltip';

export default {
  components: { 
    DxTooltip
  },
  props: {
    visible: {
      type: Boolean,
      default: () => false
    },
    closeOnOutsideClick: {
      type: Boolean,
      default: () => false
    },
    position: {
      type: String,
      default: () => "left"
    },
    target: {
      type: String,
    }
  }
}
</script>