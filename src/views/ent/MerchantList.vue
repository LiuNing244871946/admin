<template>
  <div class="box">
    <el-form ref="formInline" :model="formInline" :rules="formInline" :inline="true" class="merchantSubAcount">

      <el-form-item class="submit">
        <el-button type="primary" @click="addEnt('add')">添加代理商</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table v-loading="listLoading" :data="tableData" border fit show-header empty-text="暂无数据" highlight-current-row element-loading-text="拼命加载中">
      <el-table-column label="代理商名称" prop="agent_name"/>
      <el-table-column label="联系方式" prop="contact_number"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="创建时间" prop="create_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改时间" prop="modify_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.modify_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="addEnt('edit',scope.row)">编辑</el-button>
          <el-button type="text" style="color: #478FCA" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 代理商 -->
    <el-dialog v-if="db_dialog.show" :visible.sync="db_dialog.show" :title="db_dialog.title">
      <el-form ref="entForm" :rules="rules" :model="entForm" label-width="120px">
        <el-form-item label="代理商名称：" prop="agent_name">
          <el-input v-model="entForm.agent_name"/>
        </el-form-item>
        <el-form-item label="用户名：" prop="username">
          <el-input v-model="entForm.username"/>
        </el-form-item>
        <el-form-item label="联系人：">
          <el-input v-model="entForm.contact" />
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="entForm.contact_number" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="db_dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="addEntPost">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import request from '@/utils/request'
export default {
  data() {
    return {
      rules: {
        agent_name: [
          { required: true, message: '请输入代理商名称', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ]
      },
      dialogVisible: false,
      formInline: {
        currPage: 1,
        pageSize: 10,
        agent_name: '',
        contact_number: ''
      },
      tableData: [],
      listLoading: true,
      pagination: {
        currPage: 1,
        pageSize: 10,
        tatal: 0
      },
      db_dialog: {
        title: '添加代理商',
        show: false,
        isEdit: false,
        entId: ''
      },
      entForm: {
        agent_name: '',
        contact: '',
        contact_number: '',
        username: ''
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
      request({
        url: '/admin/index/getAgentList?pageSize=' + this.pagination.pageSize + '&currPage=' + this.pagination.currPage,
        method: 'get'
      }).then(response => {
        if (response.code === 200) {
          const result = response.data.sysUserList
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
      that.getTableDatas()
    },
    handleCurrentChange(val) {
      const that = this
      that.pagination.currPage = val
      that.getTableDatas()
    },
    addEnt(act, row) {
      this.db_dialog.show = true
      this.resetForm()
      this.db_dialog.entId = ''
      switch (act) {
        case 'add':
          this.db_dialog.title = '添加代理商'
          this.db_dialog.isEdit = false
          this.entForm = {
            agent_name: '',
            contact: '',
            contact_number: '',
            username: ''
          }
          break
        case 'edit':
          this.db_dialog.entId = row.id
          this.db_dialog.title = '修改代理商信息'
          this.db_dialog.isEdit = true
          this.entForm = {
            agent_name: row.agent_name,
            contact: row.contact,
            contact_number: row.contact_number,
            username: row.username
          }
          break
      }
    },
    addEntPost() {
      let postData = this.entForm
      if (this.db_dialog.isEdit) {
        postData = { ...postData, ...{ id: this.db_dialog.entId }}
      }
      this.$refs['entForm'].validate(valid => {
        if (valid) {
          request({
            url: '/admin/index/putAgent',
            method: 'post',
            data: postData
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '提交成功',
                type: 'success'
              })
              this.db_dialog.show = false
              this.getTableDatas()
            } else {
              this.$message.error(response.msg)
            }
          })
        }
      })
    },
    del(row) {
      this.$confirm('此操作将删除该代理商, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delPost(row)
      }).catch(() => {

      })
    },
    delPost(row) {
      console.log(row)
      request({
        url: '/admin/index/delAgent/' + row.id,
        method: 'post'
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getTableDatas()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs['entForm'].resetFields()
      })
    }
  }
}
</script>

<style lang="scss">
</style>
