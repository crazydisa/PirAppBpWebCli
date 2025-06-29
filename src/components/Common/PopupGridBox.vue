<template>
    <PopupBox
        :visible="visible"
        :title="title"
        :width="width"
        :height="height"
        :apply-button-text="'AddSelected'|localize"
        :on-apply="apply"
        :on-close="onClose">
        <template #container>
            <div class="rows-list-container">
                <DataGrid
                    :dataSource="dataSource"
                    :columns="columns"
                    :selection-mode="selectionMode"
                    :width="gridWidth"
                    :height="gridHeight"
                    :show-filter-row="true"
                    :selected-row-keys="selectedRowKeys"
                    :on-selection-changed="rowsSelectionChanged"
                    :key-expr="keyExpr">
                </DataGrid>
            </div>
        </template>
    </PopupBox>
</template>

<script>

import PopupBox from '@/components/Common/PopupBox.vue';
import DataGrid from '@/components/Common/DataGrid.vue';

export default {
    components: {
        PopupBox,
        DataGrid
    },
    props: {
        dataSource: {
            default: () => null
        },
        columns: {
            default: () => null
        },
        width: {
            type: Number,
            default: () => 670
        },
        height: {
            type: Number,
            default: () => 600
        },
        title: {
            type: String,
            default: () => null
        },
        sender: {
            type: Object,
            default: () => null
        },
        selectionMode: {
            type: String,
            default: () => null
        },
        keyExpr: {
            type: String,
            default: () => "Id"
        },
        defaultSelectedRows: {
            type: Array,
            default: () => null
        },
        visible: {
            type: Boolean,
            default: () => false
        },
        onApply: {
            type: Function,
            default: () => function() {}
        },
        onClose: {
            type: Function,
            default: () => function() {}
        },
    },
    data() {
        return {
            gridWidth: this.width ? this.width - 20 : null,
            gridHeight: this.height ? this.height - 100 : null,
            selectedRows: null,
            rowsFilterFunction: null
        }
    },
    methods: {
        rowsSelectionChanged(e) {
            this.selectedRows = e.selectedRowsData;
        },
        apply() {
            if(this.selectedRows) {
                if(this.selectionMode == "single") {
                    this.onApply({
                        sender: this.sender,
                        value: this.selectedRows[0]
                    });
                }
                else if(this.selectionMode == "multiple") {
                    this.onApply({
                        sender: this.sender,
                        value: this.selectedRows
                    });
                }
            }
        },
    },
    computed: {
        selectedRowKeys() {
            if(this.defaultSelectedRows) {
                return this.defaultSelectedRows.map(row => row[this.keyExpr]);
            }
            return null;
        }
    },
    async mounted() {
        this.selectedRows = this.defaultSelectedRows;
    }
};

</script>

<style>
    .rows-list-container {
        flex: 1 1 auto;
        height: 100%;
    }
</style>