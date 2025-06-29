<template>
  <ExplorerDx
    :objects-list-caption="'Dictionaries'"
    :show-selected-object-info="false"
    :selected-object="selectedDictionaryType">
    <template #objectsList>
      <div class="dictionary-parent-list" v-resize @resize="onResize">
        <DataGrid
          :columns="columns"
          :select-first-row="true"
          :data-source="dictionaryTypes"
          :height="gridHeight"
          :show-column-chooser="false"
          :show-refresh-button="false"
          :show-reset-filters-button="false"
          :show-search-panel="true"
          :allow-column-resizing="true"
          :on-selection-changed="dictionarySelectionChanged"
          :page-size="100"
          keyExpr="Name"
        />
      </div>
    </template>
    <template #content>
      <div class="page-container">
        <DictionaryEditor
          :dictionary-type="selectedDictionaryType"
        />
      </div>
    </template>
  </ExplorerDx>
</template>


<script>

import { mapGetters, mapActions } from "vuex";
import ExplorerDx from "@/components/Common/ExplorerDx.vue";
import DataGrid from "@/components/Common/DataGrid.vue";
import DictionaryEditor from "@/components/Common/DictionaryEditor.vue";
import localizeFilter from '@/localize';

export default {
  components: {
    ExplorerDx,
    DataGrid,
    DictionaryEditor
  },
  methods: {
    ...mapActions([
      "loadDictionaryTypes"
    ]),
    dictionarySelectionChanged(e) {
        const selectedRow = e.selectedRowsData.length == 1 ? e.selectedRowsData[0] : null;
        console.log("ffff: "+selectedRow.Name)
        if(selectedRow) {
          this.selectedDictionaryType = selectedRow;
        }
    },
    onResize(e) {
        this.gridHeight = e.detail.height;
    },
  },
  data() {
    return {
        gridHeight: null,
        selectedDictionaryType: null
    }
  },
  computed: {
    ...mapGetters([
      "getDictionaryTypes"
    ]),
    columns() {
      let columns = [];

      // columns.push({
      //     dataField: "Parent.Title",
      //     dataType: "string",
      //     groupIndex: 1,
      //     caption: localizeFilter('ActionModuleTitle'),
      // });

      columns.push({
          dataField: "Title",
          dataType: "string",
          width: 300,
          caption: localizeFilter('Dictionary'),
          calculateDisplayValue: (rowData) => { 
            return rowData.RootContainer ? rowData.RootContainer.Title : rowData.Title; 
          },
      });
      return columns;
    },
    dictionaryTypes() {
      return this.getDictionaryTypes;
    }
  },
  async mounted() {
    if(this.getDictionaryTypes.length == 0) {
      await this.loadDictionaryTypes();
    }
  }
}
</script>

<style>
.dictionary-parent-list {
    flex: 1 1 auto;
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
</style>