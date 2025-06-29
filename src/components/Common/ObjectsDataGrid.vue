<template>
    <DataGrid
      v-if="!!objectType"
      :columns="objectTypeColumns"
      :data-source="objectsDataSource"
      :key-expr="keyExpr"
      :width="width"
      :height="height"
      :my-id="myId"
      :show-column-chooser="showColumnChooser"
      :show-reorder-button="showReorderButton && allowUpdating"
      :show-refresh-button="showRefreshButton"
      :show-reset-filters-button="showResetFiltersButton"
      :show-search-panel="showSearchPanel"
      :show-filter-row="showFilterRow"
      :show-page-selector="showPageSelector"
      :show-editor-by-row-click="showEditorByRowClick"
      :show-word-wrap-button="showWordWrapButton"
      :word-wrap-enabled="false"
      :selection-mode="selectionMode"
      :editing-mode="editingMode"
      :editing-form-title="editingFormTitle"
      :editing-form-width="editingFormWidth"
      :editing-form-height="editingFormHeight"
      :editing-form-items="editingFormItems"
      :editing-form-col-count="editingFormColCount"
      :page-size="50"
      :allow-column-resizing="allowColumnResizing"
      :allow-column-fixing="allowColumnFixing"
      :allow-paging="allowPaging"
      :allow-adding="allowAdding"
      :allow-updating="allowUpdating"
      :allow-deleting="allowDeleting"
      :allow-grouping="allowGrouping"
      :allow-master-detail="allowMasterDetail"
      :export-enabled="exportEnabled"
      :export-file-name="exportFileName"
      :selected-row-keys="selectedRowKeys"
      :on-toolbar-preparing="onToolbarPreparing"
      :on-context-menu-preparing="onContextMenuPreparing"
      :on-selection-changed="onSelectionChanged"
      :on-content-ready="contentReady"
      :on-cell-prepared="onCellPrepared"
      :on-row-prepared="objectRowPrepared"
      :on-editor-preparing="editorPreparing"
      :on-row-validating="objectRowValidating"
      :on-row-inserting="objectRowInserting"
      :on-row-updating="objectRowUpdating"
      
      :on-row-removing="objectRowRemoving"
      :on-reordering="objectsReordering"
      :on-refreshing="onRefreshing"
      @data-grid-object-selected="dataGridObjectSelected"
      @data-grid-popup-open = "dataGridPopupOpen"
    />
</template>

<script>
//:on-row-updated="objectRowUpdated"
//import { mapGetters } from "vuex";
import DataGrid from "@/components/Common/DataGrid.vue";
import componentUtils from '@/utils/components';
import notify from '@/notify';
import utils from "@/utils";
import { mapGetters } from "vuex";

