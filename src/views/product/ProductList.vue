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
      <el-table-column label="商品类型" prop="product_type" />
      <el-table-column label="销售数量" prop="actual_sell_num" />
      <el-table-column label="下架/上架" prop="actual_sell_num">
        <template slot-scope="scope">
          <el-switch @change="changeSwitch(scope.row)" active-color="#13ce66" inactive-color="#ccc" active-value="1" inactive-value="0" v-model="scope.row.is_marketable"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" style="color: #478FCA" @click="dele(scope.row)">删除</el-button>
          <el-button type="text" v-if="scope.row.product_type == 2" style="color: #478FCA" @click="bandSku(scope.row)">绑定规格</el-button>
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
    <!----  代理商品绑定sku  ---->
    <el-dialog :visible.sync="db_dialog.show" :title="db_dialog.title">
      <el-form ref="bandSkuForm" :model="bandSkuForm" label-width="170px">
        <el-form-item label="发起人购买商品规格：">
          <el-select style="width:400px" v-model="bandSkuForm.founder_sku_id" placeholder="请选择">
            <el-option v-for="i in db_dialog.skuList" :key="i.sku_id" :label="i.sku_name" :value="i.sku_id" />
          </el-select>
        </el-form-item>
       <el-form-item label="合伙人购买商品规格：">
          <el-select style="width:400px" v-model="bandSkuForm.partner_sku_id" placeholder="请选择">
            <el-option v-for="i in db_dialog.skuList" :key="i.sku_id" :label="i.sku_name" :value="i.sku_id" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="db_dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="bandSkuPost">提 交</el-button>
      </div>
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
      switchValue:false,
      formInline: {
        currPage: 1,
        pageSize: 15
      },
      tableData: [],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSizes: [15],
        pageSize: 0,
        tatal: 0
      },
      bandSkuForm: {
        founder_sku_id:"",
        partner_sku_id:"",
      },
      db_dialog:{
        title:"代理商品绑定商品规格",
        show: false,
        skuList:[],
        productid:"",
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
        url: "/admin/product/listProduct?pageSize="+this.formInline.pageSize+"&currPage="+this.formInline.currPage,
        method: "get"
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
    //获取规格
    bandSku(row) {
      console.log(row)
      this.bandSkuForm.partner_sku_id = row.partner_sku_id
      this.bandSkuForm.founder_sku_id = row.founder_sku_id
      this.db_dialog.productid = row.id
      this.db_dialog.skuList = row.skuList
      this.db_dialog.show = true
    },
    //绑定商品规格id
    bandSkuPost(){
      let that = this
      request({
        url: "/admin/product/setAgentProductSku/" + that.db_dialog.productid,
        method: "post",
        data:this.bandSkuForm
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "绑定成功",
            type: "success"
          });
          this.db_dialog.show = false
        }else{
          this.$message.error(response.msg);
        }
      });
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
    changeSwitch(row){
      let state = null
      console.log(parseInt(row.is_marketable))
      if(parseInt(row.is_marketable)==0){
        state = 0
      }else{
        state = 1
      }
      console.log(state)
      
      this.$confirm('确认修改？')
      .then(_ => {
        request({
          url: "/admin/product/setProductStatus/" + row.id,
          method: "post",
          data:{operate_type:"market",set_value:state}
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success"
            });
            this.getTableDatas() 
          }else{
            this.$message.error(response.msg);
          }
        });
        done();
      })
      .catch(_ => {
        this.getTableDatas() 
      });
    },
    dele(row){
      this.$confirm('确定删除商品？').then(_ => {
        request({
          url: "/admin/product/setProductStatus/" + row.id,
          method: "post",
          data:{operate_type:"delete",set_value:1}
        }).then(response => {
          if (response.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success"
            });
            this.getTableDatas() 
          }else{
            this.$message.error(response.msg);
          }
        });
        done();
      })
      .catch(_ => {

      });
    }
  }
};
</script>

<style lang="scss">
.el-dialog{
  width: 650px
}
</style>
