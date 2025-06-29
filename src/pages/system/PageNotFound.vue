<template>
  <div class="error-page-container">
    <p class="error-page-text">
      {{"PageNotFoundText"}}
    </p>
    <a class="error-page-link" :href="mainPagePath">{{"ToMainPage"}}</a>
  </div>
</template>

<script>

import store from '@/store'

export default {
  data() {
      return {
        appPath: store.getters.getConfigAppPath,
      }
  },
  computed: {
    mainPagePath() {
      return this.appPath ? this.appPath : "/";
    },
  }
};
</script>