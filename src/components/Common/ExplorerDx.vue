<template>
  <div class="page-container" :style="style">
    
    <div class="explorer-objects-list-container">
      <div class="explorer-objects-list-header">
        <div class="explorer-objects-list-title" v-show="!objectsIsHidden">
            <h3>{{objectsListCaption}}</h3>
        </div>
        <div class="explorer-objects-list-hiding">
            <i v-if="objectsIsHidden" class="dx-icon-chevronright" :title="'Show'" @click="objectsHideControlClick"></i>
            <i v-else class="dx-icon-chevronleft" :title="'Hide'" @click="objectsHideControlClick"></i>
        </div>
      </div>
      <div class="explorer-objects-list-content" v-show="!objectsIsHidden">
          <slot name="objectsList">
          </slot>
      </div>
    </div>
    <div class="explorer-object-container">
        
          <div class="explorer-selected-object-info-container" v-if="showSelectedObjectInfo">
              <div class="explorer-selected-object-info-header">
                <div class="explorer-selected-object-info-title">
                    <h4 v-if="objectIsHidden && !objectUrl">{{objectInfoTitle}}</h4>
                    <h3 v-else-if="!objectIsHidden && !objectUrl">{{objectInfoTitle}}</h3>
                    <h4 v-else-if="objectIsHidden && objectUrl"><a :href="objectUrl" :title="objectUrlTitle" target="_blank" class="explorer-selected-object-url">{{objectInfoTitle}} <i class="dx-icon-link"></i></a></h4>
                    <h3 v-else-if="!objectIsHidden && objectUrl"><a :href="objectUrl" :title="objectUrlTitle" target="_blank" class="explorer-selected-object-url">{{objectInfoTitle}} <i class="dx-icon-link"></i></a></h3>
                </div>
                <div class="explorer-selected-object-info-hiding">
                    <i v-if="objectIsHidden" class="dx-icon-chevrondown" :title="'Show'" @click="objectHideControlClick"></i>
                    <i v-else class="dx-icon-chevronup" :title="'Hide'" @click="objectHideControlClick"></i>
                </div>
              </div>
              <div >
                  <slot name="objectForm">
                  </slot>
              </div>
              
          </div>
          <div id="propPup" class="explorer-selected-object-content-container">
            <slot name="content">
            </slot>
          </div>
          <div id="propPup" class="explorer-selected-object-content-container">
            <slot name="content2">
            </slot>
          </div>
        
        
    </div>
  </div>
</template>

<script>


export default {
  components: {
  },
  props: {
    showSelectedObjectInfo: {
        type: Boolean,
        default: () => true
    },
    defaultObjectInfoIsHidden: {
        type: Boolean,
        default: () => false
    },
    height: {
        type: Number,
        default: () => null
    },
    objectsListCaption: {
        type: String,
        default: () => null
    },
    objectFormCaption: {
        type: String,
        default: () => null
    },
    objectUrl: {
        type: String,
        default: () => null
    },
    objectUrlTitle: {
        type: String,
        default: () => null
    },
    objectDisplayExpr: {
        type: String,
        default: () => "Title"
    },
    objectNotSelectedText: {
        type: String,
        default: () => null
    },
    selectedObject: {
        type: Object,
        default: () => null
    },
  },
  methods: {
    objectsHideControlClick() {
        this.objectsIsHidden = !this.objectsIsHidden;
    },
    objectHideControlClick() {
        this.objectIsHidden = !this.objectIsHidden;
        // this.$store.dispatch("updateUserSetting", {
        //     path: this.$route.path, 
        //     key: "Explorer",
        //     field: "objectIsHidden",
        //     value: this.objectIsHidden
        // });
    },
  },
  data() {
    return {
      objectsIsHidden: false,
      objectIsHidden: false,
    }
  },
  computed: {
    objectInfoTitle() {
      const title = (this.selectedObject && this.objectDisplayExpr) ? this.selectedObject[this.objectDisplayExpr] : null;
      return title && this.objectIsHidden ? (this.objectFormCaption + ": " + title) : this.objectFormCaption;
    },
    style() {
      if(this.height) {
        return "height: " + this.height + "px";
      }
      return null;
    }
  },
  mounted() {
      this.objectsIsHidden = !!this.selectedObject;
      this.objectIsHidden = this.defaultObjectInfoIsHidden;

      const userState = this.$store.getters.getUserSettingValue("Explorer");
      if(userState) {
          this.objectIsHidden = userState.objectIsHidden;
      }
  }
};
</script>

<style>
    .explorer-objects-list-container {
      flex: 0 0;
      margin: 0 4px 0 0;
      padding: 0 6px 0 2px;
      border-right: 2px solid #aaa;
      display: flex;
      flex-direction: column;
    }
    .explorer-objects-list-header {
      display: flex;
      align-items: center;
    }
    .explorer-objects-list-title {
      flex: 1 1 auto;
      border-bottom: 1px solid rgb(255, 115, 0);
      margin: 2px 0 5px 0;
    }
    .explorer-objects-list-hiding {
      flex: 0 0 12px;
      text-align: right;
      color: #867171;
      font-size: 12px;
      cursor: pointer;
    }
    .explorer-objects-list-content {
      flex: 1 1;
      height: 100%;
    width: auto;
      overflow: hidden;
      /* border: 1px solid; */
    }

    .explorer-object-container {
      flex: 1 1 auto;
      padding: 0 2px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .explorer-selected-object-container {
      flex: 1 1;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .explorer-selected-object-info-container {
      flex: 0 0;
      padding: 0px;
      margin-bottom: 15px;
    }
    .explorer-selected-object-info-header {
      display: flex;
      align-items: center;
    }
    .explorer-selected-object-info-title {
      flex: 1 1 auto;
      border-bottom: 1px solid rgb(255, 115, 0);
      margin: 2px 0 5px 0;
    }
    .explorer-selected-object-url {
      text-decoration: none;
      color: #555;
    }
    .explorer-selected-object-url:hover {
      color: rgb(131, 93, 61);
    } 
    .explorer-selected-object-info-hiding {
      flex: 0 0 12px;
      text-align: right;
      color: #555;
      font-size: 12px;
      cursor: pointer;
    }
    .explorer-selected-object-info-form {
      margin: 0;
      padding: 0;
    }

    .explorer-selected-object-content-container {
      flex: 1 1 auto;
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }


    .explorer-not-selected-object-container {
      flex: 1 1 auto;
      text-align: center;
      padding: 100px;
      font-size: 22px;
      color: #888;
    }
    
</style>