<template>
  <section class="app-main">
    <keep-alive><router-view v-if="!$route.meta.noKeepAlive"/></keep-alive>
    <router-view v-if="$route.meta.noKeepAlive"/>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    // key() {
    //   return this.$route.name !== undefined ? this.$route.name + +new Date() : this.$route + +new Date()
    // }
  }
}
</script>
<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  position: relative;
  overflow: hidden;
  padding:25px;
}
</style>
