<template>
    <DxList
        ref="listRef"
        :items="items"
        :data-source="dataSource"
        :selected-items="selectedItems"
        :show-selection-controls="showSelectionControls"
        :display-expr="displayExpr"
        :key-expr="keyExpr"
        :width="width"
        :height="height"
        :search-enabled="searchEnabled"
        :selection-mode="selectionMode"
        @selection-changed="onSelectionChanged"
    />
</template>

<script>

import DxList from 'devextreme-vue/list';

export default {
  components: { 
    DxList
  },
  props: {
    dataSource: {
    },
    items: {
      type: Array,
      default: () => []
    },
    selectedItems: {
      type: Array,
      default: () => []
    },
    showSelectionControls: {
      type: Boolean,
      default: () => false
    },
    searchEnabled: {
      type: Boolean,
      default: () => false
    },
    displayExpr: {
      type: String,
      default: () => null
    },
    keyExpr: {
      type: String,
      default: () => null
    },
    width: {
      default: () => null
    },
    height: {
      default: () => null
    },
    selectionMode: {
      type: String,
      default: () => "single"
    },
    onSelectionChanged: {
      type: Function,
      default: () => function() {}
    }
  },
  computed: {
    instance () {
      return this.$refs["listRef"].instance;
    }
  }
}
</script>