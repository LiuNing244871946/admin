<template>
  <div class="menu-wrapper">
    <template>
      <router-link :to="item.menu_url" :key="item.id">
        <el-menu-item id="e1" :index="item.menu_url" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- <i :class="'fa ' + item.icon" aria-hidden="true" /> -->
          <span>{{ item.menu_name }}</span>
        </el-menu-item>
      </router-link>
      <!-- <el-submenu v-if="!item.menu_url" id="e2" :index="item.name" :key="item.id">
        <template slot="title">
          <i :class="'fa ' + item.icon" aria-hidden="true" />
          <span>{{ item.menu_name }}</span>
        </template>

        <template v-for="child in routes" v-if="child.pid == item.id">
          <sidebar-item v-if="child.children&&child.children.length>0" :is-nest="true" :key="child.path" :routes="[child]" class="nest-menu" />

          <router-link v-else :to="child.url" :key="child.id">
            <el-menu-item id="e3" :index="child.url">
              <i class="fa fa-caret-right" aria-hidden="true" />
              <span>{{ child.name }}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu> -->

    </template>
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
