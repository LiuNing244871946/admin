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
          <i class="el-icon-plus" />商品活动
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
      <el-table-column label="id" prop="id" />
      <el-table-column label="活动名称" prop="activity_name" />
      <el-table-column prop="image_url" label="活动主图">
        <template slot-scope="scope">
          <img :src="scope.row.image_url" width="80" @click="showImg(scope.row.image_url)" >
        </template>
      </el-table-column>
      <el-table-column label="商品类型" prop="regDate" />
      <el-table-column label="操作" width="220">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">修改</el-button>
          <el-button type="text" style="color: #478FCA" @click="viewProduct(scope.row,scope)">查看商品</el-button>
          <el-button type="text" style="color: #478FCA" @click="delAct(scope.row)">删除活动</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加修改弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" :rules="rules" status-icon label-width="110px">
        <el-form-item label="活动名称:" prop="activity_name">
          <el-input v-model="addForm.activity_name" auto-complete="off" />
        </el-form-item>
        <el-form-item label="排序:" prop="sort">
          <el-input v-model="addForm.sort" type="number" auto-complete="off" />
        </el-form-item>
        <el-form-item label="上传活动头图:" prop="image_url">
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
          <el-button @click="iv_dialog.show=false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">添加</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <!-- 图片查看器 -->
    <el-dialog :visible.sync="im_dialog.show" title="查看图片">
      <img :src="im_dialog.src" width="100%" alt="">
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
      rules: {
        activity_name: [
          { required: true, message: '请编辑活动名称', trigger: 'blur' }
        ],
        image_url: [
          { required: true, message: '请上传活动图片', trigger: 'change' }
        ],
        sort: [
          { required: true, message: '请编辑排序', trigger: 'blur' }
        ],
      },
      formInline: {
        currPage: 1,
        pageSize: 10
      },
      productList:[],
      tableData: [],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      addForm: {
        sort: "",
        image_url: "",
        activity_name: ""
      },
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
      that.tableData = [];
      that.classTop = [];
      const formInline = that.formInline;
      request({
        url: "/admin/product/listProductActivity",
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          that.listLoading = false;
          that.tableData = response.data;
          
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    // 打开修改弹窗
    handleRow(row) {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "修改管理员分组";
      this.iv_dialog.isEdit = true;
      this.id = row.id;
      this.addForm.activity_name = row.activity_name;
      this.addForm.image_url = row.image_url;
      this.addForm.sort = row.sort;
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
      this.resetForm()
      this.iv_dialog.title = "添加管理员分组";
      this.iv_dialog.isEdit = false;
      this.addForm= {
        sort: "",
        image_url: "",
        activity_name: ""
      }
    },
    postForm(form, formName) {
      // return
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/putProductActivity",
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
    viewProduct(row){
      this.$router.push({
        path: '/admin/product/productActivity/ActiveDetail',
        query:{
          id:row.id
        }
      })
    },
    
    delAct(row){
      this.$confirm('确认删除该活动？')
        .then(_ => {
          request({
            url: "/admin/product/delProductActivity/"+row.id,
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
    resetForm() {
      this.$nextTick(()=>{
        this.$refs['addForm'].resetFields();
      })                
    },
    showImg(url){
      this.im_dialog.src = url
      this.im_dialog.show = true
    },
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
