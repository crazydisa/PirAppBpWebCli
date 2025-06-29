<template>
  <div class="main-menu-component">
    <LoadPanel v-if="loading"/>
    <div class="menu-container">
      <div class="menu-root-container" v-for="(menuItem, index) in menuDataSource" :key="index" @click="menuItemClick(menuItem)">
        <h3 v-if="menuItem.Title">
          <i v-if="!!menuItem.IconName" :class="'dx-icon dx-icon-' + menuItem.IconName"></i> 
          {{menuItem.Title}}
        </h3>
      </div>
    </div>
  </div>
</template>

<script>

import { mapGetters} from "vuex";
import api from "@/store/api"
import localizeFilter from '@/localize';

export default {
  name: 'PageMaintenance',
  data() {
    return {
      loading: null
    }
  },
  methods: {
    async menuItemClick(menuItem) {
      this.loading = true;
      await api.importObjects(menuItem.Name, menuItem.Path);
      this.loading = false;
    },
  },
  computed: {
    ...mapGetters([
        "currentUserIsAllowedAction",
    ]),
    menuDataSource() {
      return [
          {
            Name: "ImportFileData",
            Title: localizeFilter("ImportFileData"),
            Path: "/system/import/file-data"
          }, {
            Name: "ImportPirAppData",
            Title: localizeFilter("ImportPirAppData"),
            Path: "/system/import/pir-app-data"
          }, {
            Name: "ImportSapsanData",
            Title: localizeFilter("ImportSapsanData"),
            Path: "/system/import/sapsan-data"
          }
      ];
    },
  }
}
</script>


<style scoped>

  .main-menu-component {
    padding: 10px 0;
  }

  .menu-container{
    display: flex;
    flex-flow: row wrap;
    flex-direction: row;
    justify-content: space-around;
    padding: 0 15px;
  }

  .menu-root-container,
  .menu-parent-container {
    margin: 10px 10px 0;
    padding: 10px 10px;
    flex: 1 1 300px;
    max-width: 600px;
    text-align: center;
    background-color: #fff;
    border-radius: 6px;
    box-shadow: 0 5px 10px rgb(207, 207, 207);
    color: #444;
    border: 1px solid #ccc;
  }

  .menu-items-container {
    margin: 10px 0 20px 0;
    padding-top: 5px;
    border-top: 1px solid rgb(255, 150, 65);
  }

  .menu-root-container {
    text-align: center;
    cursor: pointer;
  }

  .menu-item {
    text-align: left;
    cursor: pointer;
    padding: 4px 0 4px 5px;
  }

  .menu-root-container:hover,
  .menu-item:hover {
    background-color: rgb(255, 242, 209);
    color: #111;
  }


  .menu-item-title {
    font-size: 14px;
    font-weight: 300;
  }
</style>
