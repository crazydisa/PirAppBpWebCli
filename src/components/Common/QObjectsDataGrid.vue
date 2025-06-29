<template>
    <QDataGrid
      v-if="!!objectType"
      :columns="objectTypeColumns"
      :data-source="objectsDataSource"
      :key-expr="keyExpr"
      :width="width"
      :height="height"
      :my-id="myId"
      :title="title"
      :selected="selected"
      :addedRows="addedRows"
      :sort-by="sortBy"
      :deletedRows="deletedRows"
      :changedRows="changedRows"
      :request-options="requestOptions"
      :object_type="objectType"
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
      :selection="selection"
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
import QDataGrid from "@/components/Common/QDataGrid.vue";
import componentUtils from '@/utils/components';
import notify from '@/notify';
//import utils from "@/utils";
import { mapGetters } from "vuex";
//import {  toRef} from 'vue';
export default {
  components: {
    QDataGrid
  },
  props: {
    selected: {
        type: Array,
        default: () => []
    },
    addedRows: {
        type: Array,
        default: () => []
    },
    deletedRows: {
        type: Array,
        default: () => []
    },
    changedRows: {
        type: Array,
        default: () => []
    },
    sortBy: {
        type: String,
        default: () => null
    },
    objectType: {
      type: Object,
      default: () => null
    },
    objectTypeName: {
        type: String,
        default: () => ""
    },
    selection: {
        type: String,
        default: () => "none"
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
    importDataSource: {
      default: () => []
    },
    editingMode: {
        type: String,
        default: () => "batch"
    },
    myId: {
        type: String,
        default: () => ""
    },
    requestOptions: {
      type: Object,
      default: () => null
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
    autoLoad: {
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
    title: {
        type: String,
        default: () => ""
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
      const id = e.oldData[this.keyExpr];
      const newData = e.newData;
      let requestOptions;
      if ('requestOptions' in e) {
        if(e.requestOptions)
          requestOptions = e.requestOptions
      }
      requestOptions = {actionName: "updateAnyObject", 
                            typeName: this.objectType.Name, 
                            nameSpace: this.objectType.NameSpace,
                            setterName: "setAnyObject"}
      
      requestOptions.Id = id
      requestOptions.newData = newData
      await this.$store.dispatch(requestOptions.actionName, requestOptions);
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
      // let dataTransmitted = this.dataSource!=null
      // if(dataTransmitted) dataTransmitted = this.dataSource.length>0
      // if(!dataTransmitted  && this.autoGetDataSource) {
        const getterName = this.requestOptions.getterName
        const typeName = this.objectType.Name
        const nameSpace = this.requestOptions.nameSpace
        const fullTypeName = nameSpace+"."+typeName
        //console.log("oooooo",fullTypeName)
       // if(this.importDataSource && this.importDataSource.length>0){
        //if(this.$store.getters[getterName] !== undefined) {
            //let filter = this.dataFilter.bind(this)
            //console.log("objectType.Name ----",this.objectType.Name)
            
           // if (this.autoLoad){
              //const getterName = this.requestOptions.getterName
              //const typeName = this.objectType.Name
              //const nameSpace = this.objectType.NameSpace
              //const fullTypeName = nameSpace+"."+typeName
             // if(this.$store.getters[getterName][fullTypeName]!== undefined){

                //this.$emit('q-object-data-grid-set-data-source', {dataSource:this.$store.getters[getterName][fullTypeName], myId:this.myId})
                //return this.$store.getters[getterName][fullTypeName]//?this.$store.getters["getAnyObjects"][fullTypeName]:[]
              //  if(Object.prototype.toString.call(this.importDataSource) === '[object Object]') {
                //  return [this.importDataSource]
             //   }
               // else {
                //  this.$emit('q-object-data-grid-set-data-source', {dataSource:this.importDataSource, myId:this.myId})
                 // return this.$store.getters[getterName][fullTypeName]
               // }
       // } else
       // {
          //this.$emit('q-object-data-grid-set-data-source', {dataSource:this.importDataSource, myId:this.myId})
          //return this.$store.getters[getterName][fullTypeName]
        //}
        //this.$emit('q-object-data-grid-set-data-source', {dataSource:this.$store.getters[getterName][fullTypeName], myId:this.myId})
        return this.$store.getters[getterName][fullTypeName]
                //}
           // }
            // else{
            //   const getterName = "get" + utils.getPluralName(this.objectType.Name);
            //   if(this.$store.getters[getterName] !== undefined) {
            //     console.log("getterName ----",this.$store.getters[getterName])
            //     return this.$store.getters[getterName]//.filter(filter);
            //   }
            // }
        //}
       
      //}
      // console.log("Original DataSource Apply = ",this.dataSource)
       
       //this.importDataSource
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
      let otc = componentUtils.qGetObjectTypeColumns(this.objectType, this.columns, this.autoColumns);

      return otc
    },
    editingFormItems() {
      return componentUtils.getObjectTypeFormItems(this.objectType, this.columns, this.autoColumns);
    }
  },
  watch: {
  },
   async mounted() {
    let requestOptions = {...this.requestOptions}
    if(this.objectType && this.autoLoad){
      requestOptions.typeName = this.objectType.Name
      requestOptions.nameSpace = this.objectType.NameSpace
      await this.$store.dispatch(requestOptions.actionName, requestOptions)
    }
  }
};
</script>
