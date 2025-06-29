<template>
  <div v-if ="!!tabs">
    <span> {{ tabs.value['main-title']? getValue(tabs.value['main-title'].id): '' }}</span>
      <div class="q-pa-md">
        <div class="q-gutter-y-md" >
          <q-card >
            <q-tabs
              :model-value="getValue(tabs.value['selectedTab'].id)"
              dense
              class="text-white bg-black"
              active-color="amber"
              indicator-color="amber"
              align="justify"
              narrow-indicator
              @update:model-value="changeQTabs"
            >
            <div  v-for="(item, index) in tabs.value.dataSource.value" v-bind:key="index">  
              <q-tab
                :name="getValue(item.value.title.id)"
                :label="getValue(item.value.label.id)"/>
            </div>            
            </q-tabs>
            <q-separator />
            <q-tab-panels
            :model-value="getValue(tabs.value['selectedTab'].id)"
              animated
              v-for="(item, index) in tabs.value.dataSource.value" v-bind:key="index">
                <q-tab-panel :name="getValue(item.value.title.id)" >
                    <div v-for="(subitem, index2) in item.value.COMPONENTS.value" v-bind:key="index2">
                      
                      <component
                      
                        :is="subitem.value.component.value"
                      
                        :my-id="subitem.id.toString()"  
                        :tabs="ttt"
                        v-bind = "Object.keys(subitem.value).reduce((obj,k) => Object.assign(obj, {[k]: getValue(subitem.value[k].id)}),{})"
                        :tree-view-create-children="treeViewCreateChildren"
                        @data-grid-object-selected="dataGridObjectSelected"
                        @q-data-grid-selection="qDataGridSelection"
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
                        @q-select-box-object-selected="qSelectBoxObjectSelected"
                        @q-imput-object-changed="qImputObjectChanged"
                        @q-data-grid-add-set="qDataGridAddSet"
                        @q-data-piker-object-changed="qDataPikerObjectChanged"
                        @q-data-grid-mounted="qDataGridMounted"
                        @q-data-grid-custom-button-handler="qDataGridCustomButtonHandler"
                        @q-button-click="qButtonClick"
                        @q-object-data-grid-set-data-source="qObjectDataGridSetDataSource"
                        @q-data-grid-added-row="qDataGridAddedRow"
                        @q-data-grid-change-state = "qDataGridChangeState"
                        @q-data-grid-deleted-row="qDataGridDeletedRow"
                        @q-tabledata-changed-handler="qTableDataChangedHandler"
                        :on-selection-changed="dataGridSelectionChanged"
                        >
                      </component>
                   
                    </div>
                </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>
      </div>    
  </div>
</template>
<script>

import { mapGetters, mapActions, mapMutations } from "vuex";
//import { ref, onMounted } from 'vue'
import DxTabPanel from 'devextreme-vue/tab-panel';
import ButtonDx from '@/components/Common/ButtonDx.vue';
import ComplectProperty from "@/components/Sapsan/ComplectProperty.vue";
import ComplectRevisions from "@/components/Sapsan/ComplectRevisions.vue";
import RemarksNormControl from "@/components/Sapsan/RemarksNormControl.vue";
import CheckList from "@/components/Sapsan/CheckList.vue";
//import QObjectsDataGrid from "@/components/Common/QObjectsDataGrid.vue";
//import ObjectsDataGrid from "@/components/Common/QObjectsDataGrid.vue";
//import DataGrid from "@/components/Common/DataGrid.vue";
import LableDx from "@/components/Common/LableDx.vue";
import CheckBox from "@/components/Common/CheckBox.vue";
//import QTreeView from "@/components/Common/QTreeView.vue";
import TreeListDx from "@/components/Common/TreeListDx.vue";
import ObjectForm from "@/components/Common/ObjectForm.vue";
import QInput from "@/components/Common/QInput.vue";
import QDatePiker from "@/components/Common/QDatePiker.vue";
import QSelectBox from "@/components/Common/QSelectBox.vue";
import QDataGrid from "@/components/Common/QDataGrid.vue";
import QButton from "@/components/Common/QButton.vue";
import UploadForm from "@/components/Common/UploadForm.vue";
import QUploader from "@/components/Common/QUploader.vue";
import QInputSlot from "@/components/Common/QInputSlot.vue";
import QImage from "@/components/Common/QImage.vue";
//import TreeView from "@/components/Common/TreeView.vue";
//import DynamicComponent from "@/components/UniversalComponents/DynamicComponent.vue";
import graphBuilder from "@/utils/graphBuilder.js";
import iSettings from "@/utils/settings.js";
import PopupBox from "@/components/Common/PopupBox.vue";
import DropDownDataGrid from '@/components/Common/DropDownDataGrid.vue';
import utils from "@/utils";
import appLib from "@/utils/appLib2.js";
import { defineAsyncComponent } from 'vue'
//import { toRef} from 'vue';
//import "@quasar.variables.scss"
import { ref } from 'vue'

