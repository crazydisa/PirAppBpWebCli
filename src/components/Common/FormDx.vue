<template>
  <div v-if="!!formItems" class="form-container">
      <div v-if="allowUpdating && showEditButtons" class="form-buttons-container">
        <div v-if="!editMode" class="form-buttons">
          <DxButton
            :hint="'Edit'"
            icon="edit"
            @click="editClick"
          />
        </div>
        <div v-else class="form-buttons">
          <DxButton
            :hint="'Save'"
            icon="save"
            validation-group="formValidation"
            @click="saveClick"
          />
          <DxButton
            :hint="'Cancel'"
            icon="undo"
            @click="cancelClick"
          />
        </div>
      </div>
      <DxForm
        ref="formRef"
        :on-content-ready="onContentReady"
        :form-data="formData"
        :read-only="readOnly"
        :col-count="colCount"
        :label-location="labelLocation"
        :items="items"
        validation-group="formValidation">
      </DxForm>
  </div>
</template>
<script>

import { DxForm } from 'devextreme-vue/form';
import DxButton from 'devextreme-vue/button';
import ValidationEngine from 'devextreme/ui/validation_engine';

export default {
  components: {  
    DxForm,
    DxButton
  },
  props: {
    formData: {
      type: Object,
      default: () => {}
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
    allowUpdating: {
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
      editMode: false,
    }
  },
  methods: {
    editClick() {
      this.editMode = true;
      this.onEdit(true);
    },
    saveClick() {
      const result = ValidationEngine.validateGroup("formValidation");      
      if(result.isValid && this.externalIsValid()) { 
        this.onUpdating({...this.formData});
        this.editMode = this.onlyEditMode ? true : false;
        this.onEdit(this.editMode );
      }
    },
    cancelClick() {
      this.onCancel();
      this.editMode = false;
      this.onEdit(false);
    }
  },
  computed: {
    readOnly() {
      return !this.editMode // !this.allowUpdating || !this.editMode;
    },
    items() {
      let items = [];
      for(let i in this.formItems) {
        const formItem = this.formItems[i];
        const readOnly = this.readOnly || (formItem.allowEditing == false);
        let item = { ...formItem};

        if(!readOnly) {
          if(formItem.isRequired) {
            item.validationRules = [{ 
              type: "required",
              validationGroup: "formValidation"
            }];
          }
        }
        items.push(item)
      }
      return items;
    }
  },
  watch: {
    formData() {
      this.editMode = this.onlyEditMode ? true : false;
    }
  },
  mounted() {
    this.editMode = this.enableEditMode;
  }
};
</script>

<style>
  .form-container {
    border: 1px solid rgb(230, 230, 230);
    border-radius: 5px;
    padding: 10px;
    position: relative;
    
  }
  .form-container .dx-layout-manager .dx-field-item:not(.dx-first-row) {
    padding-top: 4px;
  }
  .form-container .dx-texteditor.dx-state-readonly {
    /* border-style: dashed; */
    border: 1px solid #f7f7f7;

  }
  .form-buttons-container {
    background-color: rgba(252, 252, 252, 0.815);
    padding: 3px 10px;
    margin: -9px 1px 0 0;
    position: absolute;
    right: 0;
    border: 1px solid #eee;
    border-radius: 4px;
    z-index: 100;
  }
  .form-buttons {
    text-align: right;
  }
  .form-buttons .dx-button {
    margin-left: 5px;
  }
</style>
