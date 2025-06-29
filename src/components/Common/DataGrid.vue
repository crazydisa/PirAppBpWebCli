<template>
  <div class="data-grid-container">
      <DxDataGrid
        :ref="myId"
        :columns="columns"
        :summary="summary"
        :data-source="dataSource"
        :selected-row-keys="selectedRowKeys"
        :show-borders="true"
        :show-row-lines="true"
        :column-auto-width="false"
        :allow-column-resizing="allowColumnResizing"
        column-resizing-mode="widget"
        :width="width"
        :height="height"
        :hover-state-enabled="true"
        :word-wrap-enabled="wordWrapEnabledValue"
        :selection="selection"
        :key-expr="keyExpr"
        @toolbar-preparing="toolbarPreparing"
        @context-menu-preparing="contextMenuPreparing"
        @content-ready="contentReady"
        @row-click="mRowClick"
        @cell-click="onCellClick"
        @row-prepared="rowPrepared"
        @cell-prepared="cellPrepared"
        @selection-changed="mSelectionChanged"
        @init-new-row="initNewRow"
        @editing-start="editingStart"
        @option-changed="onOptionChanged" 
        @editor-preparing="onEditorPreparing"
        @row-validating="rowValidating"
        @row-expanded="onRowExpanded"
        @row-collapsed="onRowCollapsed" 
        @row-inserting="rowInserting"
        @row-updating="rowUpdating"
        @row-removing="rowRemoving"
        @row-inserted="rowInserted"
        @row-updated="rowUpdated"
        @row-removed="rowRemoved"
        @exported="onExported"
        >
        <DxSearchPanel :visible="showSearchPanel"/>
        <DxHeaderFilter :visible="true"/>
        <DxFilterRow :visible="showFilterRow"/>
        <DxGroupPanel :visible="allowGrouping"/>
        <DxScrolling show-scrollbar="always" />
        <DxRowDragging
            :allow-reordering="allowReordering"
            :on-reorder="onReorder"
            :show-drag-icons="true"
        />
        <DxColumnChooser 
            :enabled="showColumnChooser"
            :allow-search="true"
            mode="select"
        />
        <DxColumnFixing 
            :enabled="allowColumnFixing"
        />
        <DxEditing
            :allow-adding="allowAdding"
            :allow-updating=true
            :allow-deleting="allowDeleting"
            :use-icons="true"
            :mode="editingMode">
            <DxForm
                :col-count="editingFormColCount"
                :items="editingFormItems"
            >
            </DxForm>
            <DxPopup
                :show-title="!!editingFormTitle"
                :title="editingFormTitle"
                :width="editingFormWidth"
                :height="editingFormHeight"
                :drag-enabled="true"
                :resize-enabled="true"/>
        </DxEditing>
        <DxPaging 
            :enabled="allowPaging"
            :page-size="pageSize"
        />
        <DxSelection
        select-all-mode="allPages"
        show-check-boxes-mode="always"
        mode="multiple"
      />
        <DxPager
            :show-page-size-selector="showPageSelector"
            display-mode="full"
            :allowed-page-sizes="[10, 20, 50, 100, 200, 500, 1000]"
            :show-info="showPageSelector"
            :visible="pagerVisible"
        />
        <DxExport
            :enabled="exportEnabled"
            :customize-excel-cell="customizeExcelCell"
            :file-name="exportFileName"
        />
        <DxMasterDetail
            :enabled="allowMasterDetail"
            template="masterDetailTemplate"
        />
        <template #masterDetailTemplate="{ data }">
            <slot name="masterDetail" v-bind:data="data">
            </slot>
        </template>
        <template #headerCellTemplate="{ data }">
            <slot name="headerCellTemplate" v-bind:data="data">
            </slot>
        </template>
        <template #titlesTemplate="{ data: cellInfo }">
            <div v-if="wordWrapEnabledValue">
                <div v-for="(item, index) in cellInfo.value" v-bind:key="index">
                    {{ getItemTitle(cellInfo, item) }}
                </div>
            </div>
            <div v-else>
                <span v-for="(item, index) in cellInfo.value" v-bind:key="index">{{index > 0 ? ", " : ""}}{{ getItemTitle(cellInfo, item) }}</span>
            </div> 
        </template>
        <template #numericTitlesTemplate="{ data: cellInfo }">
            <div v-if="cellInfo.value && cellInfo.value.length == 1">
                {{ getItemTitle(cellInfo, cellInfo.value[0]) }}
            </div>
            <div v-else-if="wordWrapEnabledValue">
                <div v-for="(item, index) in cellInfo.value" v-bind:key="index">
                    {{ (index + 1) }}) {{ getItemTitle(cellInfo, item) }}
                </div>
            </div>
            <div v-else>
                <span v-for="(item, index) in cellInfo.value" v-bind:key="index">{{index > 0 ? "; " : ""}}{{ (index + 1) }}) {{ getItemTitle(cellInfo, item) }}</span>
            </div> 
        </template>
        <template #multilineTextTemplate="{ data }">
            <div v-if="wordWrapEnabledValue">
                <span v-for="(line, index) in data.text.split('\n')"  v-bind:key="index">{{line}}<br></span>
            </div>
            <div v-else>
                {{data.text}}
            </div>
        </template>
        <template #mySuperTemplate="{ data }">
            <div >
                {{data.text}}
                
                <button class="dx-icon dx-icon-detailslayout" v-on:click="dataGridButtonCell(data)"></button>
                     
            </div>
            
        </template>
        
      </DxDataGrid>
      
  </div> 
  
