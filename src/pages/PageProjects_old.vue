<template>
  <div>
    <ExplorerDx
      :objects-list-caption="'Projects'"
      :show-selected-object-info="false">
      <template #objectsList>
        <div id ="prop" class="dictionary-parent-list"  >

          <DynamicComponent 
            :tabs="cTreeView"
          
            :is-dynamic="false">
          </DynamicComponent> 
        </div>
      </template>
      <template #content>
        <div class="page-container" >
          
          <DynamicComponent 
            :tabs="cComplectsDocuments"
            :ttt="cTransferTask"
            :is-dynamic="false">
          </DynamicComponent>      
          
        </div>
      </template>
      <template #content2>
        <div class="page-container" >
          
          <DynamicComponent 
            :tabs="cDocumentView"
            :is-dynamic="false">
          </DynamicComponent>
        
        </div>
      </template>
    </ExplorerDx>   
    </div>
  </template>  
  <script>
  
  import { mapGetters } from "vuex";
  import ExplorerDx from "@/components/Common/ExplorerDx.vue";
  //import ScrollIntoView from "@/components/Common/ScrollIntoView.vue";
  import DynamicComponent from "@/components/UniversalComponents/DynamicComponent.vue";
  export default {
    components: {
      ExplorerDx,
      //TreeView,
      DynamicComponent,
      //ScrollIntoView
    },
    provide: function () {
        return {
          entity: "loadBranchTree"
        }
      },
   
    computed: {
      ...mapGetters([
        
        "getGraph",
        "getSetting",

      ]),

      cPageContentSettings(){
        return [this.mySetting.complectContent]
      },
      cTreeView(){
        return this.mySetting.treeViewContent
      },
      cComplectsDocuments(){
        return this.mySetting.complectContent
      },
      cDocumentView(){
        return this.mySetting.documentContent
      },
      cTransferTask(){
        return this.mySetting.transferTask
      },
      
      myGraph(){
        return this.getGraph
      },
      mySetting(){
        return this.getSetting
      }
    },
    
   mounted() {

  } 
  
};
  </script>
  
  <style>
  .dictionary-parent-list {
      flex: 1 1 auto;
      height: 100%;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      
  }
  .list-item-color--red {
    color: black;    
  }

  
  </style>

