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
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table v-loading="listLoading" border :data="tableData" fit show-header empty-text="暂无数据" highlight-current-row element-loading-text="拼命加载中">
      <el-table-column label="分组名称" prop="group_name"/>
      <el-table-column label="创建日期" prop="create_date"/>
      <el-table-column label="最后修改日期" prop="modify_date"/>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleClick(scope.row)">操作</el-button>
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
    <!-- 详情弹窗 -->

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
        pageSize: 10
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
        url: '/admin/index/listGroup',
        method: 'get',
        data: formInline
      }).then(response => {
        if (response.code === 200) {
          console.log(response)
          const result = response.data
          that.pagination.pageSize = response.data.pageSize
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
    handleClick(){

    }
  }
}
</script>

<style lang="scss">
</style>
