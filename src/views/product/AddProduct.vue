<template>
  <div class="box">
    <el-tabs v-model="tabName" @tab-click="tabClick">
      <el-tab-pane label="商品基本信息" name="eiTab">
        <el-form v-if="tabName == 'eiTab'" ref="ei_form" :rules="rules" :model="ei_form" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="商品名称：" prop="product_name">
                <el-input v-model="ei_form.product_name" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="商品副标题：">
                <el-input v-model="ei_form.product_title" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="设置初始销量：">
                <el-input v-model="ei_form.init_sell_num" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="排序：">
                <el-input v-model="ei_form.sort" />
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="选择分类：" prop="category_id">
                <el-select v-model="ei_form.category_id" placeholder="请选择">
                  <el-option
                    v-for="i in classList"
                    :key="i.id"
                    :label="i.category_name"
                    :value="i.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="商品类型：">
                <el-select :disabled="isEdit" v-model="ei_form.product_type" placeholder="请选择">
                  <el-option label="普通商品" value="1" />
                  <el-option label="代理商品" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="选择代理商：">
                <el-select v-model="ei_form.brand" placeholder="请选择">
                  <el-option label="平台商品" value="0"/>
                  <el-option v-for="i in bandList" :key="i.id" :label="i.agent_name" :value="i.id"/>
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="22">
              <el-form-item label="商品图片：">
                <el-upload
                  :file-list="fileList"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove"
                  action="https://lv-uncle-api.ishaohuo.cn/index.php/api/upload/uploadImg"
                  list-type="picture-card">
                  <i class="el-icon-plus"/>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img :src="dialogImageUrl" width="100%" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item class="editItem" label="商品详情：" prop="introduction">
                <Editor v-model="ei_form.introduction" />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item>
                <el-button>返回商品列表</el-button>
                <el-button :disabled="productPostState" type="primary" @click="addProduct">立即添加</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="商品规格" name="sku">
        <el-button style="margin-bottom:16px;" type="primary" icon="el-icon-plus" @click="addSku('add')" >添加规格</el-button>
        <el-row v-for="i in skuList" :key="i.index" >
          <el-form label-width="85px">
            <el-col :span="4">
              <el-form-item label="规格名称：">
                <el-input v-model="i.sku_name" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="价格：" >
                <el-input v-model="i.product_price" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="原价：">
                <el-input v-model="i.orginal_price" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="库存：">
                <el-input v-model="i.stock_total" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="排序：">
                <el-input v-model="i.sort" disabled />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left:10px">删除</el-button>
              <el-button type="primary" @click="addSku('edit',i)">编辑</el-button>
            </el-col>
          </el-form>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <!--   添加sku  -->
    <el-dialog v-if="db_dialog.show" :title="db_dialog.title" :visible.sync="db_dialog.show">
      <el-form ref="skuForm" :model="skuForm" :rules="rules" label-width="100px">
        <el-form-item label="规格名称：" prop="sku_name">
          <el-input v-model="skuForm.sku_name"/>
        </el-form-item>
        <el-form-item label="价格：" prop="product_price">
          <el-input v-model="skuForm.product_price"/>
        </el-form-item>
        <el-form-item label="原价：" prop="orginal_price">
          <el-input v-model="skuForm.orginal_price"/>
        </el-form-item>
        <el-form-item label="库存：" prop="stock_total">
          <el-input v-model="skuForm.stock_total"/>
        </el-form-item>
        <el-form-item label="排序：" prop="sort">
          <el-input v-model="skuForm.sort"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="db_dialog.show = false">取 消</el-button>
        <el-button type="primary" @click="addSkuPost">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
