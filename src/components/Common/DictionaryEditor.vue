<template>
    <div class="dictionary-editor" v-resize @resize="onResize">
      <div class="dictionary-caption" v-if="!!caption">
        <h3>{{caption}}</h3>
      </div>
      <LoadPanel v-if="loading"/>
      <ObjectsDataGrid
        v-if="loading!==null"
        :object-type="dictionaryObjectType"
        :columns="columns"
        :data-source="dataSource"
        :allow-editing="true"
        :width="gridWidth"
        :height="gridHeight"
        :on-row-inserting="dictionaryRowInserting"
        :on-refreshing="dictionaryRefreshing"
      />
    </div>
</template>
<script>

import { mapGetters, mapActions } from "vuex";
import ObjectsDataGrid from "@/components/Common/ObjectsDataGrid.vue";
import utils from "@/utils";

export default {
  components: {
    ObjectsDataGrid
  },
  props: {
    dictionaryType: {
      type: Object,
      default: () => null
    }
  },
  data() {
    return {
      loading: null,
      gridWidth: null,
      gridHeight: null
    }
  },
  methods: {
    ...mapActions([
      "loadDictionaryItems",
      "loadDictionaryItemsId"
    ]),
    dictionaryRowInserting(e) {
      if(this.dictionaryType) {
        e.data.DictionaryTypeId = this.dictionaryType.Id;
        e.data.ParentId = this.dictionaryType.Id;
      }
    },
    async dictionaryRefreshing() {
      
      this.loading = true;
      //console.log(this.objectType)
      if(!this.objectType) {
        //console.log("ffffff: "+this.objectType)
        if(this.dictionaryType && this.dictionaryType.Name) {
          //console.log("typeName")
          await this.loadDictionaryItems(utils.getPluralName(this.dictionaryType.Name));
        }
        else
        {
          

          await this.loadDictionaryItemsId(this.dictionaryType.TypeId)
        }
      }
      else {
        const actionName = "load" + utils.getPluralName(this.objectType.Name);
        await this.$store.dispatch(actionName);
        const props = this.objectType.Properties;
        for(let i in props) {
          const prop = props[i];
          if(prop.TypeName && !prop.IsInclude) {
            const getterName = "get" + utils.getPluralName(prop.TypeName);
            const getter = this.$store.getters[getterName];
            if(getter !== undefined && getter.length == 0) {
              const loadActionName = "load" + utils.getPluralName(prop.TypeNam);
              const loadActionExists = Object.keys(this.$store._actions).findIndex(key => key === loadActionName) !== -1
              if(loadActionExists) {
                await this.$store.dispatch(loadActionName);
              }
            }
          }
        }
      }
      this.loading = false;
    },

    onResize(e) {
      this.gridWidth = e.detail.width;
      this.gridHeight = e.detail.height - 38;
    },
  },
  computed: {
    ...mapGetters([
      "getDictionaryItems",
      "getObjectTypes"
    ]),
    objectType() {
      return this.getObjectTypes.find(o => o.RootContainer && o.RootContainer.Name == this.dictionaryType.Name);
    },
    dictionaryObjectType() {
      let objectType = this.objectType;
      if(!objectType) {
        objectType = this.getObjectTypes.find(o => o.Name == "DictionaryItem");
      }
      return objectType;
    },
    caption() {
      return this.dictionaryType.Title;
    },
    columns() {
      return [{
          dataField: "SortIndex",
          visible: !this.objectType
        }, {
          dataField: "Name",
          visible: false,
          isRequired: false
        }, {
          dataField: "Title",
          width: 200
        }, {
          dataField: "Description",
          width: null,
          minWidth: 200
        },{
          dataField: "IsNotUsed",
          visible: !this.objectType
        }
      ];
    },
    dataSource() {
      if(!this.objectType && this.dictionaryType) {
        return this.getDictionaryItems.filter(item => item.DictionaryTypeId == this.dictionaryType.Id);
      }
      return null;
    }
  },
  watch: {
    dictionaryType() {
      if(!this.loading) {
        this.loading = null;
        this.dictionaryRefreshing();
      }
    }
  },
  mounted() {
    this.dictionaryRefreshing();
  }
};
</script>


<style>
  .dictionary-editor {
    flex: 1 1 auto;
    overflow: hidden;
  }
  .dictionary-caption {
    border-bottom: 1px solid rgb(255, 115, 0);
    margin: 2px 0 5px 0;
  }
</style>