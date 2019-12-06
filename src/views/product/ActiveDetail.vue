<template>
  <div class="box">
    <el-form
      ref="formInline"
      :model="formInline"
      :rules="formInline"
      :inline="true"
      class="merchantSubAcount"
    >
      
      <el-form-item class="submit">
        <el-button type="success" @click="addClass">
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
      <el-table-column prop="image_urls" label="商品图片">
        <template slot-scope="scope">
          <img :src="(scope.row.image_urls).split('@@')[0]" width="80" >
        </template>
      </el-table-column>
      <el-table-column label="商品类型" prop="product_type">
         <template slot-scope="scope">
          <span v-if="scope.row.product_type==1">代理商品</span>
          <span v-else>普通商品</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="delpro(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="请选择商品（双击添加商品）" :visible.sync="ap_dialog.show" width="1100px">
      <el-table :data="productList" height="450" border @cell-dblclick="checkProduct">
        <!-- <el-table-column type="selection" width="55"></el-table-column> -->
        <el-table-column property="product_name" label="商品名称"></el-table-column>
        <el-table-column property="image_urls" label="商品图片">
          <template slot-scope="scope">
            <img :src="(scope.row.image_urls).split('@@')[0]" width="80" >
          </template>
        </el-table-column>
        <el-table-column property="category_name" label="商品类别"></el-table-column>
        <el-table-column property="category_name" label="商品规格">
          <template slot-scope="scope">
            <el-tag style="margin: 5px;" v-for="i in scope.row.skuList" :key="i.sku_id">{{i.sku_name}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ap_dialog.show = false">取消</el-button>
        <el-button type="primary" @click="ap_dialog.show = false">添加</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import request from "@/utils/request";
export default {
  data() {
    return {
      activeInfo:{
        id:"",
        index:""
      },
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
      addForm: {
        sort_order: null,
        parent_cat_id: "",
        category_img: "",
        category_name: ""
      },
      classTop: [],
      productList:[],
      iv_dialog: {
        show: false,
        title: "",
        isEdit: false
      },
      ap_dialog: {
        show: false,
        title: "",
        isEdit: false
      }
    };
  },
  mounted() {
    this.activeInfo.id = this.$route.query.id
    this.getTableDatas();
    this.getProduct()
  },
  methods: {
    // 获取表格数据
    getTableDatas() {
      const that = this;
      that.listLoading = true;
      that.tableData = [];
      that.classTop = [];
      const formInline = that.formInline;
      request({
        url: "/admin/product/getProductActivityDetail/"+this.activeInfo.id,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          that.tableData = response.data
          that.listLoading = false
        } else {
          that.pagination.pageSize = 0
          that.pagination.tatal = 0
          that.tableData = []
        }
      });
    },
    getProduct(){
      request({
        url: "/admin/product/listProduct?pageSize="+9999+"&currPage="+1,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          this.productList = response.data.productList
        } else {
          
        }
      });
    },
    checkProduct(row){
      let form = {
        product_id: row.id,
        sort: 0
      }
      request({
        url: "/admin/product/addActivityProduct/"+this.activeInfo.id,
        method: "post",
        data: form
      }).then(response => {
        console.log(response)
        if (response.code === 200) {
          this.getTableDatas()
          this.ap_dialog.show = false
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    // 打开修改弹窗
    handleRow(row) {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "修改管理员分组";
      this.iv_dialog.isEdit = true;
      this.id = row.id;
      this.addForm.category_name = row.category_name;
      this.addForm.parent_cat_id = row.parent_cat_id;
      this.addForm.category_img = row.category_img;
      this.addForm.sort_order = row.sort_order;
    },
    // 查询
    onSubmit() {
      const that = this;
      that.formInline.page = 1;
      that.getTableDatas();
    },
    delpro(row){
      this.$confirm('确定在该活动下删除该商品？')
        .then(_ => {
          request({
            url: "/admin/product/delActivityProductDetail/"+row.id,
            method: "get"
          }).then(response => {
            console.log(response)
            if (response.code === 200) {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getTableDatas();
            } else {
              this.$message.error(response.msg);
            }
          });
          done();
        })
        .catch(_ => {});
    },
    //添加商品分类
    addClass() {
      this.ap_dialog.show = true;
    },
    postForm(form, formName) {
      // return
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/putCategory",
            method: "post",
            data: form
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              that.iv_dialog.show = false;
              this.getTableDatas();
              that.resetForm(formName);
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="scss">
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
