<template>
    <li>
      <img
        :alt="obj.Name"
        :src="obj.Description"
        :id="'image' + employee.ID"
      ><br>
      <i>{{ obj.Name }} {{ obj.Description }}</i><br>
      <DxButton
        :on-click="showObjInfo"
        class="button-info"
        text="Details"
      />
    </li>
  </template>
  <script>
  import { DxButton } from 'devextreme-vue/button';
  
  export default {
    components: {
      DxButton,
    },
  
    props: {
      obj: {
        type: Object,
        required: true,
        default: () => ({}),
      },
      showInfo: {
        type: Function,
        required: true,
        default: () => {},
      },
    },
  
    methods: {
        showObjInfo() {
        this.showInfo(this.obj);
      },
    },
  };
  </script>