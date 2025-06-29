<template>
  <div v-if ="!!tabs">
  <div v-ripple>Click Me</div>
    <span> {{ tabs.value['main-title']? getValue(tabs.value['main-title'].id): '' }}</span>
    <div :style="getValue(tabs.value.MYSTYLE.id)"  >
        <DxTabPanel
            
            v-bind = "Object.keys(tabs.value).reduce((obj,k) => Object.assign(obj, {[k]: getValue(tabs.value[k].id)}),{})"
            :my-id="tabs.id.toString()"
            :my-graph="myGraph"
            :data-source="tabs.value.dataSource.value"
            
            @selection-changed="onTitleClick">
            <template #title="{ data: tabData }">
              <span> {{ getValue(tabData.value.title.id) }}</span>
            </template>
            <template #item="{ data: tabData }">
                <div :style="getValue(tabData.value.MYSTYLE.id)" >
                  <div  v-for="(item, index) in tabData.value.COMPONENTS.value" v-bind:key="index">  
                    <component 
                        :is="item.value.component.value"
                        :my-id="item.id.toString()"  
                        :tabs="ttt"
                        
                        v-bind = "Object.keys(item.value).reduce((obj,k) => Object.assign(obj, {[k]: getValue(item.value[k].id)}),{})"
                        :tree-view-create-children="treeViewCreateChildren"
                        @data-grid-object-selected="dataGridObjectSelected"
                        @on-load-objects="mButtonsClickLoad"
                        @on-select-objects="mButtonsClickSelect"
                        @tree-view-object-selected="treeViewObjectSelected"
                        @q-tree-view-object-selected="qTreeViewObjectSelected"
                        @tree-view-item-expanded="treeViewItemExpanded"
                        @q-tree-view-item-expanded="qTreeViewItemExpanded"
                        @tree-view-popup-open="treeViewPopupOpen"
                        @data-grid-popup-open = "dataGridPopupOpen"
                        @on-db-update = "onDbUpdate"
                        @check-box-changed = "mCheckBoxChanged"
                        @q-tree-view-create-children="qTreeViewCreateChildren"
                        :on-selection-changed="dataGridSelectionChanged"
                        > 
                    </component>
                  </div>
                </div>
            </template>
        </DxTabPanel>
      
  </div>
    <PopupBox
      v-if="dPopupVisible"
      title ="Свойства"
      :visible="dPopupVisible" 
      :on-close="mPopupClickClose"
      :height="900"
      :width="1500"
      >    
      <template #container>
        <div class="scrollable" >
          <DynamicComponent 
            :tabs="dPopupSetting"
            :is-dynamic="dPopupIsDynamic"
            :my-id="dPopupId"
            :close-self="mcloseSelf">
          </DynamicComponent>                       
        </div>
      </template>       
    </PopupBox>  
  </div>
 
</template>
<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
//import { ref, onMounted } from 'vue'
//import qbtn from module.QBtn// 'quasar/src/components/btn'
import DxTabPanel from 'devextreme-vue/tab-panel';
import ButtonDx from '@/components/Common/ButtonDx.vue';
import ComplectProperty from "@/components/Sapsan/ComplectProperty.vue";
import ComplectRevisions from "@/components/Sapsan/ComplectRevisions.vue";
import RemarksNormControl from "@/components/Sapsan/RemarksNormControl.vue";
import CheckList from "@/components/Sapsan/CheckList.vue";
import ObjectsDataGrid from "@/components/Common/ObjectsDataGrid.vue";
import DataGrid from "@/components/Common/DataGrid.vue";
import LableDx from "@/components/Common/LableDx.vue";
import CheckBox from "@/components/Common/CheckBox.vue";
import QTreeView from "@/components/Common/QTreeView.vue";
import TreeListDx from "@/components/Common/TreeListDx.vue";
import ObjectForm from "@/components/Common/ObjectForm.vue";
//import TreeView from "@/components/Common/TreeView.vue";
//import DynamicComponent from "@/components/UniversalComponents/DynamicComponent.vue";
import graphBuilder from "@/utils/graphBuilder.js";
import iSettings from "@/utils/settings.js";
import PopupBox from "@/components/Common/PopupBox.vue";
import DropDownDataGrid from '@/components/Common/DropDownDataGrid.vue';
import utils from "@/utils";
import { defineAsyncComponent } from 'vue'
//import "@quasar.variables.scss"

