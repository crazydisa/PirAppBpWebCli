<template>
    <div class="dx-field">
        <div class="dx-field-label">Планы</div>
        <div class="dx-field-value">
            <DxDropDownBox
            ref="dropDownBoxRef"
            :value="selectedRows"
            :drop-down-options="dropDownOptions"         
            @opened= "onOpen"
            :input-attr="{ 'aria-label': 'Owner' }"
            :defer-rendering="false"
            :display-expr="displayExpr"
            :show-clear-button="true"
            :data-source="objectsDataSource"
            value-expr="Id"
            placeholder="Select a value..."
           

            >
                <template #content="">
                    <ObjectsDataGrid
                        :object-type="objectType"
                        :data-source="objectsDataSource"
                        
                        :auto-get-data-source="autoGetDataSource"
                        :auto-columns="true"
                        :show-search-panel="false"
                        :show-filter-row="false"
                        :allow-editing="false"
                        :allow-column-resizing="true"
                        :allow-column-fixing="true"
                        selection-mode="single"
                        :editing-mode="editingMode"
                        :my-id="myId"
                        :on-selection-changed="onDataGridSelectionChanged"
                        @data-grid-popup-open="mDataGridPopupOpen">
                        <DxSelection mode="single"/>
                <DxPaging
                    :enabled="true"
                    :page-size="10"
                />
                <DxFilterRow :visible="true"/>
                <DxScrolling mode="virtual"/>
                    </ObjectsDataGrid> 
                </template>
            </DxDropDownBox>
        </Div>
    </div>
</template>

<script>
    //:selected-row-keys="gridBoxValue"
    import ObjectsDataGrid from '@/components/Common/ObjectsDataGrid.vue';
    //import { ref } from 'vue';
    import DxDropDownBox from 'devextreme-vue/drop-down-box';
    import utils from "@/utils";
    //import CustomStore from 'devextreme/data/custom_store';
    //import {DxDataGrid, DxColumn, DxSelection, DxDataGridTypes,
//}   //from 'devextreme-vue/data-grid';
    //const isGridBoxOpened = ref(false);
    //const gridBoxValue = ref([1]);
    export default {
        components: {
            ObjectsDataGrid,
            DxDropDownBox,
           
           // DropDownDataGrid: () => import('@/components/Common/ObjectsDataGrid.vue')
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
    onValueChanged: { // функция меняет значение в ячейке dataGrid. Если новая строка в режиме popup, то это boolean
        type: Function,
        default: () => function() {}
    },      
    value: {
        default: () => null
    },
    
    valueExpr: {
        type: String, // Если значение задано, то будет подразуменваться, что результатом будет ID или массив ID. Если значение пустое, то будут возвращаться объекты
        default: () => null 
    },

    
         },
         methods: {
            mDataGridPopupOpen(e){
                //console.log("xcxxxxxxxxxxxxxxxxxx")
                this.$emit('data-grid-popup-open',e); 
            },
            displayExpr: function(item) {
                

                return item && 'Id: ' + item.Id + ', Name: ' + item.Name;
            },
             
            async onDataGridSelectionChanged(selectionChangedArgs) {
                if (this.selectionMode == "multiple") {
                    if (this.valueExpr) {                    
                        this.onValueChanged(selectionChangedArgs.selectedRowKeys);
                    } else {
                        this.onValueChanged(selectionChangedArgs.selectedRowsData);
                    }
                }
                else if (this.selectionMode == "single") {
                    if (this.valueExpr) {                    
                        this.onValueChanged(selectionChangedArgs.selectedRowKeys[0]);
                    } else {
                        this.onValueChanged(selectionChangedArgs.selectedRowsData[0]);
                    }                
                } 
                this.selectedRows = selectionChangedArgs.selectedRowKeys;
                let actionName = "loadShedullers"

                await this.$store.dispatch(actionName, this.selectedRows[0])
                
            },

             onGridSelectionChanged({ selectedRowsData })  {
                const data = selectedRowsData;

                this.gridBoxValue = data
                this.isGridBoxOpened = false;

                this.$refs["dxDropDownBoxRefs"].instance.close();
            },
            onOpen(){
                if (this.value == null) {
                        this.originalValue = null;
                } else if (this.selectionMode == "multiple") {
                    this.originalValue = [...this.value];
                } else if (this.selectionMode == "single") {
                    if (Object.is(this.value)) {
                        this.originalValue = {...this.value};
                    } else {
                        this.originalValue = this.value;
                    }
                }

            },
            misGridBoxOpened(){

                
            },
            getSelectedRowsByMasterGridValue (masterGridValue)  { 
            if (this.selectionMode == "multiple") {
                if (!masterGridValue || masterGridValue && !masterGridValue.length) {
                    return [];
                } else {                    
                    return this.valueExpr ? masterGridValue : masterGridValue.map(r => r[this.keyExpr]);
                }

            } else if (this.selectionMode == "single") {
                if (!masterGridValue) {
                    return [];
                } else {  
                    return this.valueExpr ? [masterGridValue] : [masterGridValue[this.keyExpr]];
                }
            }

            return [];
        }

         },
         computed: {
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
         data(){
            return {
                isGridBoxOpened: true,
                gridBoxValue: null,
                selectedRows: [],
                originalValue: null,
                    dropDownOptions: { 
                    width: this.width, 
                    height: this.height, 
                    minHeight: this.height,
                    toolbarItems: [{
                        toolbar: "bottom",
                        location: "after",
                        widget: "dxButton",
                        options: {
                            text: 'Ok',
                            onClick: () => {
                                this.$refs["dropDownBoxRef"].instance.close();
                            }
                        }
                        },{
                            toolbar: "bottom",
                            location: "after",
                            widget: "dxButton",
                            options: {
                                text: 'Cancel',
                                onClick: () => {
                                    this.selectedRows = this.getSelectedRowsByMasterGridValue(this.originalValue);
                                    this.onValueChanged(this.originalValue);
                                    this.$refs["dropDownBoxRef"].instance.close();
                                    //this.originalValue
                                }
                            }
                        },  
                    ]               
                },

            }
         }
    }
</script>
<style scoped>
.dx-fieldset {
  height: 500px;
}
</style>