</template>

<script>

import { 
    DxDataGrid, 
    DxColumnChooser, 
    DxColumnFixing,
    DxEditing,
    DxForm,
    DxGroupPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxPopup,
    DxScrolling,
    DxRowDragging,
    DxMasterDetail,
    DxPaging,
    DxPager,
    DxExport,
    DxSelection,
  
} from 'devextreme-vue/data-grid';

import localizeFilter from '@/localize';
import componentUtils from '@/utils/components';
import 'devextreme/dist/css/dx.light.css';
import { mapGetters , mapMutations } from "vuex";

export default {
  components: {
    DxDataGrid, 
    DxColumnChooser,
    DxColumnFixing,
    DxEditing,
    DxForm,
    DxGroupPanel,
    DxHeaderFilter,
    DxFilterRow,
    DxSearchPanel,
    DxPopup,
    DxScrolling,
    DxRowDragging,
    DxMasterDetail,
    DxPaging,
    DxPager,
    DxExport,
    DxSelection,
  },
  props: {
    rowClick: {
      type: Function,
      default: () => function(e) {
       
        if(this.showEditorByRowClick && e.rowType == "data") {
            e.component.editRow(e.rowIndex);
        }}
    },  
    userStateKey: {
        type: String,
        default: () => null
    },
    myId: {
        type: String,
        default: () => "myDataGrid"
    },
    logMenuEnabled: {
        type: Boolean,
        default: () => false
    },
    logTypeName: {
        type: String,
        default: () => null
    },
    logTypeFieldName: {
        type: String,
        default: () => "LogTypeName"
    },
    logKeyExpr: {
        type: String,
        default: () => "Id"
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
    
    allowAdding: {
        type: Boolean,
        default: () => false
    },
    allowUpdating: {
        default: () => false
    },
    allowDeleting: {
        default: () => false
    },
    allowGrouping: {
        type: Boolean,
        default: () => false
    },
    allowMasterDetail: {
        type: Boolean,
        default: () => false
    },
    

    parentData: {
        type: Object,
        default: () => null
    },
    columns: {
        type: Array,
        default: () => []
    },
    summary: {
        type: Object,
        default: () => null
    },
    dataSource: {
        default: () => null
    },
    selectedRowKeys: {
        type: Array,
        default: () => null
    },
    
    keyExpr: {
        type: String,
        default: () => ""
    },

    editingMode: {
        type: String,
        default: () => "none"
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
    editingFormItems: {
        type: Array,
        default: () => null
    },
    editingFormColCount: {
        type: Number,
        default: () => 2
    },

    selectionMode: {
        type: String,
        default: () => "single"
    },
    selectFirstRow: {
        type: Boolean,
        default: () => false
    },

    exportEnabled: {
        type: Boolean,
        default: () => false
    },
    exportFileName: {
        type: String,
        default: () => null
    },

    wordWrapEnabled: {
        type: Boolean,
        default: () => true
    },
    pageSize: {
        type: Number,
        default: () => 20
    },


    fileDownloadNameExpr: {
        type: String,
        default: () => null
    },

    fileDownloadUrl: {
        type: Function,
        default: () => null
    },

    fileUploadUrl: {
        type: Function,
        default: () => null
    },

    onFileUploaded: {
        type: Function,
        default: () => function() {}
    },


    onToolbarPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContextMenuPreparing: {
        type: Function,
        default: () => function() {}
    },
    onContentReady: {
        type: Function,
        default: () => function() {}
    },

    onRowPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellPrepared: {
        type: Function,
        default: () => function() {}
    },
    onCellClick: {
        type: Function,
        default: () => function() {
        
        }
    },

    onInitNewRow: {
        type: Function,
        default: () => function() {}
    },
    onEditingStart: {
        type: Function,
        default: () => function() {}
    },
    onOptionChanged: {
        type: Function,
        default: () => function() {}
    },

    onEditorPreparing: {
        type: Function,
        default: () => function() {}
    },
    onRowValidating: {
        type: Function,
        default: () => function() {}
    },

    onRowExpanded: {
        type: Function,
        default: () => function() {}
    },
    onRowCollapsed: {
        type: Function,
        default: () => function() {}
    },

    onRowInserting: {
        type: Function,
        default: () => function() {}
    },
    onRowInserted: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdating: {
        type: Function,
        default: () => function() {}
    },
    onRowUpdated: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoving: {
        type: Function,
        default: () => function() {}
    },
    onRowRemoved: {
        type: Function,
        default: () => function() {}
    },
    onReordering: {
        type: Function,
        default: () => function() {}
    },
    onRefreshing: {
        type: Function,
        default: () => function() {}
    },
    onSelectionChanged: {
        type: Function,
        default: () => function() {
        
        }
    },
    onResetFiltersButton: {
        type: Function,
        default: () => null
    },
    onExported: {
        type: Function,
        default: () => function() {}
    }
  },
  methods: {
    ...mapMutations([
        "setGraph",  
        "setValue",
        "setDSetting",
    ]),
     dataGridButtonCell(e){
        
        let dataGrid = this.$refs[this.myId].instance;
        let newE = {id: this.myId, selectedItem: e, datagrid: dataGrid}

        this.$emit('data-grid-popup-open', newE); 
        //this.dPopupVisible=true
    },
    mSelectionChanged(e){
        e = e? e: {}
        e.senderContext = this
        this.onSelectionChanged(e)
    },
    mRowClick(e){
        e = e? e: {}
        e.senderContext = this
        this.$emit('data-grid-object-selected', e)
    },
    mPopupClickClose() {
        this.dPopupVisible = false
      },
    setGridColumns() {
        let gridColumns = [];
        
        if(this.columns) {
            gridColumns = this.columns.map(column => {
                if(column.isRequired) {
                    column.validationRules = [{ type: "required" }];
                }

                if(column.lookup && column.lookup.dataSource) {
                    if(!column.lookup.displayExpr) {
                        column.lookup.displayExpr = "Title";
                    }
                    if(!column.lookup.valueExpr) {
                        column.lookup.valueExpr = "Id";
                    }
                    if(!column.lookup.keyExpr) {
                        column.lookup.keyExpr = "Id";
                    }
                }
                
                if((column.cellTemplate == "titlesTemplate" || column.cellTemplate == "numericTitlesTemplate") && column.lookup && column.lookup.valueExpr) {
                    const valueExpr = column.lookup.valueExpr;
                    column.calculateFilterExpression = function(filterValue, operation, target) {
                        const dataField = this.dataField;
                        if(target === 'search' && typeof (filterValue) === 'string') {
                            return [dataField, 'contains', filterValue];
                        }
                        else {
                            return function(data) {
                                let values = [];
                                if(data) {
                                    if(dataField.includes('.')) {
                                        values = { ...data};
                                        const valueSplit = dataField.split('.');
                                        for(let i in valueSplit) {
                                            values = values[valueSplit[i]] || [];
                                        }
                                    }
                                    else {
                                        values = data[dataField] || [];
                                    }
                                }
                                if(filterValue) {
                                    const result = values.find(v => v[valueExpr] == filterValue) !== undefined;
                                    return result;
                                }
                                else {
                                    return values.length == 0;
                                }
                            };
                        }
                    }
                    if(column.dataField && column.lookup.displayExpr && !column.lookup.dataSource) {
                        column.lookup.dataSource = () => {
                            return componentUtils.getLookupValues(this.dataSource, column.dataField, column.lookup.displayExpr);
                        }
                    }
                }
                else if(column.cellTemplate == "multilineTextTemplate") {
                    column.editorType = "dxTextArea";
                    column.editorOptions = {
                        inputAttr: {
                            rows: 3
                        },
                    };
                    if(!column.formItem) {
                        column.formItem = {
                            colSpan: 2,
                            visible: true,
                            editorType: "dxTextArea"
                        };
                    }
                }
                else if(column.cellTemplate == "mySuperTemplate") {
                    column.editorType = "dxTextArea";
                    column.editorOptions = {
                        inputAttr: {
                            rows: 3
                        },
                    };
                    if(!column.formItem) {
                        column.formItem = {
                            colSpan: 2,
                            visible: true,
                            editorType: "dxTextArea"
                        };
                    }
                }

                if(this.showFilterRow) {
                    if(column.dataField == "SortIndex") {
                        column.allowFiltering = false;
                        column.allowHeaderFiltering = false;
                    }
                    if(column.lookup) {
                        column.allowFiltering = false;
                        column.allowHeaderFiltering = true;
                    }
                }
                return column;
            });

            let buttonsColumnsWidth = 0;
            if(this.allowUpdating && this.editingMode != "batch") buttonsColumnsWidth += 40;
            if(this.allowDeleting) buttonsColumnsWidth += (buttonsColumnsWidth ? 20 : 40);
            if(buttonsColumnsWidth > 0) {
                gridColumns.push({
                    type: "buttons",
                    width: buttonsColumnsWidth,
                });
            }
        }
        this.gridColumns = gridColumns;
    },
    toolbarPreparing(e) {
        
        this.gridToolbar = e;

        if(this.showReorderButton) {
            componentUtils.toolbarAddButton(e, {
                icon: "orderedlist",
                hint: localizeFilter("ReorderList"),
                onClick: async () => {
                    this.allowReordering = !this.allowReordering;
                }
            });
        }

        if(this.showWordWrapButton) {
            componentUtils.toolbarAddButton(e, {
                icon: this.wordWrapIcon,
                hint: this.wordWrapTooltip,
                onClick: async (e) => {
                    this.wordWrapEnabledValue = !this.wordWrapEnabledValue;
                    // if(this.userStateKey) {
                    //     this.$store.dispatch("updateUserSetting", {
                    //         path: this.$route.path, 
                    //         key: this.userStateKey,
                    //         field: "wordWrapEnabled",
                    //         value: this.wordWrapEnabledValue
                    //     });
                    // }
                    e.component.option("icon", this.wordWrapIcon);
                    e.component.option("hint", this.wordWrapTooltip);
                }
            });
        }

        if(this.showRefreshButton) {
            componentUtils.toolbarAddRefreshButton(e, async () => {
                this.onRefreshing();
            });
        }
      
        this.onToolbarPreparing(e);

        if(this.showResetFiltersButton) {
            componentUtils.toolbarAddItem(e, {
                location: "after",
                widget: "dxMenu",
                options: {
                    elementAttr: { class: this.gridRowsIsFiltered ? "rows-is-filtered" : "rows-is-not-filtered" },
                    dataSource: [
                        {
                            icon: "clear",
                            items: [{
                                    name: "ClearFilters",
                                    title: localizeFilter("ClearFilters"),
                                }, {
                                    name: "ResetGridState",
                                    title: localizeFilter("ResetGridState"),
                                }
                            ]
                        }
                    ],
                    displayExpr: "title",
                    onItemClick: (data) => {
                        if(data.itemData && data.itemData.name) {
                            // Сбросить фильтры
                            if(data.itemData.name == "ClearFilters") {
                                e.component.clearFilter();
                            }
                            // Сбросить все настройки таблицы
                            else if(data.itemData.name == "ResetGridState") {
                                e.component.state(null);
                            }
                        }
                    }
                }
            });
        }
    },
    contentReady(e) {
        this.grid = e.component;
        // if(this.userStateKey) {
            // if(!this.userStateTime) {
            //     this.userStateTime = new Date().getTime();
            //     const userState = this.$store.getters.getUserSettingValue(this.userStateKey);
            //     if(userState) {
            //         let state = e.component.state();
            //         state.columns = userState.columns;
            //         state.pageIndex = userState.pageIndex;
            //         state.pageSize = userState.pageSize;
            //         e.component.state(state);
            //         this.wordWrapEnabledValue = userState.wordWrapEnabled;
            //         return;
            //     }
            // }
            // else {
            //     const currentStateTime = new Date().getTime();
            //     if(currentStateTime > this.userStateTime + 3000) {
            //         const state = e.component.state();
            //         this.$store.dispatch("updateUserSetting", {
            //             path: this.$route.path, 
            //             key: this.userStateKey,
            //             value: {
            //                 columns: state.columns.map(column => {
            //                     delete column.filterValue
            //                     return column;
            //                 }),
            //                 pageIndex: state.pageIndex,
            //                 pageSize: state.pageSize,
            //                 wordWrapEnabled: this.wordWrapEnabledValue,
            //             }
            //         });
            //         this.userStateTime = new Date().getTime();
            //     }
            // }
        // }

        if(this.selectFirstRow && !this.firstRowIsSelected && this.dataSource && this.dataSource.length > 0) {
            e.component.selectRowsByIndexes([0]);
            this.firstRowIsSelected = true;
        }

        this.onContentReady(e);

        if(this.grid) {
            const combinedFilter = this.grid.getCombinedFilter();
            const gridRowsIsFiltered = combinedFilter != null && combinedFilter.length > 0;
            if(this.gridToolbar && this.gridRowsIsFiltered != gridRowsIsFiltered) {
                this.gridRowsIsFiltered = gridRowsIsFiltered;
                this.gridToolbar.component.repaint();
            }
        }
    },
    contextMenuPreparing(e) {
        if(this.showColumnChooser) {
            if(e.target == 'header') {
                if(!e.items) e.items = [];
                e.items.push({
                    text: localizeFilter("HideColumn"),
                    onItemClick: () => {
                        e.component.columnOption(e.column.dataField, "visible", false);
                    }
                });
            }
        }
        this.onContextMenuPreparing(e);

        if(e.target == 'content' && e.row && e.row.data) {
            if(!e.items) e.items = [];
            if(this.logMenuEnabled) {
                if(this.$store.getters.currentUserIsAllowedAction("LoadPageAppLogs")) {
                    const logObjectId = e.row.data[this.logKeyExpr];
                    const logTypeName = this.logTypeName ? this.logTypeName : this.logTypeFieldName ? e.row.data[this.logTypeFieldName] : null;
                    if(logObjectId && logTypeName) {
                        const logType = this.$store.getters.getTypes.find(t => t.Name == logTypeName) 
                        if(logType) {
                            e.items.push({
                                icon: "event",
                                text: localizeFilter("AppLogs"),
                                onItemClick: async () => {
                                    const query = {type: logType.Id, id: logObjectId};
                                    const routeData = this.$router.resolve({name: 'AppLogs', query});
                                    window.open(routeData.href, '_blank');
                                }
                            });
                        }
                    }
                }
            }
        }
    },
    cellPrepared(e) {
        if(e.cellElement) {
            if(e.rowType === "header") {
                e.cellElement.style.backgroundColor = 'rgb(255, 210, 0)';
                e.cellElement.style.color = '#000';
                e.cellElement.style.fontSize = '12px';
                // e.cellElement.style.border = '1px solid #333';
                e.cellElement.style.fontWeight = 'bold';
            }
            else if(e.rowType === "group") {
                // e.cellElement.style.backgroundColor = 'rgb(255, 225, 0)';
                e.cellElement.style.color = '#222';
                // e.cellElement.style.fontWeight = 'normal';
                // e.cellElement.style.border = '1px solid #555';
            }
            // else {//if(e.rowType === "data") {
            // }
        }
        this.onCellPrepared(e);
    },
    rowPrepared(e) {
        this.onRowPrepared(e);
    },
   
    initNewRow(e) {
        e.parentData = this.parentData;
        this.onInitNewRow(e);
    },
    editingStart(e) {
        if(!this.allowEditing) {
            componentUtils.hideSaveButton();
        }
        this.onEditingStart(e);
    },
    rowValidating(e) {
        this.onRowValidating(e);
    },
    rowInserting(e) {
        this.onRowInserting(e);
    },
    rowInserted(e) {
        this.onRowInserted(e);
    },
    rowUpdating(e) {
        this.onRowUpdating(e);
    },
    rowUpdated(e) {
        this.onRowUpdated(e);
    },
    rowRemoving(e) {
        this.onRowRemoving(e);
    },
    rowRemoved(e) {
        this.onRowRemoved(e);
    },
    onReorder(e) {
        const visibleRows = e.component.getVisibleRows();
        const toIndex = this.dataSource.indexOf(visibleRows[e.toIndex].data);
        const fromIndex = this.dataSource.indexOf(e.itemData);
        const items = [...this.dataSource];

        items.splice(fromIndex, 1);
        items.splice(toIndex, 0, e.itemData);
    
        let reorderItems = [];
        for(let i = 0; i < items.length; i++) {
            const item = items[i];
            if(item.SortIndex != i + 1) {
                item.SortIndex = i + 1;
                reorderItems.push({ key: item[this.keyExpr], values: item});
            }
        }
        this.onReordering(reorderItems);
    },
    reorderHiding(items) {
        if(items) {
            this.onReordering(items);
        }
        this.showReorderList = false;
    },
    cellValueChanged(value, cellInfo) {
      cellInfo.setValue(value);
      cellInfo.component.updateDimensions();
    },
    listSelectionChanged(cellInfo, addedItems, removedItems) {
        let value = cellInfo.value ? cellInfo.value : [];
        value = value.concat(addedItems);
        value = value.filter(v => !removedItems.find(r => r[this.keyExpr] == v[this.keyExpr]));
        cellInfo.setValue(value);
        cellInfo.component.updateDimensions();
    },
    listEditorOption(cellInfo, option) {
        if(cellInfo && cellInfo.column && cellInfo.column.lookup && cellInfo.column.lookup[option]) {
            if(typeof cellInfo.column.lookup[option] === 'function') {
                return cellInfo.column.lookup[option](cellInfo);
            }
            else if(cellInfo.column.lookup[option] instanceof Array) {
                return cellInfo.column.lookup[option];
            }
        }
        return null;
    },
    listEditorSelectionMode(cellInfo) {
        if(cellInfo && cellInfo.column && cellInfo.column.lookup && cellInfo.column.lookup.selectionMode) {
            return cellInfo.column.lookup.selectionMode;
        }
        return "single";
    },
    getItemTitle(cellInfo, item) {
        if(cellInfo.column.lookup) {
            const displayExpr = cellInfo.column.lookup.displayExpr;
            if(displayExpr) {
                if(displayExpr.includes('.')) {
                    let value = { ...item};
                    const displaySplit = displayExpr.split('.');
                    for(let i in displaySplit) {
                        value = value[displaySplit[i]];
                    }
                    return value;
                }
                else {
                    return item[displayExpr];
                }
            }
        }
        return item.Title;
    },
    customizeExcelCell(options) {
      var gridCell = options.gridCell;
      if(gridCell) {
        if(gridCell.rowType === "data") {
            if(gridCell.value instanceof Array) {
                let optionsValue = "";
                for(let i in gridCell.value) {
                    const cellValue = gridCell.value[i];
                    let displayValue = "";
                    if(typeof cellValue === "object")
                    {
                        const displayExpr = gridCell.column.lookup ? gridCell.column.lookup.displayExpr : null;
                        if(displayExpr) {
                            displayValue = cellValue[displayExpr];
                        }
                        else if(cellValue.ShortTitle) {
                            displayValue = cellValue.ShortTitle;
                        }
                        else if(cellValue.Title) {
                            displayValue = cellValue.Title;
                        }
                        else {
                            displayValue = "";
                        }
                    }
                    else {
                        displayValue = cellValue;
                    }
                    if(gridCell.value.length > 1) {
                        optionsValue += (i*1 + 1) + ") ";
                    }
                    optionsValue += displayValue  + "\r\n";
                }
                options.value = optionsValue;
                options.wrapTextEnabled = true;
            }
        }
      }
    },
  },
  data() {
    return {
        grid: null,
        gridColumns: null,
        gridToolbar: null,
        gridRowsIsFiltered: false,
        firstRowIsSelected: false,
        showReorderList: false,
        elementWidth: null,
        elementHeight: null,
        allowReordering: false,
        wordWrapEnabledValue: this.wordWrapEnabled,
        userStateTime: null,
        dPopupVisible: false,
        dSelectedTypeName: null,
        dSelectedTypeId: null,
        dSelectedObjectId: null,
        dSelectedButtonTypeName: null,
        dSelectedButtonTypeId: null,
        dSelectedButtonObjectId: null,
        
        dTabs: null,
    }
  },
  computed: {
    ...mapGetters([  
        "getSetting",  
        "getDSetting",   
        "getValue",
        "getGraph",
        "getAllPropsByCompName"
    ]),
    cTabs(){
        return this.getDSetting
    },
    dataGrid: function() {
            return this.$refs[this.myId].instance;
        },
    cObjectType() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Name == this.dSelectedTypeName)
      }
      return null
    },
    cObjectTypeById() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Id == this.dSelectedTypeId)
      }
      return null
    },
    cObjectData(){
        const getterName = "get" + this.dSelectedTypeName  + "ById"
        const getter = this.$store.getters[getterName]
        if(getter !== undefined) {
        return getter(this.dSelectedObjectId)
      }
      return {}
    },
    cObjectButtonType() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Name == this.dSelectedButtonTypeName)
      }
      return null
    },
    cObjectButtonTypeById() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Id == this.dSelectedButtonTypeId)
      }
      return null
    },
    cObjecButtontData(){
        const getterName = "get" + this.dSelectedButtonTypeName  + "ById"
        const getter = this.$store.getters[getterName]
        if(getter !== undefined) {
        return getter(this.dSelectedButtonObjectId)
      }
      return null
    },
    selection() {
        if(this.onSelectionChanged != null) {
            if(this.selectionMode == "single") {
                return  { 
                    mode: "single"
                };
            }
            else if(this.selectionMode == "multiple") {
                return  { 
                    mode: "multiple",
                    showCheckBoxes: true
                };
            }
        }
        return   { 
            mode: "none",
        };
    },
    allowEditing() {
      return this.allowAdding || this.allowUpdating || this.allowDeleting;
    },
    wordWrapIcon() {
        if(this.wordWrapEnabledValue) {
            return "decreaselinespacing";
        }
        else {
            return "increaselinespacing";
        }
    },
    wordWrapTooltip() {
       if(this.wordWrapEnabledValue) {
            return localizeFilter("MinRowHeight");
        }
        else {
            return localizeFilter("MaxRowHeight");
        } 
    },
    pagerVisible() {
        if(this.showPageSelector) return true;
        return "auto";
    }
  },
  watch: {
      columns() {
          this.setGridColumns();
      }
  },
  mounted() {
      this.setGridColumns();
      
  }
};
</script>

