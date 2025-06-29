<template>
  <div id="app">
    <component :is="layout">
  
    </component>
  </div>
</template>

<script>

import ruMessages from "devextreme/localization/messages/ru.json";
import { locale, loadMessages } from "devextreme/localization";

import MainLayout from '@/layouts/MainLayout.vue';
import EmptyLayout from '@/layouts/EmptyLayout.vue';

export default {
  name: 'App',
  computed: {
    layout() {
      return this.$route.meta.layout || 'empty-layout';
    }
  },
  components: {
      MainLayout, EmptyLayout
  },
  async created() { 
      loadMessages(ruMessages); 
      locale(navigator.language);
  } 
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
  }
  body {
    margin: 0;
    padding: 0;
    border: 0;
  }
  h3,
  h4,
  h5 {
    color: #555;
    padding: 3px 3px 3px 0;
    margin: 2px 0;
  }
  h3 {
    font-size: 18px;
  }
  h4 {
    font-size: 14px;
  }
  h5 {
    font-size: 12px;
    margin: 1px;
  }
  .page-container {
    display: flex;
    position: relative;
    height: calc(100vh - 81px);
    overflow: hidden;
  }


  .view-container {
    display: flex;
  }
  .view-objects-list-container {
    flex: 0 0;
    padding: 0 8px 0 2px;
  }
  .view-object-container {
    flex: 1 1;
    padding: 0 2px;
    overflow: hidden;
  }
  .selected-object-container {
    padding: 0px;
  }
  .not-selected-object-container {
    text-align: center;
    padding: 100px;
    font-size: 22px;
    color: #888;
  }
  .selected-object-info-container {
    padding: 0px;
    margin-bottom: 10px;
  }

  .pir-component {
    display: block;
  }
  .pir-component-header {
    display: flex;
    align-items: center;
  }
  .pir-component-title {
    flex: 1;
    border-bottom: 1px solid rgb(255, 115, 0);
    margin: 5px 0;
  }
  .pir-component-hiding {
    width: 12px;
    text-align: right;
  }
  .pir-component-hiding i {
    color: #555;
    font-size: 12px;
    cursor: pointer;
  }


  .error-page-container {
    text-align: center;
    padding-top: 200px;
  }
  .error-page-text {
    font-size: 18px;
    color: #555;
    margin-bottom: 20px;
  }
  .error-page-link-container {
    padding: 5px;
  }
  .error-page-link {
    font-size: 14px;
  }

</style>
