<template>
  <div class="box">
    <el-form
      ref="formInline"
      :model="formInline"
      :rules="formInline"
      :inline="true"
      class="merchantSubAcount"
    >
      <el-form-item prop="stockCode">
        <el-input
          v-model="formInline.product_name"
          type="text"
          placeholder="商品名称"
          clearable
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-form-item prop="stockName">
        <el-input
          v-model="formInline.product_title"
          type="text"
          placeholder="商品标题"
          clearable
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit">查询</el-button>
        <el-button type="success" @click="addProduct">
          <i class="el-icon-plus" />添加商品
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      fit
      show-header
      empty-text="暂无数据"
      highlight-current-row
      element-loading-text="拼命加载中"
    >
      <el-table-column label="商品名称" prop="product_name" />
      <el-table-column label="商品标题" prop="product_title" />
      <el-table-column label="商品类型" prop="regDate" />
      <el-table-column label="销售数量" prop="actual_sell_num" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <!-- <el-button type="text" style="color: #478FCA" @click="productDetail(scope.row)">详情</el-button> -->
          <el-button type="text" style="color: #478FCA" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" style="color: #478FCA" @click="handleSku(scope.row)">查看规格</el-button>
          <el-button type="text" style="color: #478FCA" @click="productDetail(scope.row)">删除</el-button>
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
        @current-change="handleCurrentChange"
      />
    </div>
    <!-- 详情弹窗 -->
    <el-dialog :visible.sync="dialogVisible" title="商品详情">
      <el-form ref="formLabelAlign" :model="formLabelAlign" status-icon label-width="100px">
        <el-form-item label="商品名称:">
          <span>{{ formLabelAlign.product_name }}</span>
        </el-form-item>
        <el-form-item label="商品标题:">
          <span>{{ formLabelAlign.product_title }}</span>
        </el-form-item>
        <el-form-item label="分类id:">
          <span>{{ formLabelAlign.category_id }}</span>
        </el-form-item>
        <el-form-item label="品牌名称:">
          <span>{{ formLabelAlign.brand_name }}</span>
        </el-form-item>
        <el-form-item label="成交日期:">
          <span>{{ formLabelAlign.modify_date ? formLabelAlign.modify_date : '-' }}</span>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import request from "@/utils/request";
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
      },
      formLabelAlign: {
        id: "",
        acountId: "",
        orderId: "",
        behavior: "",
        stockCode: "",
        stockName: "",
        entrustPrice: "",
        realPrice: "",
        number: "",
        dateAdd: ""
      }
    };
  },
  mounted() {
    this.getTableDatas();
  },
  methods: {
    // 获取表格数据
    getTableDatas() {
      const that = this;
      that.listLoading = true;
      const formInline = that.formInline;
      request({
        url: "/admin/product/listProduct",
        method: "get",
        data: formInline
      }).then(response => {
        if (response.code === 200) {
          const result = response.data.productList;
          that.pagination.pageSize = response.data.pageSize;
          that.pagination.tatal = response.data.totalNum;
          that.tableData = result;
          that.listLoading = false;
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    //添加商品
    addProduct() {
      this.$router.push({
        path: "/admin/product/productList/addProduct"
      });
    },
    //编辑商品
    edit(data) {
      this.$router.push({
        path: "/admin/product/productList/addProduct",
        query: { pid: data.id }
      });
    },
    //产看规格
    handleSku() {
      // this.$router.push({
      //   path: '/admin/product/skuList'
      // })
    },
    // 查询
    onSubmit() {
      const that = this;
      that.formInline.page = 1;
      that.getTableDatas();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      const that = this;
      that.formInline.page = val;
      that.getTableDatas();
    },
    productDetail(data) {
      const that = this;
      that.dialogVisible = true;
      request({
        url: "/admin/product/getProductInfo/" + data.id,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const res = response.data;
          that.formLabelAlign = Object.assign({}, res);
        }
      });
    }
  }
};
</script>

<style lang="scss">
</style>
