<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />
    <breadcrumb />
    <div class="avatar-container" trigger="click">
      <div class="navbarRight">
        <span>当前用户：{{ userNames }}</span>
        <span style="cursor:pointer" @click="modifyPwd">
          <i class="el-icon-setting" />修改密码
        </span>
        <span style="cursor:pointer" @click="logout">
          <i class="fa fa-arrow-circle-right" />
          退出
        </span>
      </div>
    </div>
    <!--修改密码-->
    <el-dialog :visible.sync="dialogPasswordVisible" title="修改密码" append-to-body>
      <el-form ref="formPwd" :model="formPwd" :rules="rulePwd" label-width="70px">
        <el-form-item label="原密码" prop="oldPwd">
          <el-input v-model="formPwd.oldPwd" type="password"/>
        </el-form-item>
        <el-form-item label="新密码" prop="password">
          <el-input v-model="formPwd.password" type="password"/>
        </el-form-item>
        <el-form-item label="确认密码" prop="password_confirm">
          <el-input v-model="formPwd.password_confirm" type="password"/>
        </el-form-item>
        <el-form-item style="display:block;text-align:center;margin-left:0px">
          <el-button type="primary" @click="submitForm('formPwd')">提交</el-button>
          <el-button @click="resetForm('formPwd')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { API } from '@/utils/api'
import { removeToken } from '@/utils/auth'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.formPwd.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      dialogPasswordVisible: false,
      userNames: '',
      formPwd: {
        oldPwd: '',
        password: '',
        password_confirm: ''
      },
      rulePwd: {
        oldPwd: [{ required: true, message: '请输入原密码', trigger: 'blur' }],
        password: [
          { required: true, message: '请输入新密码', trigger: 'blur' }
        ],
        password_confirm: [{ validator: validatePass, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'userName'
    ])
  },
  mounted() {
    this.userNames = localStorage.getItem('userName')
  },
  methods: {
    // 面包屑点击事件
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    // 退出的功能
    logout() {
      removeToken()
      sessionStorage.clear()
      this.$router.push('/login')
    },
    // 修改密码
    modifyPwd() {
      this.password_confirm = ''
      for (const x in this.formPwd) {
        this.formPwd[x] = ''
      }
      this.dialogPasswordVisible = true
    },
    // 重置的功能
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 提交修改密码
    submitForm(formName) {
      const that = this
      this.$refs[formName].validate(valid => {
        if (valid) {
          API.modifyPassword(that.formPwd.oldPwd, that.formPwd.password, that.formPwd.password_confirm).then(
            response => {
              if (response.code === 200) {
                that.$message({
                  message: '密码修改成功',
                  type: 'success'
                })
                that.logout()
              } else {
                that.$message({
                  message: response.msg,
                  type: 'warning'
                })
              }
            }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
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

