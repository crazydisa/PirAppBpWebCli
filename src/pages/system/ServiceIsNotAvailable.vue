<template>
  <div class="error-page-container">
    <p class="error-page-text">
      {{"ServiceIsNotAvailableText"}}
    </p>
    <div class="error-page-link-container">
      <a class="error-page-link" :href="againPagePath">{{"TryAgain"}}</a>
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
    }
  }
};
</script>