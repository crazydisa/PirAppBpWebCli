<template>
  <div>
    <LoadPanel v-if="loading"/>
    <DataGrid v-show="!logDetailsEmpty"
        :columns="columns"
        :data-source="logDetailsDataSource"
        :show-reset-filters-button="false"
        :show-filter-row="false"
        :show-search-panel="false"
        :show-page-selector="false"
        :page-size="20"
        :on-cell-prepared="cellPrepared"
        selection-mode="none"
        key-expr="Key">
    </DataGrid>
  </div>
</template>


<script>

import { mapGetters, mapActions } from "vuex";
import DataGrid from "@/components/Common/DataGrid.vue";
import localizeFilter from '@/localize';
import utils from '@/utils';

export default {
  components: {
    DataGrid
  },
  props: {
    log: {
      type: Object,
      default: () => null
    },
  },
  methods: {
    ...mapActions([
        "loadLogDetails",
        "loadObjects"
    ]),
    cellPrepared(e) {
        if(e.rowType === "data") {
          if(e.column.dataField === "PropertyOldValue") {
            if(e.data.PropertyOldValue) {
              e.cellElement.style.backgroundColor = '#ffdede';
            }
            else {
              e.cellElement.style.backgroundColor = '#dedede';
            }
          }

          if(e.column.dataField === "PropertyNewValue") {
            if(e.data.PropertyNewValue) {
              e.cellElement.style.backgroundColor = '#deffde';
            }
            else {
              e.cellElement.style.backgroundColor = '#dedede';
            }
          }
        }
    },
  },
  data() {
    return {
      loading: true,
      logDetailsDataSource: null,
      logDetailsEmpty: false,
    };
  },
  computed: {
    ...mapGetters([
        "getLogDetails",
        "getObjectTypeById",
        "getObjectById"
    ]),
    columns() {
      var columns = [];
      if(this.multiDetails) {
       columns.push({  
          dataField: "DetailId",
          dataType: "string",
          groupIndex: 1,
          caption: localizeFilter('LogDetailId'),
        })
      }
      columns = columns.concat([{  
          dataField: "PropertyTitle",
          dataType: "string",
          caption: localizeFilter('LogPropertyTitle'),
        }, {  
          dataField: "PropertyOldValue",
          dataType: "string",
          caption: localizeFilter('LogPropertyOldValue'),
        }, {  
          dataField: "PropertyNewValue",
          dataType: "string",
          caption: localizeFilter('LogPropertyNewValue'),
        }]);
        return columns;
    },
    multiDetails() {
      return utils.getUniqueValues(this.logDetailsDataSource, "DetailId").length > 1;
    }
  },
  async mounted() {
      await this.loadLogDetails(this.log.Id)
      
      const logDetails = this.getLogDetails;
      const objectType = this.getObjectTypeById(this.log.Object.TypeId);

      let changedProperties = [];

      for(let d in logDetails) {
        const detail = logDetails[d];
        const oldObject = detail.OldObject;
        const newObject = detail.NewObject;
        
        for(let p in objectType.Properties) {
          const prop = objectType.Properties[p];
          if(!prop.IsHiddenInLogDetail) {
            const propOldValue = oldObject ? oldObject[prop.Name] : null;
            const propNewValue = newObject ? newObject[prop.Name] : null;

            if((propOldValue || propNewValue) && propOldValue != propNewValue) {
              const Key = detail.DetailId + p;
              const DetailId = detail.DetailId;
              const ObjectId = detail.ObjectId;
              let PropertyTitle = prop.Title;
              let PropertyOldValue;
              let PropertyNewValue;
              
              if(prop.IsIdentifier) {
                const objPropName = prop.Name.endsWith("Id") ? prop.Name.substring(0, prop.Name.length - 2) : null;
                const objProp =  objectType.Properties.find(pr => pr.Name == objPropName);
                if(objProp) {
                  let objIds = [];
                  if(propOldValue) objIds.push(propOldValue);
                  if(propNewValue) objIds.push(propNewValue);
                  if(objIds.length > 0) {
                    await this.loadObjects(objIds);
                  }
                  const oldObj = propOldValue ? this.getObjectById(propOldValue) : null;
                  const newObj = propNewValue ? this.getObjectById(propNewValue) : null;
                  const displayExpr = objProp.DisplayExpr ? objProp.DisplayExpr : "Title";
                  PropertyTitle = objProp.Title;
                  PropertyOldValue = oldObj ? oldObj[displayExpr] : null;
                  PropertyNewValue = newObj ? newObj[displayExpr] : null;
                }
              }
              else if(prop.IsObject) {
                const displayExpr = prop.DisplayExpr ? prop.DisplayExpr : "Title";
                PropertyOldValue = propOldValue ? propOldValue[displayExpr] : null;
                PropertyNewValue = propNewValue ? propNewValue[displayExpr] : null;
              }
              else if(prop.IsDate) {
                PropertyOldValue = propOldValue ? utils.dateTimeToString(propOldValue) : null;
                PropertyNewValue = propNewValue ? utils.dateTimeToString(propNewValue) : null;
              }
              else if(prop.IsBoolean) {
                PropertyOldValue = propOldValue ? localizeFilter(propOldValue) : null;
                PropertyNewValue = propNewValue ? localizeFilter(propNewValue) : null;
              }
              else {
                PropertyOldValue = propOldValue;
                PropertyNewValue = propNewValue;
              }

              if(PropertyTitle && (PropertyOldValue || PropertyNewValue) && PropertyOldValue != PropertyNewValue) {
                changedProperties.push({
                    Key,
                    DetailId,
                    ObjectId,
                    PropertyTitle,
                    PropertyOldValue,
                    PropertyNewValue
                });
              }
            }
          }
        }
      }

      this.logDetailsDataSource = changedProperties;
      this.logDetailsEmpty = changedProperties.length == 0;
      this.loading = false;
  }
};

</script>