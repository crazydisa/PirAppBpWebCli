<template>
    <DxSelectBox
        ref="selectBoxRef"
        :items="items"
        :data-source="dataSource"
        :value="value"
        :key-expr="keyExpr"
        :display-expr="displayExpr"
        :width="width"
        @value-changed="onValueChanged"
    />
</template>

<script>

import DxSelectBox from 'devextreme-vue/select-box';

export default {
  components: { 
    DxSelectBox
  },
  props: {
    items: {
      type: Array,
      default: () => []
    },
    dataSource: {
    },
    value: {
    },
    width: {
    },
    keyExpr: {
      type: String,
      default: () => null
    },
    displayExpr: {
      type: String,
      default: () => null
    },
    onValueChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  computed: {
    instance () {
      return this.$refs["selectBoxRef"].instance;
    }
  }
}
</script>