/* eslint-disable */
import request from "@/utils/request";
import Editor from "@/components/Editor/Editor";
export default {
  components: {
    Editor
  },
  data() {
    return {
      productPostState: false,
      fileList: [],
      rules: {
        product_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' }
        ],
        category_id: [
          { required: true, message: '请选择用商品分类', trigger: 'change' }
        ],
        init_sell_num: [
          { required: true, message: '请设置初始销量', trigger: 'blur' }
        ],
        fileList: [
          { required: true, message: '请添加商品图片', trigger: 'blur' }
        ],
        introduction: [
          { required: true, message: '请编辑商品详情', trigger: 'blur' }
        ],
        sku_name: [
          { required: true, message: '请编辑商品规格名称', trigger: 'blur' }
        ],
        product_price: [
          { required: true, message: '请编辑规格现价', trigger: 'blur' }
        ],
        orginal_price: [
          { required: true, message: '请编辑规格原价', trigger: 'blur' }
        ],
        stock_total: [
          { required: true, message: '请编辑该规格下商品库存量', trigger: 'blur' }
        ],
        sort: [
          { required: true, message: '请编辑排序', trigger: 'blur' }
        ],
      },
      classList: [],
      tabName: "eiTab",
      publicData: {
        product_id: ""
      },
      ei_form: {
        product_name: "",
        product_title: "",
        image_urls: "",
        category_id: "",
        init_sell_num: "",
        introduction: "",
        product_type: "1",
        sort: "",
        brand:"",
        // province_agent_rate:"0",
        // city_agent_rate:"0",
        // district_agent_rate:"0"
      },
      isEdit:false,
      skuList: [],
      bandList: [],
      skuForm:{
        sku_name: "",
        product_price: "",
        orginal_price: "",
        stock_total: "",
        sort: "",
      },
      db_dialog: {
        title: "添加规格",
        show: false,
        isEdit: false,
        skuId: ""
      },
      dialogImageUrl: '',
      dialogVisible: false
    };
  },
  mounted() {

  },
  created() {
    this.getClassList()
    this.getEntList()
    this.publicData.product_id = ""
    if (this.$route.query.pid) {
      this.publicData.product_id = this.$route.query.pid;
      this.initEditData();
    }
  },
  methods: {
    getEntList(){
      let that = this;
      request({
        url: "/admin/index/getAgentList",
        method: "get",
        data:{currPage:1,pageSize:999}
      }).then(response => {
        if (response.code === 200) {
          let data = response.data;
          this.bandList = data.sysUserList
        } else {
          that.$message({
            type: 'warning',
            message: response.msg
          })
        }
      });
    },
    getClassList() {
      let that = this;
      request({
        url: "/admin/product/listCategory",
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          let data = response.data;
          that.classList = data
        } else {
          that.$message({
            type: 'warning',
            message: response.msg
          })
        }
      });
    },
    tabClick() {},
    resetForm() {
      this.$nextTick(()=>{
        this.$refs['ei_form'].resetFields();
        this.fileList = []
        
      })                
    },
    resetFormSku() {
      this.$nextTick(()=>{
        this.$refs['skuForm'].resetFields();
      })                
    },
    handleRemove(file, fileList) {
      let arr= []
      if(fileList.length>0){
        for(let i=0;i<fileList.length;i++){
          let obj = {url:fileList[i].url}
          arr.push(obj)
        }
        this.fileList = arr
      }else{
        this.fileList = []
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    //上传成功
    handleAvatarSuccess(res, file) {
      // this.ei_form.image_urls = this.ei_form.image_urls + file.response.filename + "@@";
      let obj = {url:file.response.filename}
      this.fileList.push(obj)
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
    // proTypeChange(el) {
    //   this.entData();
    // },
    addProduct() {
      let that = this;
      let imgStr = ""
      if(this.fileList.length==0){
        this.$message.error("请上传商品图片");
        return false
      }
      for(let i=0;i<this.fileList.length;i++){
        imgStr = imgStr + this.fileList[i].url + "@@"
      }
      imgStr = imgStr.slice(0,imgStr.length-2)
      this.ei_form.image_urls =  imgStr
      let postData = that.ei_form
      if(that.publicData.product_id){
        postData = { ...{id:that.publicData.product_id},...that.ei_form }
      }
      this.$refs["ei_form"].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/putProduct",
            method: "post",
            data: postData
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              that.publicData.product_id = response.data.product_id;
              this.tabName = "sku";
              this.productPostState = true
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      })
      
    },
    ////////////////////////////SKU////////////////////////////////////////
    addSku(act,row) {

      switch(act) {
        case 'add':
          this.db_dialog.show = true
          this.skuForm.sku_name = ''
          this.skuForm.product_price = ''
          this.skuForm.orginal_price = ''
          this.skuForm.sort = ''
          this.skuForm.stock_total = ''
          this.db_dialog.isEdit = false
          break
        case 'edit':
          this.skuForm.sku_name = row.sku_name
          this.skuForm.product_price = row.product_price
          this.skuForm.orginal_price = row.orginal_price
          this.skuForm.sort = row.sort
          this.skuForm.stock_total = row.stock_total
          this.db_dialog.show = true
          this.db_dialog.skuId = row.sku_id
          this.db_dialog.isEdit = true
          break
      }
    },
    addSkuPost(skuData) {
      let that = this;
      if(!this.publicData.product_id){
        this.$message.error('请先添加商品');
        return false
      }
      let postData = {...{product_id: this.publicData.product_id},...this.skuForm}
      if(that.db_dialog.isEdit){
        postData = {...{id: this.db_dialog.skuId},...postData}
      }
      this.$refs["skuForm"].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/putProductSku",
            method: "post",
            data: postData
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.resetFormSku()
              this.db_dialog.show = false
              this.initEditData()
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      })
      
    },
    ////////////////    编辑页面初始化数据     ////////////////////
    initEditData() {
      let that = this;
        request({
          url: "/admin/product/getProductInfo/" + that.publicData.product_id,
          method: "get"
        }).then(response => {
          this.fileList = []
          if(response.data.image_urls!==""){
            let arr = (response.data.image_urls).split("@@")
            for(let i=0;i<arr.length;i++){
              let obj = {url:arr[i]}
              this.fileList.push(obj)
            }
          }
          
          this.ei_form = {
            product_name: response.data.product_name,
            product_title: response.data.product_title,
            category_id: response.data.category_id,
            init_sell_num: response.data.init_sell_num,
            introduction: response.data.introduction,
            product_type: response.data.product_type,
            sort: response.data.sort,
            brand: response.data.brand,
            // province_agent_rate: response.data.province_agent_rate,
            // city_agent_rate: response.data.city_agent_rate,
            // district_agent_rate: response.data.district_agent_rate
          };
          let imgUrl = (response.data.image_urls).split("@@")
          this.$set(this, "isEdit", true)
          this.$set(this.ei_form, "introduction", response.data.introduction);
          this.skuList = response.data.skuList
          console.log(response.data.skuList)
          
        });
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
.editItem .el-form-item__content {
  line-height: 0px;
}
</style>
