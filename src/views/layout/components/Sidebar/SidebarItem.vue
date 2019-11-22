<template>
  <div class="menu-wrapper">
    <template v-if="!item.subMenuList || item.subMenuList.length == 0">
      <app-link :to="resolvePath(item.menu_url)">
        <el-menu-item :index="resolvePath(item.menu_url)" :class="{'submenu-title-noDropdown':!isNest}">
          <i :class="'fa fa-fw ' + item.menu_icon" style="font-size:16px;color:#ddd" />
          <span slot="title" style="margin-left:10px;color:#ddd">{{ item.menu_name }}</span>
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else :index="''+item.id">
      <template slot="title">
        <i :class="'fa fa-fw ' + item.menu_icon" style="font-size:16px;color:#ddd" />
        <span slot="title" style="margin-left:10px;color:#ddd">{{ item.menu_name }}</span>
      </template>

      <template v-for="child in item.subMenuList">
        <app-link :to="resolvePath(child.menu_url)" :key="child.id">
          <el-menu-item :index="resolvePath(child.menu_url)">
            <span slot="title" style="margin-left:10px;color:#ddd">{{ child.menu_name }}</span>
          </el-menu-item>
        </app-link>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils'
import Item from './Item'
import AppLink from './Link'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      onlyOneChild: null
    }
  },
  methods: {
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath
      }
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return isExternal(routePath)
    }
  }
}
</script>
<style>
  #e1 i{
    width: 20px;
    color: white;
  }
  #e2 i{
    width: 20px;
    color: white;
  }
  #e3 i{
    width: 20px;
    color: white;
  }
</style>
