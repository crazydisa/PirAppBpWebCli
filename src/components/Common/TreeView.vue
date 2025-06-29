<template>
  <div :style="cGetStyle" >  
    <DxTreeView  
      :ref="treeViewRef"
      :data-source="dataSource"
      :key-expr="keyExpr"
      :display-expr="displayExpr"
      :parent-id-expr="parentIdExpr"
      :data-structure="dataStructure"
      :root-value="rootValue"   
      :expand-nodes-recursive="expandNodesRecursive"
      :create-children="mCreateChildren"    
      :item-template="itemTemplate"
      :search-enabled="searchEnabled"
      :search-mode="searchMode"
      :selection-mode="selectionMode"
          
      :width="width"
      :heigt="heigt"
      :show-check-boxes-mode="showCheckBoxesMode"
      :items-expr="itemsExpr"
      :target="target"
      @selection-changed="onSelectionChanged"
      @item-click="mTreeViewClick"
      @item-expanded="onItemExpanded"
      @item-context-menu="mPrepareItemContextMenu"
       >
      <template #default-template="product">
          <div>
            <div><img  :src="product.data.icon"  width="20" height="20" align="top"/><span style='padding-left: 5px'  class="list-item-color--red">  {{ mGetItemName(product.data.NameForTreeView) }}</span></div>
          </div>          
      </template>
    </DxTreeView>
      <DxContextMenu
        :ref="contextMenuRef"
        :data-source="contextMenuItems"
        
        @item-click="mContextMenuItemClick"/>     
  </div>   
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import DxTreeView from 'devextreme-vue/tree-view';
import DxContextMenu from 'devextreme-vue/context-menu';
import 'devextreme/dist/css/dx.light.css';

