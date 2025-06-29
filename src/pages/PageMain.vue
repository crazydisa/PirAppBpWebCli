<template>
  <div class="main-menu-component">
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

export default {
  name: 'PageMain',
  methods: {
    menuItemClick(menuItem) {
        if(menuItem.Path && menuItem.Path != this.$route.path) {
            this.$router.push(menuItem.Path);
        }
    },
  },
  computed: {
    ...mapGetters([
        "getPages",
        "currentUserIsAllowedAction",
    ]),
    menuDataSource() {
      return this.getPages.filter(page => page.Name != "PageMain" &&  page.LoadAction);// && this.currentUserIsAllowedAction(page.LoadAction.Name));
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
    padding: 0 5px;
  }

  .menu-root-container,
  .menu-parent-container {
    margin: 10px 10px 0;
    padding: 10px 10px;
    flex: 1 1 100px;
    max-width: 300px;
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
