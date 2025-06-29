<template>
  <div>
    <LoadPanel v-if="loading"/>
    <div class="page-container" v-resize @resize="onResize">
      <DataGrid
        user-state-key="LogsDataGrid"
        :columns="columns"
        :data-source="getLogs"
        :show-column-chooser="true"
        :show-refresh-button="true"
        :show-reset-filters-button="true"
        :show-filter-row="true"
        :show-search-panel="true"
        :show-page-selector="true"
        :show-word-wrap-button="true"
        :word-wrap-enabled="false"
        selection-mode="none"
        :page-size="50"
        :height="gridHeight"
        :allow-grouping="true"
        :allow-column-resizing="true"
        :allow-master-detail="true"
        :export-enabled="true"
        :export-file-name="'ReportLogs'"
        :on-toolbar-preparing="appLogToolbarPreparing"
        :on-cell-click="appLogCellClick"
        :on-refreshing="reloadLogs">
        <template #masterDetail="{ data: e }">
          <div class="data-grid-details-container" v-if="e.data.Object">
            <LogDetails
                  :log="e.data"
                />
          </div>
      </template>
    </DataGrid>
    </div>
  </div>
</template>

<script>


import { mapGetters, mapActions } from "vuex";
import localizeFilter from '@/localize';
import componentUtils from '@/utils/components';

import DataGrid from "@/components/Common/DataGrid.vue";
import LogDetails from '@/components/Common/LogDetails.vue'

export default {
  components: {
    DataGrid, 
    LogDetails
  },
  methods: {
    ...mapActions([
        "loadLogs",
        "loadObjectLogs"
    ]),
    appLogToolbarPreparing(e) {
      
      if(!this.byObject) {
        componentUtils.toolbarAddItem(e, {
          location: "after",
          widget: "dxSelectBox",
          options: {
            items: this.getLogPeriods,
            value: this.getLogPeriods[0],
            keyExpr: "value",
            displayExpr: "title",
            width: 120,
            onValueChanged: async (e) => {
              this.selectedLogPeriod = e.value;
              this.reloadLogs();
            }
          }
        });
      }
    },
    async reloadLogs() {
        this.loading = true;
        if(this.byObject) {
          await this.loadObjectLogs({
              type: this.objectType, 
              id: this.objectId
          });
        }
        else {
          await this.loadLogs({
              from: this.selectedLogPeriod.from, 
              to: this.selectedLogPeriod.to
          });
        }
        this.loading = false;
    },
    appLogCellClick(e) {
      if(e.rowType === "data") {
        // if(e.component.isRowExpanded(e.row.key)) {
        //   e.component.collapseRow(e.row.key);
        // }
        // else {
        //   e.component.expandRow(e.row.key);
        // }
      }
    },
    onResize(e) {
        this.gridHeight = e.detail.height;
    },
  },
  data() {
    return {
      loading: true,
      gridHeight: null,
      selectedLogPeriod: null,
      objectType: null,
      objectId: null
    }
  },
  computed: {
    ...mapGetters([
        "getLogs",
        "getLogPeriods"
    ]),
    columns() {
      return [{  
          dataField: "Action.ObjectType.RootContainer.Title",
          caption: localizeFilter('ActionModuleTitle'),
        }, {  
          dataField: "Action.ObjectType.Title",
          caption: localizeFilter('ActionTypeTitle'),
        }, {  
          dataField: "Action.Title" ,
          caption: localizeFilter('ActionTitle'),
        }, {  
          dataField: "Object.Title",
          caption: localizeFilter('ActionObjectTitle'),
        // }, {  
        //   dataField: "LogText" ,
        //   caption: localizeFilter('LogText'),
        }, {  
          dataField: "LogLevel" ,
          dataType: "string",
          caption: localizeFilter('LogLevelTitle'),
          calculateDisplayValue: (rowData) => { 
            return localizeFilter('LogLevel' + rowData.LogLevel);
          },
        }, {  
          dataField: "LogTime",
          dataType: "date",
          format: "dd.MM.yyyy HH:mm",
          caption: localizeFilter('LogTime'),
        }, {  
          dataField: "User.Title" ,
          caption: localizeFilter('LogUserTitle'),
        }, {  
          dataField: "User.Name" ,
          caption: localizeFilter('LogUserName'),
        }];
    },
    byObject() {
      return this.objectType && this.objectId;
    }
  },
  async mounted() {
    this.selectedLogPeriod = this.getLogPeriods[0];
    this.objectType = this.$route.query.type;
    this.objectId = this.$route.query.id;
    await this.reloadLogs();
  }
};
</script>

<style>

 </style>