<template>
  <div class="box">
    <el-form ref="formInline" :model="query" :inline="true" class="merchantSubAcount">
      <el-form-item>
        <el-select v-model="query.type" placeholder="请选择代理范围">
          <el-option
            v-for="item in entType"
            :key="item.value"
            :label="item.label"
            :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.exhibit_id" type="text" placeholder="代理ID" clearable @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item>
        <el-input v-model="query.keyword" type="text" placeholder="关键字" clearable @keyup.enter.native="onSubmit"/>
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="success" @click="exportExcel">导出Excel</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table v-loading="listLoading" :data="tableData" border fit show-header empty-text="暂无数据" highlight-current-row element-loading-text="拼命加载中">
      <el-table-column label="下单用户" prop="nick_name">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.headimgurl" alt="" style="width:80px">
            <p>{{ scope.row.nick_name }}/{{ scope.row.exhibit_id }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="代理类型" prop="agent_type">
        <template slot-scope="scope">
          <p v-if="scope.row.agent_type==1">发起人</p>
          <p v-else-if="scope.row.agent_type==2">合伙人</p>
        </template>
      </el-table-column>
      <el-table-column label="代理区域" prop="agent_region_name"/>
      <el-table-column label="联系方式" prop="phone"/>
      <el-table-column label="代理商品名" prop="product_name"/>
      <el-table-column label="供货商" prop="agent_name"/>
      <el-table-column label="添加时间" prop="modify_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.modify_date) }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="addEnt('edit',scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>
    <el-table :data="tableDataExcel" style="display:none" id="out-table"  border fit show-header>
      <el-table-column label="代理昵称" prop="nick_name"/>
      <el-table-column label="代理ID" prop="exhibit_id"/>
      <el-table-column label="联系方式" prop="phone"/>
      <el-table-column label="代理类型" prop="agent_type">
        <template slot-scope="scope">
          <p v-if="scope.row.agent_type==1">发起人</p>
          <p v-else-if="scope.row.agent_type==2">合伙人</p>
        </template>
      </el-table-column>
      <el-table-column label="代理区域" prop="agent_region_name"/>
      <el-table-column label="代理商品名" prop="product_name"/>
      <el-table-column label="供货商" prop="agent_name"/>
      <el-table-column label="添加时间" prop="modify_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.modify_date) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center" style="margin-top:20px;padding-bottom:40px;">
      <el-pagination
        :current-page="query.currPage"
        :page-size="query.pageSize"
        :total="query.tatal"
        layout="total, prev, pager, next, jumper"
        small
        @current-change="handleCurrentChange" />
    </div>
    <!-- 代理商 -->
    <el-dialog v-if="db_dialog.show" :visible.sync="db_dialog.show" :title="db_dialog.title">
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
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  data() {
    return {
      entType: [
        { value: 1, label: '商城区域' },
        { value: 2, label: '商品区域代理' }
      ],
      dialogVisible: false,
      formInline: {
        currPage: 1,
        pageSize: 10,
        agent_name: '',
        contact_number: ''
      },
      tableData: [],
      tableDataExcel:[],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
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
      },
      query: {
        currPage: 1,
        pageSize: 10,
        exhibit_id: '',
        keyword: '',
        type: '',
        total: 0
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
        url: '/admin/user/getAgentUserList?currPage=' + this.query.currPage + '&pageSize=' + this.query.pageSize + '&exhibit_id=' + this.query.exhibit_id + '&keyword=' + this.query.keyword + '&type=' + this.query.type,
        method: 'get'
      }).then(response => {
        if (response.code === 200) {
          const result = response.data.agentList
          that.query.tatal = response.data.totalNum
          that.tableData = result
          that.listLoading = false
          this.getTableDatasExcal()
        } else {
          that.pagination.pageSize = 0
          that.pagination.tatal = 0
          that.tableData = []
        }
      })
    },
    getTableDatasExcal() {
      const that = this
      const formInline = that.formInline
      request({
        url: '/admin/user/getAgentUserList?currPage=1&pageSize=' + this.query.tatal + '&exhibit_id=' + this.query.exhibit_id + '&keyword=' + this.query.keyword + '&type=' + this.query.type,
        method: 'get'
      }).then(response => {
        if (response.code === 200) {
          const result = response.data.agentList
          that.tableDataExcel = result
        } 
      })
    },
    // 查询
    onSubmit() {
      const that = this
      that.query.currPage = 1
      that.getTableDatas()
    },
    resetForm() {
      this.$nextTick(() => {
        this.$refs['entForm'].resetFields()
      })
    },
    handleCurrentChange(val) {
      const that = this
      this.query.currPage = val
      that.getTableDatas()
    },
    handleClick1() {

    },
    addEnt(act, row) {
      this.resetForm()
      this.db_dialog.show = true
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
      console.log(this.db_dialog.entId)
      if (this.db_dialog.isEdit) {
        postData = { ...postData, ...{ id: this.db_dialog.entId }}
      }
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
    },
    exportExcel() {
    /* 从表生成工作簿对象 */
      var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
      /* 获取二进制字符串作为输出 */
      var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "array"
      });
      try {
          FileSaver.saveAs(
          //Blob 对象表示一个不可变、原始数据的类文件对象。
          //Blob 表示的不一定是JavaScript原生格式的数据。
          //File 接口基于Blob，继承了 blob 的功能并将其扩展使其支持用户系统上的文件。
          //返回一个新创建的 Blob 对象，其内容由参数中给定的数组串联组成。
          new Blob([wbout], { type: "application/octet-stream" }),
          //设置导出文件名称
          "代理列表.xlsx"
          );
      } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
      }
      return wbout;
    }
  }
}
</script>

<style lang="scss">
</style>