export default {
  components: {
    
    DxTabPanel,
    ButtonDx,
    ComplectProperty,
    ComplectRevisions,
    RemarksNormControl,
    CheckList,
    ObjectsDataGrid,
    ObjectForm,
    DataGrid,
    PopupBox,
    DropDownDataGrid,
    TreeListDx,
    CheckBox,
    LableDx,
    QTreeView,
    //TreeView,
    //DynamicComponent,
    DynamicComponent: defineAsyncComponent(() => import('@/components/UniversalComponents/DynamicComponent.vue')),
    //DynamicComponent: () => import('@/components/UniversalComponents/DynamicComponent.vue'),
    TreeView: defineAsyncComponent(() => import('@/components/Common/TreeView.vue'))
  },
  props: {
    tabs: {
      type: Object,
      default: () => {}
    },
    myId: {
        type: String,
        default: () => ""
    },
    mainTitle: {
        type: String,
        default: () => ""
    },
    
    objectType: {
      type: Object,
      default: () => {}
    },
    ttt: {
      type: Object,
      default: () => {}
    },
    myGraph: {
      type: Object,
      default: () => {}
    },
    isDynamic: {
      type: Boolean,
      default: false
    },
    closeSelf: {
        type: Function,
        default: () => {}
    },
    
  },
        
  methods: {
    ...mapActions([
      "loadComplect",
        
    ]), 
    ...mapMutations([
        "setGraph",  
        "setValue",
    ]),
    mPopupClickClose() {
        this.dPopupVisible = false
        
    },
    onResize(e) {
      this.gridWidth = e.detail.width;
      this.gridHeight = e.detail.height;
    },
    async qTreeViewCreateChildren(e){

      if(!e.senderProps) return
      const {myId,createChildrenFilter,keyExpr,actionName,getterDataName,
            parentIdExpr, labelKey, rootLable} = e.senderProps
      
      let parentObj =  e.node[labelKey]!=rootLable? e.node: { ParentId: null}
      delete parentObj.children
      parentObj.FilterId = createChildrenFilter
      let tempId = this.getGraph.getNodeValue(myId,keyExpr)
      let objects = []

      await this.$store.dispatch(actionName,parentObj);

      const getter = this.$store.getters[getterDataName]
      if(getter !== undefined) {           
        objects = getter.map((object) => {
                          return { ...object, [keyExpr]: tempId++, [parentIdExpr]: parentObj.tempId,
                            lazy: true };
        });
      } 
      
      this.getGraph.setNodeValue(myId,keyExpr,tempId)
      e.done(objects)
    },

    async treeViewCreateChildren(selectedItem){
      
      let treeViewContext = selectedItem.senderContext 
      
      let parentObj =  selectedItem.itemData? selectedItem.itemData: { ParentId: null}
      parentObj.FilterId = treeViewContext.createChildrenFilter
      treeViewContext.dSelectedObj = parentObj
      
      let tempId = treeViewContext.getGraph.getNodeValue(treeViewContext.myId,treeViewContext.keyExpr)
      
      let objects = []
      
      await treeViewContext.$store.dispatch(treeViewContext.actionName,parentObj);
      
      const getter = treeViewContext.$store.getters[treeViewContext.getterDataName]
      if(getter !== undefined) {           
        objects = getter.map((object) => {
                          return { ...object, [treeViewContext.keyExpr]: tempId++, [treeViewContext.parentIdExpr]: parentObj.tempId };
        });
      } 
      
      treeViewContext.getGraph.setNodeValue(treeViewContext.myId,treeViewContext.keyExpr,tempId)
      

      return objects
      
    },
    treeViewItemExpanded(e){
      this.mSetParentsTree(e)
    },
    qTreeViewItemExpanded(e){
      this.mQSetParentsTree(e)
    },
    onTitleClick(e){
      //console.log("tab click!!! e = ",e)
      this.dSelectedTabName = e.addedItems[0].value.title.value
      this.getGraph.setNodeValue(this.tabs.id,"selectedTabName",this.dSelectedTabName)
      let eventHandlers = this.getGraph.getNodeValues(this.tabs.id, /eventHandlerClick[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          //eventHandler = eventHandler.bind(this)
          eventHandler()
        }
      }
      if (e.itemIndex == 1){
        this.getGraph.setNodeValue(this.tabs.id,"typeForSubordinateTable",this.mGetObjectTypeByName("Complect"))        
      }
      if (e.itemIndex == 0){
        this.getGraph.setNodeValue(this.tabs.id,"typeForSubordinateTable",this.mGetObjectTypeByName("DocumentPart"))
      }
    },

    mGetObjectTypeByName(name) {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Name == name)
      }
      return null
    },

   async mButtonsClickLoad(e){  
    if(e){
      //console.log("mButtonsClickLoad e = ",e)
      const actionName = "load" + utils.getPluralName(e.emitParam1.Name)       
      await this.$store.dispatch(actionName);
    }
          
  },
    mButtonsClickSelect(e){
      if(e){
        let celectedCell = e.emitParam1
        let selectedObject = e.emitParam2

        let datagrid = celectedCell.datagrid
        const editRowIndex = datagrid.getRowIndexByKey(celectedCell.selectedItem.key);
        if(editRowIndex >= 0) {
          datagrid.cellValue(editRowIndex, celectedCell.selectedItem.column.dataField,selectedObject.Id)
          //datagrid.saveEditData()
          this.getGraph.addNodeValue(e.emitParam1.id,"modifiedObjects",celectedCell.selectedItem.data)
          this.closeSelf()
        }
      }
      
    },
    mCheckBoxChanged(e){

      this.getGraph.setNodeValue(e.checkBoxId,"value",e.value)
      let nodeNickName = e.value?"checked": "unchecked"
      let result = this.getGraph.getNodeValue(e.checkBoxId,nodeNickName)
      this.getGraph.setNodeValue(e.checkBoxId,"result",result)

      let eventHandlers = this.getGraph.getNodeValues(this.tabs.id, /checkBoxEventHandler[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
         // eventHandler = eventHandler.bind(this)
          eventHandler()
        }
      }
    },
    onDbUpdate(){

    },

    mcloseSelf(){
      this.dPopupVisible= false
    },
    
    treeViewPopupOpen(e){
      if(e){
        this.dPopupId = e.senderContext.myId
        this.dPopupIsDynamic = false
        switch (e.itemData.type) {
          case 'CreateComplect': {
            this.dPopupSetting = this.getSetting.createComplect
            break;
          }
          case 'Contract': {       
            this.dPopupSetting = this.getSetting.treeViewPopupContent
            break;
          }
          case 'SprStage': {       
            this.dPopupSetting = this.getSetting.treeViewPopupContent
            break;
          }
          case 'Op': {
            this.dPopupSetting = this.getSetting.treeViewPopupContent
            break;
          }
          case 'Complect': {
            this.dPopupSetting = this.getSetting.treeViewPopupContent
            break;
          }
          case 'Printing': {
            this.dPopupSetting = this.getSetting.treeViewPopupContent
            break;
          }
          default:
            break;
        }
        //this.dPopupSetting = this.getSetting.slice(0,1)
        this.dPopupVisible= true
      }
    },
 
    async treeViewObjectSelected(e){
      //console.log("e.selectedItem.itemData!! = ",e.selectedItem.itemData) 
        this.mSetParentsTree(e)
        let treeViewContext = e.senderContext 
        this.getGraph.setNodeValue(treeViewContext.myId,"selectedObjectDataType",treeViewContext.cObjectType)
        this.getGraph.setNodeValue(treeViewContext.myId,"selectedObject",treeViewContext.cSelectedObj)
        if (e.itemData.Type=="Complect"){
          this.getGraph.setNodeValue(treeViewContext.myId,"objectType",this.mGetObjectTypeByName("Document"))
          const actionName = "loadDocuments"      //загрузка документов по id комплекта
          await this.$store.dispatch(actionName, e.itemData.Id);
        }
        else{
          this.getGraph.setNodeValue(treeViewContext.myId,"objectType",this.mGetObjectTypeByName("Complect"))
          const actionName = "loadComplects"
          await this.$store.dispatch(actionName, e.itemData);
        }
        
        //let treeData = this.getGraph.getNodeValue(treeViewContext.myId,"selectedTreeData")
        //if (Object.keys(treeData).length != 0){
         
          
          
          //actionName = "loadTransferTaskViews"
          //await this.$store.dispatch(actionName, treeData.Contract)
        //}
        
        

      
      let eventHandlers = this.getGraph.getNodeValues(treeViewContext.myId, /eventHandlerClick[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          //eventHandler = eventHandler.bind(this)
          eventHandler()
        }
      }

    },   

    async qTreeViewObjectSelected(e){
      const {myId,} = e.senderProps
      const node = e.node
      this.mQSetParentsTree(e)
      this.getGraph.setNodeValue(myId,"selectedObjectDataType",this.mGetObjectTypeByName(node.Type))
      this.getGraph.setNodeValue(myId,"selectedObject",node)     
  
      let eventHandlers = this.getGraph.getNodeValues(myId, /eventHandlerClick[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          //eventHandler = eventHandler.bind(this)
          eventHandler()
        }
      }
    },
    mQSetParentsTree(e){
      const {myId,} = e.senderProps
      const node = e.node

      let graph = this.getGraph
      let thisComp = graph.nodes[myId]
      let childs = graph.getAllChildsByEdge(thisComp,1)
      let selectedTreeData = Object.keys(childs).filter((item) => childs[item].nickname == "selectedTreeData")[0]
      let parentsKeys = Object.keys(childs).filter((item) => childs[item].nickname == "parents")[0]
      
      let treeData = {}
      let parents = graph.nodes[parentsKeys].value.parents
      let idsType = graph.nodes[parentsKeys].value.idsType   
      let parent =  node.tempId
      parents[parent]=node.tempParentId
      idsType[parent]=node

      while(parent) {
        treeData[idsType[parent].Type]=idsType[parent].Id
        parent = parents[parent]
      }

      let saveNode = graph.nodes[selectedTreeData]
      saveNode.value = treeData
      this.setValue(saveNode)
    },
    mSetParentsTree(e){
      let treeViewContext = e.senderContext

      let graph = this.getGraph
      let thisComp = graph.nodes[treeViewContext.myId]
      let childs = graph.getAllChildsByEdge(thisComp,1)
      let selectedTreeData = Object.keys(childs).filter((item) => childs[item].nickname == "selectedTreeData")[0]
      let parentsKeys = Object.keys(childs).filter((item) => childs[item].nickname == "parents")[0]
      
      let treeData = {}
      let parents = graph.nodes[parentsKeys].value.parents
      let idsType = graph.nodes[parentsKeys].value.idsType   
      let parent =  e.itemData.tempId
      parents[parent]=e.itemData.tempParentId
      idsType[parent]=e.itemData
      while(parent) {
        treeData[idsType[parent].Type]=idsType[parent].Id
        parent = parents[parent]
      }

      let saveNode = graph.nodes[selectedTreeData]
      saveNode.value = treeData
      this.setValue(saveNode)
    },

    async mPopupLoadObjectById(){
      if (!this.cPopupSelectedObj) {
        const actionName = "load" + this.cPopupTypeNameById + "ById"

        await this.$store.dispatch(actionName,this.dPopupSelectedObj.Id)
      }
    },

    dataGridSelectionChanged(e){

      this.mObjectSelected(e) 
    },

    async dataGridPopupOpen(e){
      if(e){
        this.dPopupId = e.id
        this.dPopupIsDynamic = true
        this.dPopupSelectedTypeName = e.selectedItem.column.prop.TypeName
        this.dPopupSelectedTypeId = this.cPopupObjectTypeIdByName.Id
        this.dPopupSelectedObj = {Id: e.selectedItem.value}
        await this.mPopupLoadObjectById()
        let graph = this.getGraph
        let settings = iSettings.getdataGridPopupContent()     
        iSettings.replaceText(settings.dataGridPopupContent, /PARENT/g, graph.nodes[e.id].value)
        let result=graphBuilder.buildGraph(graph, settings)
        this.dPopupSetting = result.settings.dataGridPopupContent
        this.setGraph(result.graph)
        this.getGraph.setNodeValue(e.id,"selectedCellType",this.cPopupObjectTypeById)
        this.getGraph.setNodeValue(e.id,"selectedCellData",this.cPopupSelectedObj)
        this.getGraph.setNodeValue(e.id,"selectedCell",e)
        this.dPopupVisible= true

      }
    },

    async dataGridObjectSelected(e){
         this.mObjectSelected(e) 
    },

    async mObjectSelected(e){

      if(e){
        let senderContext = e.senderContext
        if (e.data.constructor === Array){
          if(e.data.length>0){
            this.dSelectedObj = e.data[0]
            this.dSelectedTypeId = e.data[0].TypeId
          }
        }else{
          this.dSelectedObj = e.data
          this.dSelectedTypeId = e.data.TypeId
        }
        this.getGraph.setNodeValue(senderContext.myId,"selectedObjectDataType",this.cObjectTypeById)
        this.getGraph.setNodeValue(senderContext.myId,"selectedObject",this.cSelectedObj)
        //console.log("1!!!!!!!!! = ",e) 
        if (this.cTypeNameById =="Document"){
          this.getGraph.setNodeValue(senderContext.myId,"docPartsObjectType",this.mGetObjectTypeByName("DocumentPart"))
          //console.log("11!!!!!!!!! = ",e) 
          const actionName = "loadDocumentParts"      
          await this.$store.dispatch(actionName, this.dSelectedObj.Id);
        }
        //if (this.cTypeNameById == "LetterProtocol"){
          
        //}
      } 
    }
},

  data() {
    return {
      loading: false,
      dSelectedObj: null,
      dSelectedTypeId: null,
      dPopupSelectedTypeId: null,
      dPopupSelectedTypeName: null,
      dPopupSelectedObj: null,
      dPopupVisible: false,
      dPopupId: null,
      dPopupIsDynamic: false,
      dPopupSetting: null,
      dSelectedTabName: null,
      gridWidth: null,
      gridHeight: null,
      
    }
  },
  
  computed: {
      ...mapGetters([
        "getGraph",
        "getValue",
        "getSetting",

    ]),

    cSelectedObj() {
      if(this.cTypeNameById){
        const getterName = "get" + this.cTypeNameById  + "ById"
        const getter = this.$store.getters[getterName]
        if(getter !== undefined) {
          return getter(this.dSelectedObj.Id)
        }
      }
      return null
    },
    cTypeNameById() {
      if(this.cObjectTypeById){
        return this.cObjectTypeById.Name
      }
      return ""
    },
    cObjectTypeById() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Id == this.dSelectedTypeId)
      }
      return null
    },
    cPopupSelectedObj() {
      if(this.cPopupTypeNameById){
        const getterName = "get" + this.cPopupTypeNameById  + "ById"
        const getter = this.$store.getters[getterName]
        if(getter !== undefined) {
          return getter(this.dPopupSelectedObj.Id)
        }
      }
      return null
    },
    cPopupTypeNameById() {
      if(this.cPopupObjectTypeById){
        return this.cPopupObjectTypeById.Name
      }
      return ""
    },
    cPopupObjectTypeById() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Id == this.dPopupSelectedTypeId)
      }
      return null
    },
    cPopupObjectTypeIdByName() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Name == this.dPopupSelectedTypeName)
      }
      return null
    },
    cMainTitle(){
      let result = ""
        if (this.mainTitle)
              result = this.this.mainTitle
      return result
    }
    //cThisComponent() {
      //console.log("this.tabs.value.ref.value ",this.tabs)
      //return this.$refs[this.tabs.value.ref.value].instance;
    //},

  },

  mounted () {
    //console.log("Start mounted!!!!!!!!!")
      //this.getGraph.setNodeValue(this.tabs.id,"thisInstance",this)
      //console.log("End mounted!!!!!!!!!")
    }
};
</script>

<style>
  .tabpanel-demo {
  display: flex;
  height: 100%;
}

.widget-container {
  display: flex;
  justify-content: center;
  flex-grow: 1;
  min-width: 360px;
  padding: 16px 32px;
}

.dx-theme-material .widget-container {
  background-color: rgba(191, 191, 191, 0.15);
}

.dx-tabpanel-tabs-position-left .dx-tabpanel-container,
.dx-tabpanel-tabs-position-right .dx-tabpanel-container {
  width: 0;
}

.dx-viewport:not(.dx-theme-generic) .dx-tabpanel {
  border-radius: 8px;
  overflow: clip;
}

.dx-tabs-vertical {
  min-width: 120px;
}

.options {
  display: inline-flex;
  flex-direction: column;
  flex-shrink: 0;
  box-sizing: border-box;
  width: 272px;
  padding: 20px;
  background-color: rgba(191, 191, 191, 0.15);
}

.caption {
  font-weight: 500;
  font-size: 18px;
}

.option {
  margin-top: 20px;
}
  .scrollable {
    overflow-y: auto;
    scrollbar-color: gray black;
    scrollbar-width: thin;
    height: 800px;
    width: 1400;
  }
</style>
