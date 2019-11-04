<template>
  <scroll-bar>
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      mode="vertical">
      <sidebar-item :routes="routes" />
    </el-menu>
  </scroll-bar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
// import { API } from '@/utils/api'

export default {
  components: { SidebarItem },
  data() {
    return {
      routes: []
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    /* routes() {
      return this.$router.options.routes
    },*/
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    // API.getMenu().then(function(res) {
    //   if (res.code === 0) {
    //     // console.log(res.data)
    //     vm.routes = res.data
    //   }
    // }).catch(function(error) {
    //   console.log(error)
    // })
  }
}
</script>
<style>

</style>
