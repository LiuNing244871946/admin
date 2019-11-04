<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb />
    <div class="avatar-container" trigger="click">
      <div class="navbarRight">
        <span>当前用户：{{ userInfo.realname }}</span>
        <span style="cursor:pointer" @click="changePaw">
          <i class="el-icon-setting" />修改密码
        </span>
        <span style="cursor:pointer" @click="loginOut">
          <i class="fa fa-arrow-circle-right" />
          退出
        </span>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
// import { API } from '@/utils/api'
// import { removeToken } from '@/utils/auth'
let vm
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      userInfo: {}
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  mounted() {
    vm = this
    vm.getUserInfo()
  },
  methods: {
    // 面包屑点击事件
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    }
    // 获取当前用户信息
    // getUserInfo() {
    //   API.getUserInfo().then(res => {
    //     if (res.code === 0) {
    //       if (res.data) {
    //         vm.userInfo = res.data
    //       }
    //     } else {
    //       this.$message({
    //         type: 'error',
    //         message: res.msg
    //       })
    //     }
    //   })
    // },
    // // 登出
    // loginOut() {
    //   API.loginOut().then(function(res) {
    //     if (res.code === 0) {
    //       // console.log(res.data)
    //       removeToken()
    //       vm.$router.push('login')
    //       location.reload() // 为了重新实例化vue-router对象 避免bug
    //     }
    //   }).catch(function(error) {
    //     console.log(error)
    //   })
    // },
    // // 修改密码
    // changePaw() {
    //   this.$router.push('/changePaw')
    // }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
      .navbarRight{
      span{
        padding-right:20px;
        color: #606266;
        font-size:14px;
        i{
          padding-right:5px;
        }
      }
    }
  }
}
</style>