export default {
  components: {
    DataGrid
  },
  props: {
    objectType: {
      type: Object,
      default: () => null
    },
    objectTypeName: {
        type: String,
        default: () => ""
    },
    columns: {
      type: Array,
      default: () => []
    },
    autoColumns: {
      type: Boolean,
      default: () => true
    },
    dataSource: {
      default: () => null
    },
    editingMode: {
        type: String,
        default: () => "batch"
    },
    myId: {
        type: String,
        default: () => ""
    },
    
    editingFormTitle: {
        type: String,
        default: () => null
    },
    editingFormWidth: {
        type: String,
        default: () => null
    },
    editingFormHeight: {
        type: String,
        default: () => null
    },
    editingFormColCount: {
        type: Number,
        default: () => 2
    },
    idComp: {
        type: Number,
        default: () => 0
    },
    allowEditing: {
        type: Boolean,
        default: () => false
    },
    autoGetDataSource: {
        type: Boolean,
        default: () => true
    },
    
    width: {
        type: String,
        default: () => null
    },
    height: {
        type: String,
        default: () => null
    },

    showColumnChooser: {
        type: Boolean,
        default: () => false
    },
    showReorderButton: {
        type: Boolean,
        default: () => false
    },
    showWordWrapButton: {
        type: Boolean,
        default: () => false
    },
    showRefreshButton: {
        type: Boolean,
        default: () => false
    },
    showResetFiltersButton: {
        type: Boolean,
        default: () => false
    },
    showSearchPanel: {
        type: Boolean,
        default: () => false
    },
    showFilterRow: {
        type: Boolean,
        default: () => false
    },
    showPageSelector: {
        type: Boolean,
        default: () => false
    },
    showEditorByRowClick: {
        type: Boolean,
        default: () => false
    },

    allowColumnResizing: {
        type: Boolean,
        default: () => false
    },
    allowColumnFixing: {
        type: Boolean,
        default: () => false
    },
    allowPaging: {
        type: Boolean,
        default: () => true
    },
    
    allowGrouping: {
        type: Boolean,
        default: () => false
    },
    allowMasterDetail: {
        type: Boolean,
        default: () => false
    },

    selectionMode: {
        type: String,
        default: () => "single"
    },

    exportEnabled: {
        type: Boolean,
        default: () => false
    },
    exportFileName: {
        type: String,
        default: () => null
    },

    onToolbarPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContextMenuPreparing: {
        type: Function,
        default: () => function() {}
    },
    onSelectionChanged: {
        type: Function,
        default: () => null
    },
    dataFilter: {
        type: Function,
        default: () => function() {return true}
    },
    onCellPrepared: {
        type: Function,
        default: () => function() {}
    },
    onRowInserting: {
        type: Function,
        default: () => function() {}
    },
    onRefreshing: {
        type: Function,
        default: () => function() {}
    },
    selectedRowKeys: {
        type: Array,
        default: () => null
    },
  },
  data() {
    return {
      grid: null,
      keyExpr: "Id",
      displayExpr: "Title"
    }
  },
  methods: {
    contentReady(e) {
        this.grid = e.component;
    },
    dataGridObjectSelected(e) {
      this.$emit('data-grid-object-selected', e)
    },
    dataGridPopupOpen(e) {
      this.$emit('data-grid-popup-open', e)
    },
    
    objectRowPrepared(e) {
      if(e.rowType === "data") {
        if(typeof e.data.Id !== "number") {
          // console.log("objectRowPrepared", e.data.Id, e)
        }
      }
    },

    editorPreparing(e) {
      if(e.parentType === "filterRow" || e.parentType === "searchPanel") {
        e.updateValueTimeout = 1000;
      }
      else if(e.parentType == 'dataRow' && e.lookup) {  
        e.editorOptions.itemTemplate = function(data) {  
            const title = data.Title + (data.Description ? (" - " + data.Description) : "");
            return "<span title='" + title + "'>" + title +"</span>";
        }
      } 
    },
    objectRowValidating(e) {
      e.newData.DepartmentsIsRequired = true;
      if(!e.isValid && e.brokenRules.length) {
          let brokenRule = null;
          let columnIndex = null;
          for(let i in e.brokenRules) {
              if(brokenRule == null || e.brokenRules[i].columnIndex < columnIndex) {
                  brokenRule = e.brokenRules[i];
                  columnIndex = e.brokenRules[i].columnIndex;
              }
          }
          notify.warning(null, null, brokenRule.message);
      }
    },
    async objectRowInserting(e) {
      this.onRowInserting(e);
      let values = e.data;
      values.TypeId = this.objectType.Id;
      const actionName = "create" + this.objectType.Name;
      await this.$store.dispatch(actionName, values);
      this.onRefreshing();
    },
    async objectRowUpdating(e) {
      const key = e.oldData[this.keyExpr];
      const values = e.newData;
      const actionName = "update" + this.objectType.Name;
      await this.$store.dispatch(actionName, {key, values});
      this.onRefreshing();
    },
    async objectRowRemoving(e) {
      const key = e.data[this.keyExpr];
      const actionName = "delete" + this.objectType.Name;
      await this.$store.dispatch(actionName, key);
      this.onRefreshing();
    },
    async objectsReordering(objects) {
      for(let i in objects) {
        const actionName = "update" + this.objectType.Name;
        await this.$store.dispatch(actionName, objects[i]);
      }
      this.onRefreshing();
    }
  },
  computed: {
    ...mapGetters([
        "getGraph",
        "getValue",
        "getSetting",

    ]),
    
    objectsDataSource() {
      if(!this.dataSource && this.autoGetDataSource) {
        
        const getterName = "get" + utils.getPluralName(this.objectType.Name);
        if(this.$store.getters[getterName] !== undefined) {
            let filter = this.dataFilter.bind(this)
            return this.$store.getters[getterName].filter(filter);
          
        }
       
      }
      
      if(Object.prototype.toString.call(this.dataSource) === '[object Object]') {
        return [this.dataSource]
      }
      return this.dataSource;
    },
    allowAdding() {
      const actionName = "Create" + this.objectType.Name;
      return this.$store.getters.currentUserIsAllowedAction(actionName) && this.allowEditing;
    },
    allowUpdating() {
      const actionName = "Update" + this.objectType.Name;
      return this.$store.getters.currentUserIsAllowedAction(actionName) && this.allowEditing;
    },
    allowDeleting() {
      const actionName = "Delete" + this.objectType.Name;
      return this.$store.getters.currentUserIsAllowedAction(actionName) && this.allowEditing;
    },
    objectTypeColumns() {
      
        return componentUtils.getObjectTypeDataGridColumns(this.objectType, this.columns, this.autoColumns);
      
      
    },
    editingFormItems() {
      return componentUtils.getObjectTypeFormItems(this.objectType, this.columns, this.autoColumns);
    }
  },
  watch: {
  },
  async mounted() {
    //if(this.objectTypeName!=="" && !this.objectType){
      //this.objectType = this.$store.getters["getObjectTypes"].find(o => o.Name == this.objectTypeName)
    //}
  }
};
</script>
