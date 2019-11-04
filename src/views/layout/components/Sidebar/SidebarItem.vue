<template>
  <div class="menu-wrapper">
    <template v-for="item in routes">
      <router-link v-if="item.level==0 && item.url && item.isMenu" :to="item.url" :key="item.id">
        <el-menu-item id="e1" :index="item.url" :class="{'submenu-title-noDropdown':!isNest}">
          <i :class="'fa ' + item.icon" aria-hidden="true" />
          <span>{{ item.name }}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-if="item.level == 0 && !item.url && item.isMenu" id="e2" :index="item.name" :key="item.id">
        <template slot="title">
          <i :class="'fa ' + item.icon" aria-hidden="true" />
          <span>{{ item.name }}</span>
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
      </el-submenu>

    </template>
  </div>
</template>

<script>
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array,
      default: () => []
    },
    isNest: {
      type: Boolean,
      default: false
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
