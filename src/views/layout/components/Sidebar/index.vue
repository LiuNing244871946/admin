<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.id"
        :item="route"
        :base-path="route.menu_url"
      />
    </el-menu>
  </el-scrollbar>
</template>
<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import { API } from "@/utils/api";
import { getToken } from "@/utils/auth";

export default {
  components: { SidebarItem },
  data() {
    return {
      routes: [],
      authMenu: []
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    isCollapse() {
      return !this.sidebar.opened;
    }
  },
  mounted() {},
  created() {
    this.getAuth();
  },
  methods: {
    getAuth() {
      API.MenuAuth(getToken())
        .then(res => {
          if (res.code === 200) {
            this.authMenu = res.data;
            this.getAll();
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getAll() {
      let that = this;
      API.Menu(getToken())
        .then(res => {
          let finalMenu = [];
          if (res.code === 200) {
            let authMenu = this.authMenu; // that.routes = res.data
            let data = res.data;
            let userName = sessionStorage.getItem("userName");
            if (userName == "admin") {
              this.routes = res.data;
            } else {
              for (let i = 0; i < data.length; i++) {
                let subMenuList = data[i].subMenuList; // console.log(subMenuList)
                let tmpSubMenu = [];
                for (let k = 0; k < subMenuList.length; k++) {
                  for (let j = 0; j < authMenu.length; j++) {
                    if (subMenuList[k].id == authMenu[j].id) {
                      let subobj = {
                        id: subMenuList[k].id,
                        menu_name: subMenuList[k].menu_name,
                        menu_icon: subMenuList[k].menu_icon,
                        menu_url: subMenuList[k].menu_url,
                        parent_menu_id: subMenuList[k].parent_menu_id
                      };
                      tmpSubMenu.push(subobj);
                    }
                  }
                }
                if (tmpSubMenu.length) {
                  let obj = {
                    id: data[i].id,
                    menu_name: data[i].menu_name,
                    menu_icon: data[i].menu_icon,
                    subMenuList: tmpSubMenu
                  };
                  finalMenu.push(obj);
                }
              }
              this.routes = finalMenu;
            }
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
<style  lang="scss">
</style>
