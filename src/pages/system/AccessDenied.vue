<template>
  <div class="error-page-container">
    <p class="error-page-text">
      {{"AccessDeniedText"}}
    </p>
    <div class="error-page-link-container">
      <a class="error-page-link" :href="againPagePath">{{"TryAgain"}}</a>
    </div>
    <div class="error-page-link-container" v-if="!isMainPage">
      <a class="error-page-link" :href="mainPagePath">{{"ToMainPage"}}</a>
    </div>
  </div>
</template>

<script>

import store from '@/store'

export default {
  data() {
      return {
        appPath: store.getters.getConfigAppPath,
        page: this.$route.query.page
      }
  },
  computed: {
    againPagePath() {
      return this.appPath == "/" ? this.page : this.appPath + this.page;
    },
    mainPagePath() {
      return this.appPath ? this.appPath : "/";
    },
    isMainPage() {
      return !this.page || this.page == '/';
    }
  }
};
</script>