<style>

    .data-grid-container {
        margin: 0;
        padding: 0;
    }

    .data-grid-container .tag-box-editor {
        display: block;
    }
    .data-grid-container .data-grid-box-editor {
        display: block;
        padding-bottom: 20px;
    }

    .data-grid-container .dx-datagrid {
        font-size: 11px;
    }

    .data-grid-container .dx-toolbar-items-container {
        border-top: 2px solid #fff;
    }

    .data-grid-container .dx-datagrid-rowsview .dx-row > .dx-master-detail-cell {
        padding: 0;
    }

    .data-grid-container .dx-invalid-message {
        display: none;
    }

    .data-grid-details-container {
        background-color: rgb(253, 252, 251);
        padding: 5px 10px 10px 20px;
    }

    .data-grid-sub-details-container {
        background-color: rgb(243, 242, 241);
        padding: 5px 10px 10px 20px;
    }

    .data-grid-container .rows-is-filtered {
        background-color: rgb(255, 196, 196);
        border: 1px solid rgb(255, 86, 86);
        border-radius: 3px;
    }

    .data-grid-container .rows-is-not-filtered {
        border: 1px solid rgb(212, 212, 212);
        border-radius: 3px;
    }

    .data-grid-container .dx-datagrid-nowrap.dx-datagrid-headers .dx-header-row > td > .dx-datagrid-text-content {
        white-space: normal;
    }

    .data-grid-container .dx-row > td,
    .data-grid-container .dx-virtual-row > td,
    .data-grid-container .dx-row.dx-group-row > td,
    .data-grid-container .dx-datagrid-headers .dx-row > td {
        border: 1px solid #777;
    }

</style>