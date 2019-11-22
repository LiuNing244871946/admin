<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      mode="vertical">
      <sidebar-item v-for="route in routes" :key="route.id" :item="route" :base-path="route.menu_url"/>
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import { API } from '@/utils/api'
import { getToken } from '@/utils/auth'

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
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  mounted() {
    const that = this
    API.Menu(getToken()).then(res => {
      if (res.code === 200) {
        that.routes = res.data
      }
    }).catch(error => {
      console.log(error)
    })
  }
}
</script>
<style  lang="scss">
</style>