export default {
  components: { 
    DxTreeView,
    DxContextMenu,
  },
  //inject: ['entity'],
  props: {
    dataSource: {
    },
    myId: {
        type: String,
        default: () => "mainTreeView"
    },
    MYSTYLE: {
      type: Object,
      default: () => {}
    },
    offlineModeDenis: {
      type: Boolean,
      default: false
    },
    searchEnabled: {
      type: Boolean,
      default: true
    },
    contextMenuItems: {
      type: Array,
      default: () => []
    },
    
    itemTemplate: {
      type: String,
      default: () => "default-template"
    },
    target: {
      type: String,
      default: () => "#treeview .dx-treeview-item"
    },
    width: {
      type: String,
      default: () => ""
    },
    heigt: {
      type: String,
      default: () => ""
    },
    items: {
      type: Array,
      default: () => []
    },
    actionName: {
      type: String,
      default: () => ""
    },
    getterDataName: {
      type: String,
      default: () => ""
    },
    
    treeViewRef: {
      type: String,
      default: () => ""
    },
    showCheckBoxesMode: {
      type: String,
      default: () => "none"
    },
    
    contextMenuRef: {
      type: String,
      default: () => ""
    },
   
    rootValue: {
      type: String,
      default: () => null
    },
    selectionMode: {
      type: String,
      default: () => null
    },
    searchMode: {
      type: String,
      default: () => null
    },
    itemsExpr: {
      type: String,
      default: () => null
    },
    dataStructure: {
      type: String,
      default: () => "plain"
    },
    createChildrenFilter: {
      type: Number,
      default: () => null
    },
    parentIdExpr: {
      type: String,
      default: () => "ParentId"
    },
    displayExpr: {
      type: String,
      default: () => "NameForTreeView"
    },
    
    keyExpr: {
      type: String,
      default: () => "Id"
    },
    
    expandNodesRecursive: {
      type: Boolean,
      default: () => false
    },
    getThis: {
      type: Function,
      default: () => function() {return null}
    },
    
    onSelectionChanged: {
      type: Function,
      default: () => function() {}
    },
    itemExpanded: {
      type: Function,
      default: () => function() {}
    },
    showPopupForm: {
      type: Function,
      default: () => function() {}
    },
    
    itemContextMenu: {
      type: Function,
      default: () => function() {}
    },
    treeViewCreateChildren: {
      type:  Function,
      default: function() {}
    },
    itemClick: {
      type: Function,
      default: function() {return null}
    },
    onClosePopup: {
      type: Function,
      default: () => function() {}
    },
    settingsDenis: {
      type: String,
      default: () => ""
    },
    
  },
  methods: {
    ...mapActions([
        "loadBranchTree",  
        "updateGraph", 
        "updateValue",  
    ]),
    ...mapMutations([
        "setGraph",  
        "setValue",
    ]),

    async mCreateChildren(selectedItem) {
      selectedItem = selectedItem? selectedItem: {}
      selectedItem.senderContext = this
      return await  this.treeViewCreateChildren(selectedItem)
    },
 
    mGetItemName(name) {
      if (!name) return "";
      const names = name.split("|");
      return names[names.length-1];
    },

    async mPrepareItemContextMenu(e) {

      //this.$emit('id-object-selected', e);
      this.dSelectedObj = e.itemData;
      var cMenuItems = this.contextMenuItems
      var cCMenuInstance = this.cGetContextMenuInstance
      for (let i = 0; i < cMenuItems.length; ++i) {
        let menuType = cMenuItems[i].type
        let isVisible = menuType == e.itemData.Type || cMenuItems[i].listObjects.find(o=> o==e.itemData.Type)!==undefined;
        cCMenuInstance.option('items['+i+'].visible', isVisible)
      }  
      cCMenuInstance.repaint() 
      if (!this.cSelectedObj) {
        await this.mLoadObjectById()
      }
      e = e? e: {}
      e.senderContext = this
      this.$emit('tree-view-item-expanded', e)
    },

     mContextMenuItemClick(e) {
      e = e? e: {}
      e.senderContext = this
      this.$emit('tree-view-popup-open', e);   
      
    },

    onItemExpanded(e){
      e = e? e: {}
      e.senderContext = this
      this.$emit('tree-view-item-expanded', e)
      
    },
    
    async mTreeViewClick(selectedItem){
      selectedItem = selectedItem? selectedItem: {}
      selectedItem.senderContext = this
      this.dSelectedObj = selectedItem.itemData
      
      if (!this.cSelectedObj) {
        await this.mLoadObjectById()
      } 
      this.$emit('tree-view-object-selected', selectedItem);

    },

    async mLoadObjectById(){
      const actionName = "load" + this.dSelectedObj.Type + "ById"
      await this.$store.dispatch(actionName,this.dSelectedObj.Id);
    },

    mGetObjectTypeByName(name) {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Name == name)
      }
      return null
    },
  },
 
    
  data() {
      return {
        dSelectedObj: null,
        dThisSaved: false,
      }
    },

    computed: {
      ...mapGetters([
        "getBranchTreeView",
        
        "getSetting",
        "getValue",
        "getComp",
        "getGraph",
        
    ]),
      
    treeView() {
      return this.$refs[this.treeViewRef].instance;
    },

    cGetContextMenuInstance() {
      var cRef = this.contextMenuRef
      return this.$refs[cRef].instance;
    },

    cSelectedObj() {
      const getterName = "get" + this.dSelectedObj.Type  + "ById"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter(this.dSelectedObj.Id)
      }
      return null
    },

    cObjectType() {
      const getterName = "getObjectTypes"
      const getter = this.$store.getters[getterName]
      if(getter !== undefined) {
        return getter.find(o => o.Name == this.dSelectedObj.Type)
      }
      return null
    },
    cGetStyle(){
      return this.MYSTYLE
    }
  },
  updated(){
    this.$nextTick(function () {
    // Код, который будет запущен только после
    // отрисовки всех представлений
    //this.getGraph.setNodeValue(this.myId,"thisInstance",this)
  })
    
  },
  mounted () {
    //console.log("Start mounted!!!!!!!!!")
    //this.getGraph.setNodeValue(this.myId,"thisInstance",this)
    
   
      this.getGraph.setNodeValue(this.myId,"thisInstance",{obj:this})
      //console.log("End mounted!!!!!!!!!")
      //this.getThis.bind(this)
    }
  
}
</script>
<style>
 .list-item-color--red {
    color: black;    
  }
 
  
</style>