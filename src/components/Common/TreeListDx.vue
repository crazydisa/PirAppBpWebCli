<template>
  <DxTreeList
    id="tasks"
    :data-source="objectsDataSource"
    :show-borders="true"
    :column-auto-width="true"
    :word-wrap-enabled="true"
    :expanded-row-keys="expandedRowKeys"
    :selected-row-keys="selectedRowKeys"
    :key-expr="keyExpr"
    :parent-id-expr="parentIdExpr"
  >

    <DxSearchPanel
      :visible="true"
      :width="250"
    />
    <DxHeaderFilter :visible="true"/>
    <DxSelection mode="multiple"/>
    <DxColumnChooser :enabled="true"/>

    
  </DxTreeList>
</template>
<script>
import {
  DxTreeList,
  //DxColumn,
  DxColumnChooser,
  DxHeaderFilter,
  DxSearchPanel,
  DxSelection,
  //DxLookup,
} from 'devextreme-vue/tree-list';
//import DxTreeView from 'devextreme-vue/tree-view';
//import DxContextMenu from 'devextreme-vue/context-menu';
import 'devextreme/dist/css/dx.light.css';
import { mapGetters, mapActions, mapMutations } from "vuex";
import utils from "@/utils";
export default {
  components: { 
    DxTreeList,
    //DxColumn,
    DxColumnChooser,
    DxHeaderFilter,
    DxSearchPanel,
    DxSelection,
   // DxLookup,
  },

  props: {
    
    dataSource: {
    },
    objectType: {
      type: Object,
      default: () => null
    },
    showBorders: {
      type: Boolean,
      default: true
    },
    columnAutoWidth: {
      type: Boolean,
      default: true
    },
    myId: {
        type: String,
        default: () => ""
    },
    wordWrapEnabled: {
      type: Boolean,
      default: true
    },
    expandedRowKeys: {
      type: Array,
      default: () => []
    },
    selectedRowKeys: {
      type: Array,
      default: () => []
    },
    keyExpr: {
      type: String,
      default: () => "Id"
    },
    parentIdExpr: {
      type: String,
      default: () => "ParentId"
    },
    autoGetDataSource: {
        type: Boolean,
        default: () => true
    },
  },
  methods: {
    ...mapActions([
         
        "updateGraph", 
        "updateValue",  
    ]),
    ...mapMutations([
        "setGraph",  
        "setValue",
    ]),

    
  },
    
  data() {
      return {
        dSelectedObj: null,
        dSettingsDenis: this.settingsDenis,
      }
    },

    computed: {
      ...mapGetters([
        "getBranchTreeView",
        
        "getSetting",
        "getValue",
        "getComp",
        "getGraph",
        "getAllPropsByCompName"
    ]),
    objectsDataSource() {
                if(!this.dataSource && this.autoGetDataSource) {
                    
                    const getterName = "get" + utils.getPluralName(this.objectType.Name);
                    if(this.$store.getters[getterName] !== undefined) {
                        return this.$store.getters[getterName];
                    
                    }
        
                } 
        
                if(Object.prototype.toString.call(this.dataSource) === '[object Object]') {
                    return [this.dataSource]
                }
                return this.dataSource;
            },
      
    
  },

  
}
</script>
<style>

 
  
</style>