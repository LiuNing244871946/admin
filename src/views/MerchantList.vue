<template>
  <div class="box">
    <el-form ref="formInline" :model="formInline" :rules="formInline" :inline="true" class="merchantSubAcount">
      <el-form-item prop="stockCode">
        <el-input v-model="formInline.agent_name" type="text" placeholder="代理商名称" clearable @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item prop="stockName">
        <el-input v-model="formInline.contact_number" type="text" placeholder="联系方式" clearable @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="primary" @click="addEnt('add')">添加代理商</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table v-loading="listLoading" :data="tableData" fit show-header empty-text="暂无数据" highlight-current-row element-loading-text="拼命加载中">
      <el-table-column label="代理商名称" prop="agent_name"/>
      <el-table-column label="联系方式" prop="contact_number"/>
      <el-table-column label="用户名" prop="username"/>
      <el-table-column label="创建时间" prop="create_date"/>
      <el-table-column label="修改时间" prop="modify_date"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="addEnt('edit',scope.row)">编辑</el-button>
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
    <!-- 代理商 -->
    <el-dialog :visible.sync="db_dialog.show" :title="db_dialog.title">
      <el-form ref="entForm" :model="entForm" label-width="120px">
        <el-form-item label="代理商名称：">
          <el-input v-model="entForm.agent_name" />
        </el-form-item>
       <el-form-item label="联系人：">
          <el-input v-model="entForm.contact" />
        </el-form-item>
        <el-form-item label="联系电话：">
          <el-input v-model="entForm.contact_number" />
        </el-form-item>
        <el-form-item label="用户名：">
          <el-input v-model="entForm.username" />
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
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      db_dialog:{
        title:"添加代理商",
        show: false,
        isEdit:false,
        entId:''
      },
      entForm:{
        agent_name:"",
        contact:"",
        contact_number:"",
        username:""
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
        url: '/admin/index/getAgentList',
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
    handleClick1() {

    },
    addEnt(act,row){
      this.db_dialog.show = true
      this.db_dialog.entId = ''
      
      switch(act) {
        case 'add':
          this.db_dialog.title = "添加代理商"
          this.db_dialog.isEdit = false
          this.entForm={
            agent_name:"",
            contact:"",
            contact_number:"",
            username:""
          }
          break
        case 'edit':
          this.db_dialog.entId = row.id
          this.db_dialog.title = "修改代理商信息"
          this.db_dialog.isEdit = true
          this.entForm={
            agent_name:row.agent_name,
            contact:row.contact,
            contact_number:row.contact_number,
            username:row.username
          }
          break
      }
    },
    addEntPost(){
      let postData = this.entForm
      console.log(this.db_dialog.entId)
      if(this.db_dialog.isEdit){
        postData = {...postData,...{id : this.db_dialog.entId}}
      }
      request({
        url: '/admin/index/putAgent',
        method: 'post',
        data: postData
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          this.db_dialog.show = false
          this.getTableDatas()
        } else {
          this.$message.error(response.msg);
        }
      })
    }
  }
}
</script>

<style lang="scss">
</style>
