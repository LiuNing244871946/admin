<template>
  <div class="box">
    <el-form ref="formInline" :model="formInline" :rules="formInline" :inline="true" class="merchantSubAcount">
      <el-form-item prop="stockCode">
        <el-input v-model="formInline.product_name" type="text" placeholder="商品名称" clearable @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item prop="stockName">
        <el-input v-model="formInline.product_title" type="text" placeholder="商品标题" clearable @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="success" @click="addAdmin"><i class="el-icon-plus" />添加管理员</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table v-loading="listLoading" :data="tableData" border fit show-header empty-text="暂无数据" highlight-current-row element-loading-text="拼命加载中">
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="角色类型" prop="role_Type"/>
      <el-table-column label="所属组" prop="groupname"/>
      <el-table-column label="销售数量" prop="actual_sell_num"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleClick1(scope.row)">详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center" style="margin-top:20px;padding-bottom:40px;">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.pageSize"
        :total="pagination.tatal"
        layout="total, sizes, prev, pager, next, jumper"
        small
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>
    <!-- 添加管理员 -->
    <el-dialog :visible.sync="dialogFormVisible" title="添加管理员">
      <el-form ref="addForm" :model="addForm" label-width="90px">
        <el-form-item label="用户名：">
          <el-input v-model="addForm.username" auto-complete="off" />
        </el-form-item>
        <el-form-item label="密码：" >
          <el-input v-model="addForm.password" auto-complete="off" />
        </el-form-item>
        <el-form-item label="电话：" >
          <el-input v-model="addForm.phone" auto-complete="off" />
        </el-form-item>
        <el-form-item label="选择分组：" >
          <el-select v-model="addForm.region" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai" />
            <el-option label="区域二" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item style="display:block;text-align:center;" label-width="0px">
          <el-button @click="dialogFormVisible = false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
          <!-- <el-button @click="resetForm('formLabelAlign')">重置</el-button> -->
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth: '100px',
      formInline: {
        currPage: 1,
        pageSize: 10
      },
      addForm: {
        username: '',
        phone: '',
        group_id: '',
        password: ''
      },
      tableData: [],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      }
    }
  },
  mounted() {
    this.getTableDatas()
  },
  methods: {
    // 获取表格数据
    getTableDatas() {
      const that = this
      that.listLoading = true
      const formInline = that.formInline
      request({
        url: '/admin/index/getSysUserList',
        method: 'get',
        data: formInline
      }).then(response => {
        if (response.code === 200) {
          const result = response.data.sysUserList
          // that.pagination.pageSize = response.data.pageSize
          that.pagination.tatal = response.data.totalNum
          that.tableData = result
          that.listLoading = false
        } else {
          that.pagination.pageSize = 0
          that.pagination.tatal = 0
          that.tableData = []
        }
      })
    },
    // 查询
    onSubmit() {
      const that = this
      that.formInline.page = 1
      that.getTableDatas()
    },
    handleSizeChange(val) {
    // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      const that = this
      that.formInline.page = val
      that.getTableDatas()
    },
    // 添加管理员
    addAdmin() {
      const that = this
      that.dialogFormVisible = true
    },
    submitForm(formName) {
      const that = this
      const addForm = that.addForm
      this.$refs[formName].validate((valid) => {
        if (valid) {
          request({
            url: '/admin/index/putSysUser',
            method: 'post',
            data: addForm
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              that.resetForm(formName)
              that.dialogFormVisible = false
              this.getTableDatas()
            } else {
              this.$message({
                message: response.msg,
                type: 'warning'
              })
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