export default {
  components: {
    DxTabPanel,
    ButtonDx,
    ComplectProperty,
    ComplectRevisions,
    RemarksNormControl,
    CheckList,
    QObjectsDataGrid: defineAsyncComponent(() => import('@/components/Common/QObjectsDataGrid.vue')),
    ObjectForm,
    QInput,
    QImage,
    QDatePiker,
    QSelectBox,
    QUploader,
    QInputSlot,
    //ObjectsDataGrid,
    PopupBox,
    DropDownDataGrid,
    TreeListDx,
    CheckBox,
    LableDx,
    QDataGrid,
    QButton,
    UploadForm,
    QTreeView: defineAsyncComponent(() => import('@/components/Common/QTreeView.vue')),
    //TreeView,
    //DynamicComponent,
    QDynamicComponent: defineAsyncComponent(() => import('@/components/UniversalComponents/QDynamicComponent.vue')),
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

    selectedTab: {
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

    async changeQTabs(e){

      this.dSelectedTabName = e
      this.getGraph.setNodeValue(this.tabs.id,"selectedTab",this.dSelectedTabName)
      this.getGraph.setNodeValue(this.tabs.id,"selectedTabName",this.dSelectedTabName)
      let eventHandlers = this.getGraph.getNodeValues(this.tabs.id, /handlerSelectedTab[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },

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
          parentIdExpr, rootLable} = e.senderProps
      let parentObj = e.node? e.node:{['labelKey']: rootLable, ParentId: null, expandable: true}
      if(parentObj.expandable){
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
     }
     else{
      e.done([])
     }
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

    async qTreeViewObjectSelected(e){
      const {myId,} = e.senderProps
      const node = e.node
      this.mQSetParentsTree(e)
      if(node){
        this.getGraph.setNodeValue(myId,"selectedObjectDataType",this.mGetObjectTypeByName(node.Type))
        this.getGraph.setNodeValue(myId,"selectedObject",node)  
      }
        
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerTreeViewObjectSelected[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    
    async qObjectDataGridSetDataSource(e){
      const {myId, dataSource} = e

      this.getGraph.setNodeValue(myId,"dataSource",dataSource)   
      // let eventHandlers = this.getGraph.getNodeValues(myId, /eventHandlerClick[0-9]*\b/i)
      // for (let i = 0; i < eventHandlers.length; ++i) {
      //   let eventHandler = eventHandlers[i]
      //   if (eventHandler){
      //     eventHandler = eventHandler.bind(appLib)
      //     await eventHandler()
      //   }
      // }
    },
    async qSelectBoxObjectSelected(e){
      const {myId, type} = e.senderProps
      const node = e.node
      this.getGraph.setNodeValue(myId,"selectedObjectDataType",type)
      this.getGraph.setNodeValue(myId,"selectedObject",node)    
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerSelectBoxObjectSelected[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    async qImputObjectChanged(e){
      const {myId} = e.senderProps
      const node = e.node
      this.getGraph.setNodeValue(myId,"text",node)
      this.getGraph.setNodeValue(myId,"selectedObject",node)    
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqImputChanged[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    async qDataPikerObjectChanged(e){
      const {myId, node} = e
      let nodeAsDate = window.dt.parse(node)
      this.getGraph.setNodeValue(myId,"selected",nodeAsDate)  
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataPikerChanged[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    
    async qButtonClick(e){
      const {myId} = e.senderProps
      //this.getGraph.setNodeValue(myId,"selectedObjectDataType",type)
      //this.getGraph.setNodeValue(myId,"dataSets",item,"Id")    

      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqButtonClick[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    async qDataGridAddSet(e){
      const {myId} = e.senderProps
      //const item = e.item
      //this.getGraph.setNodeValue(myId,"selectedObjectDataType",type)
      //this.getGraph.setNodeValue(myId,"dataSets",item,"Id")    

      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerAddSets[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    async qDataGridSelection(e){
      const {myId} = e.senderProps
      const data = e.selected
      const state = e.state
      this.getGraph.setNodeValue(myId,"selected",data) 
      if(state){
        //this.getGraph.setNodeValue(myId,"selectedObjectDataType",type)
        this.getGraph.setNodeValue(myId,"selectedObject",data)    
        this.getGraph.setNodeValue(myId,"isRowNotSelected",() => false)  
      }
      else{
        //this.getGraph.setNodeValue(myId,"selectedObjectDataType",[])
        this.getGraph.setNodeValue(myId,"selectedObject",[])    
        this.getGraph.setNodeValue(myId,"isRowNotSelected",() => true)
      }
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataGridSelection[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    
    async qDataGridChangeState(e){
      let {myId,  addedRows, changedRows, deletedRows} = e   
      if(addedRows)
        this.getGraph.setNodeValue(myId,"addedRows",addedRows) 
      if(deletedRows)
        this.getGraph.setNodeValue(myId,"deletedRows",deletedRows) 
      if(changedRows) 
        this.getGraph.setNodeValue(myId,"changedRows",changedRows)
      if(addedRows || deletedRows)
        this.getGraph.setNodeValue(myId,"isRowNotSelected",() => true) 
     
      //this.getGraph.setNodeValue(myId,"selectedObject",null)  
      //console.log("qDataGridMounted!!!!",dataSource);
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataGridChangeState[0-9]*\b/i)
       for (let i = 0; i < eventHandlers.length; ++i) {
         let eventHandler = eventHandlers[i]
         if (eventHandler){
           eventHandler = eventHandler.bind(appLib)
           await eventHandler()
         }
       }
    },

    async qDataGridMounted(e){
      let {myId} = e
      
      this.getGraph.setNodeValue(myId,"deletedRows",[])  
      this.getGraph.setNodeValue(myId,"changedRows",[])
      this.getGraph.setNodeValue(myId,"isRowNotSelected",() => true)  
      this.getGraph.setNodeValue(myId,"selectedObject",null)  
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataGridMounted[0-9]*\b/i)
       for (let i = 0; i < eventHandlers.length; ++i) {
         let eventHandler = eventHandlers[i]
         if (eventHandler){
           eventHandler = eventHandler.bind(appLib)
           await eventHandler()
         }
       }
    },

    qDataGridCustomButtonHandler(e){
      const {myId} = e.senderProps
      const name = e.name
      //const tableData = e.tableData
      //const instance = e.instance
      //this.getGraph.setNodeValue(myId,"dataSource",tableData)
      //this.getGraph.setNodeValue(myId,"dataSets",item,"Id")    
      //console.log("qDataGridCustomButtonHandler!!!!",tableData);
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataGridCustomButton[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
           eventHandler(name)
        }
      }
    },
    
    qTableDataChangedHandler(e){
      const {myId, isEmpty} = e
      this.getGraph.setNodeValue(myId,"isEmpty",() => isEmpty)
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqTableDataChangedHandler[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
           eventHandler()
        }
      }
    },
    async qTreeViewItemExpanded(e){
      this.qTreeViewObjectSelected(e)
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
          this.getGraph.addNodeValue(e.emitParam1.id,"modifiedObjects",celectedCell.selectedItem.data)
          this.closeSelf()
        }
      }
    },
    
    async qDataGridAddedRow(e){
      const {myId, addedRows} = e
      this.getGraph.setNodeValue(myId,"addedRows",addedRows)
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataGridAddedRows[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    async qDataGridDeletedRow(e){
      const {myId, deletedRows} = e
      this.getGraph.setNodeValue(myId,"deletedRows",deletedRows)
      let eventHandlers = this.getGraph.getNodeValues(myId, /handlerqDataGridDeletedRows[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },
    async mCheckBoxChanged(e){
      this.getGraph.setNodeValue(e.checkBoxId,"value",e.value)
      let nodeNickName = e.value?"checked": "unchecked"
      let result = this.getGraph.getNodeValue(e.checkBoxId,nodeNickName)
      this.getGraph.setNodeValue(e.checkBoxId,"result",result)
      let eventHandlers = this.getGraph.getNodeValues(this.tabs.id, /checkBoxEventHandler[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
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
        this.dPopupVisible= true
      }
    },

    async treeViewObjectSelected(e){
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
      let eventHandlers = this.getGraph.getNodeValues(treeViewContext.myId, /eventHandlerClick[0-9]*\b/i)
      for (let i = 0; i < eventHandlers.length; ++i) {
        let eventHandler = eventHandlers[i]
        if (eventHandler){
          eventHandler = eventHandler.bind(appLib)
          await eventHandler()
        }
      }
    },  

    mQSetParentsTree(e){
      const {myId,} = e.senderProps
      const node = e.node
      if(node){
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
      }
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
      //console.log("dataGridObjectSelected e!! = ",e)
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
        if (this.cTypeNameById =="Document"){
          this.getGraph.setNodeValue(senderContext.myId,"docPartsObjectType",this.mGetObjectTypeByName("DocumentPart"))
          const actionName = "loadDocumentParts"      
          await this.$store.dispatch(actionName, this.dSelectedObj.Id);
        }
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
      tab: ref(this.selectedTab),
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
  },

  //mounted () {

    //console.log("Start mounted!!!!!!!!!")

      //this.getGraph.setNodeValue(this.tabs.id,"thisInstance",this)

      //console.log("End mounted!!!!!!!!!")

    //}

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