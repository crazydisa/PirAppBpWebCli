<template>

  <DxMenu

      :data-source="dataSource"

      :hide-submenu-on-mouse-leave="true"

      :show-first-submenu-mode="{name:'onHover'}"

      :orientation="orientation"

      :display-expr="displayExpr"

      item-template="item"

      @item-click="onItemClick"    

  >

  <template #item="{ data }">

    <slot name="item" :data="data"></slot>

  </template>

  </DxMenu>

 

</template>



<script>



import { DxMenu } from 'devextreme-vue';



export default {

components: {

  DxMenu

},

props: {

  dataSource: {

    type: Array,

    default: () => []

  },

  hideSubmenuOnMouseLeave: {

    type: Boolean,

    default: () => false

  },

  orientation: {

    type: String,

    default: () => "horizontal"

  },

  displayExpr: {

    type: String,

    default: () => "Title"

  },

  onItemClick: {

    type: Function,

    default: () => function() {}

  }

}

}

</script>