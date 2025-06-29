<template>
  <div class="object-form-container">
      <Form
        v-if="!!cObjectTypeFormItems"
        :form-data="objectFormData"
        :form-items="cObjectTypeFormItems"
        :external-is-valid="externalIsValid"
        :enable-edit-mode="enableEditMode"
        :only-edit-mode="onlyEditMode"
        :allow-updating="allowUpdating"
        :show-edit-buttons="showEditButtons"
        :col-count="colCount"
        :label-location="labelLocation"
        :on-edit="onEdit"
        :on-updating="formUpdating"
        :on-cancel="formCancel"
        :on-content-ready="onContentReady"
      />
  </div>
</template>
<script>

import Form from "@/components/Common/FormDx.vue";
import componentUtils from '@/utils/components';
import utils from '@/utils';

export default {
  components: {  
    Form
  },
  props: {
    myId: {
        type: String,
        default: () => ""
    },
    objectType: {
      type: Object,
      default: () => null
    },
    dataSource: {
      type: Object,
      default: () => null
    },
    autoFormData: {
      type: Boolean,
      default: () => true
    },
    formItems: {
      type: Array,
      default: () => null
    },
    externalIsValid: {
      type: Function,
      default: () => {return true;}
    },
    enableEditMode: {
      type: Boolean,
      default: () => false
    },
    onlyEditMode: {
      type: Boolean,
      default: () => false
    },
    allowEditing: {
      type: Boolean,
      default: () => false
    },
    showEditButtons: {
      type: Boolean,
      default: () => false
    },
    colCount: {
      type: Number,
      default: () => 2
    },
    labelLocation: {
      type: String,
      default: () => "left"
    },
    onEdit: {
      type: Function,
      default: () => function() {}
    },
    onUpdating: {
      type: Function,
      default: () => function() {}
    },
    onCancel: {
      type: Function,
      default: () => function() {}
    },
    onContentReady: {
      type: Function,
      default: () => function() {}
    }
  },
  data() {
    return {
      objectTypeFormItems: null
    }
  },
  methods: {
    async formUpdating(data) {
      const key = data.Id;
      const values = data;
      const actionName = "update" + this.objectType.Name;
      delete values.CreatedAt;
      await this.$store.dispatch(actionName, {key, values});
      this.onUpdating(data);
    },
    initFormItems(items) {
      for(let i in items) {
        const item = items[i];
        if(item.prop) {
          if(item.prop.IsIdentifier) {
            //item.editorType = "dxSelectBox";
            //item.editorOptions = {
                //items: item && item.lookup ? item.lookup.dataSource : null,
                //valueExpr: "Id",
                //displayExpr: "Title"
            //};
            item.editorType = "dxTextArea";
          }
          else if(item.prop.IsBoolean) {
            item.editorType = "dxCheckBox";
          }
          else if(item.prop.IsNumeric) {
            item.editorType = "dxNumberBox";
          }
          else if(item.prop.IsDate) {
            item.editorType = "dxDateBox";
          }
          else if(item.prop.IsMultiline) {
            item.editorType = "dxTextArea";
            item.editorOptions = {
                inputAttr: {
                    rows: 3
                },
            }
          }
        }
        if(item.items) {
          this.initFormItems(item.items);
        }
        else if(item.caption) {
          item.label = {
            text: item.caption,
            width: 150
          }
        }
      }
      return items;
    },
    formCancel() {
      this.onCancel();
    }
  },
  computed: {
    objectFormData() {
      if(this.showEditButtons) {
        const obj = { ...this.dataSource };
        for(let i in this.objectType.Properties) {
          const prop = this.objectType.Properties[i];
          if(obj[prop.Name]) {
            if(prop.IsDate && prop.DataFormat) {
              obj[prop.Name] = utils.dateTimeToStringFormat(obj[prop.Name], prop.DataFormat);
            }
          }
        }
        return obj;
      }

      return this.dataSource;
    },
    allowUpdating() {
      const actionName = "Update" + this.objectType.Name;
      return this.$store.getters.currentUserIsAllowedAction(actionName) && this.allowEditing;
    },
    cObjectTypeFormItems() {
      if(!this.objectType && !this.dataSource){return null}
      const items = componentUtils.getObjectTypeFormItems(this.objectType, this.formItems, this.autoFormData);
      this.initFormItems(items);
      return  items;
    },
  },
  mounted() {
    //const items = componentUtils.getObjectTypeFormItems(this.objectType, this.formItems, this.autoFormData);
    //this.initFormItems(items);
    //this.objectTypeFormItems = items;
    
  }
};
</script>
