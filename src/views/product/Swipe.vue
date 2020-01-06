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
          <i class="el-icon-plus" />添加轮播
        </el-button>
      </el-form-item>
    </el-form>
    <!-- 表格数据 -->
    <el-table
      v-loading="listLoading"
      :data="tableData"
      fit
      border
      show-header
      empty-text="暂无数据"
      highlight-current-row
      element-loading-text="拼命加载中"
    >
      <el-table-column label="名称" prop="banner_title" />
      <el-table-column prop="image_url" label="图片">
        <template slot-scope="scope">
          <img :src="scope.row.image_url" width="80" @click="showImg(scope.row.image_url)" >
        </template>
      </el-table-column>
      <el-table-column prop="banner_type" label="跳转类型">
        <template slot-scope="scope">
          <span v-if="scope.row.banner_type==1">商品详情</span>
          <span v-else-if="scope.row.banner_type==2">代理专区</span>
          <span v-else>自定义url</span>
        </template>
      </el-table-column>
      <el-table-column label="商品名称" prop="product_name" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">修改</el-button>
          <!-- <el-button type="text" style="color: #478FCA" @click="bandPro(scope.row)">绑定商品</el-button> -->
          <el-button type="text" style="color: #478FCA" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加修改弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="110px">
        <el-form-item label="轮播图标题:" prop="banner_title">
          <el-input v-model="addForm.banner_title" auto-complete="off" />
        </el-form-item>
        <!-- <el-form-item label="活动区域" prop="banner_type">
          <el-select v-model="addForm.banner_type" placeholder="请选择活动区域">
            <el-option label="区域一" value="shanghai"/>
            <el-option label="区域二" value="beijing"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="选择跳转类型:">
          <el-select v-model="addForm.banner_type" placeholder="请选择" @change="changeUrlType">
            <el-option v-for="i in seleArr" :key="i.value" :label="i.label" :value="i.value"/>
            <!-- <el-option label="代理专区" value="2"/>
            <el-option label="自定义URL" value="3"/> -->
          </el-select>
          <el-button v-if="addForm.banner_type==1" type="text" style="color: #478FCA" @click="bandPro">绑定商品</el-button>
        </el-form-item>
        <el-form-item v-if="productName">
          <span>已绑定商品：<span style="color:#F56C6C">{{ productName }}</span></span>
        </el-form-item>
        <el-form-item v-if="addForm.banner_type == 3" label="链接地址:" prop="banner_url">
          <el-input v-model="addForm.banner_url" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序:" prop="sort_order">
          <el-input v-model="addForm.sort_order" auto-complete="off" />
        </el-form-item>
        <el-form-item label="上传轮播图片:" prop="image_url">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            class="avatar-uploader"
            action="https://lv-uncle-api.ishaohuo.cn/index.php/api/upload/uploadImg"
          >
            <img v-if="addForm.image_url" :src="addForm.image_url" class="avatar" >
            <i v-else class="el-icon-plus avatar-uploader-icon" />
          </el-upload>
        </el-form-item>
        <el-form-item>
          <el-button @click="iv_dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!---图片查看器--->
    <el-dialog :visible.sync="im_dialog.show" title="查看图片">
      <img :src="im_dialog.src" width="100%" alt="">
    </el-dialog>
    <el-dialog :visible.sync="ap_dialog.show" title="请选择商品（双击绑定商品）" width="1100px">
      <el-table :data="productList" height="450" border @cell-dblclick="checkProduct">
        <el-table-column property="product_name" label="商品名称"/>
        <el-table-column property="image_urls" label="商品图片">
          <template slot-scope="scope">
            <img :src="(scope.row.image_urls).split('@@')[0]" width="80" >
          </template>
        </el-table-column>
        <el-table-column property="category_name" label="商品类别"/>
        <el-table-column property="category_name" label="商品规格">
          <template slot-scope="scope">
            <el-tag v-for="i in scope.row.skuList" :key="i.sku_id" style="margin: 5px;">{{ i.sku_name }}</el-tag>
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
      id: "",
      productName:"",
      seleArr:[
        { value: '1', label: '商品详情' },
        { value: '2', label: '代理专区' },
        { value: '3', label: '自定义url' }
      ],
      rules: {
        banner_title: [
          { required: true, message: '请编辑轮播图标题', trigger: 'blur' }
        ],
        banner_type: [
          { required: true, message: '请选择跳转类型', trigger: 'blur' }
        ],
        sort_order: [
          { required: true, message: '设置排序', trigger: 'blur' }
        ],
        image_url: [
          { required: true, message: '请上传轮播图片', trigger: 'blur' }
        ],
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
        banner_title: "",
        image_url: "",
        banner_url: "",
        banner_title: "",
        banner_type: '',
        base_url:"/goodsDetail",
        param:""
      },
      classTop: [],
      productList:[],
      iv_dialog: {
        show: false,
        title: "",
        isEdit: false
      },
      im_dialog:{
        show: false,
        title: "",
        src:""
      },
      ap_dialog: {
        show: false,
        title: "",
        isEdit: false
      }
    };
  },
  mounted() {
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
        url: "/admin/product/listBanner",
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          that.listLoading = false;
          that.tableData = response.data
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
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
        } 
      });
    },
    changeUrlType(e){
      let that = this
      this.addForm.banner_type = e
      console.log(e)
      if(e=='2'){
        that.addForm.base_url = "/agent"
        this.addForm.banner_url = this.addForm.base_url
      }else if(e=='1'){
        that.addForm.base_url = "/goodsDetail"
        this.getProduct(1)
      }
    },
    checkProduct(row){
      let that =this
      this.productName = row.product_name
      let e = this.addForm.banner_type
      that.addForm.param = row.id
      this.addForm.banner_url = this.addForm.base_url+"?id="+this.addForm.param
      this.ap_dialog.show = false

    },
    // 打开修改弹窗
    handleRow(row) {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "修改轮播";
      this.iv_dialog.isEdit = true;
      this.id = row.id;
      this.addForm.banner_title = row.banner_title;
      this.addForm.image_url = row.image_url;
      this.addForm.banner_url = row.banner_url;
      this.addForm.sort_order = row.sort_order;
      this.addForm.base_url = row.base_url
      this.addForm.param = row.param
      this.addForm.banner_type = row.banner_type
      this.productName = row.product_name
      if(row.banner_type==1){
        this.getProduct()
      }
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

      const that = this;
      that.formInline.page = val;
      that.getTableDatas();
    },
    showImg(url){
      this.im_dialog.src = url
      this.im_dialog.show = true
    },
    //上传成功
    handleAvatarSuccess(res, file) {
      this.addForm.image_url = file.response.filename;
    },
    //上传完文件验证
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/jpg" || "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG、JPEG、PNG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    submitForm(formName) {
      let that = this;
      if (that.iv_dialog.isEdit) {
        this.postForm({ ...that.addForm, ...{ id: this.id } }, formName);
      } else {
        this.postForm(this.addForm, formName);
      }
      this.iv_dialog.isEdit = false;
    },
    //添加商品分类
    addClass() {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "添加管理员分组";
      this.iv_dialog.isEdit = false;
      this.resetForm()
      this.addForm= {
        sort_order: null,
        banner_title: "",
        image_url: "",
        banner_url: "",
        banner_title: "",
        banner_type: '',
        base_url:"/goodsDetail",
        param:""
      }
    },
    postForm(form, formName) {
      let that = this;
      console.log(form)
      if(that.addForm.banner_type=='1'&&that.addForm.param==""){
        this.$message.error('请绑定商品');
      }
      if(that.addForm.banner_type=="2"){
        this.addForm.banner_url = this.addForm.base_url
      }
      this.$refs['addForm'].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/putBanner",
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
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    del(row){
      this.$confirm('此操作将删除该轮播图, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delPost(row)
        }).catch(() => {
             
        });
    },
    delPost(row){
      request({
        url: "/admin/product/delBanner/"+row.id,
        method: "post",
      }).then(response => {
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
    },
    resetForm() {
      this.$nextTick(()=>{
        this.$refs["addForm"].resetFields();
      })
    },
    bandPro(){
      this.ap_dialog.show = true
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
