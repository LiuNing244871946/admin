<template>
  <div class="box">
    <el-tabs v-model="tabName" @tab-click="tabClick">
      <el-tab-pane label="商品基本信息" name="eiTab">
        <el-form ref="ei_form" :model="ei_form" label-width="140px">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="商品名称：">
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
              <el-form-item label="选择分类：">
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
              <el-col v-if="ei_form.product_type == 2" :span="11">
                <el-form-item label="省代理佣金比设置：">
                  <el-input v-model="ei_form.province_agent_rate" />
                </el-form-item>
              </el-col>
              <el-col v-if="ei_form.product_type == 2" :span="11">
                <el-form-item label="市代佣金比例设置：">
                  <el-input v-model="ei_form.city_agent_rate" />
                </el-form-item>
              </el-col>
              <el-col v-if="ei_form.product_type == 2" :span="11">
                <el-form-item label="区代佣金比例设置：">
                  <el-input v-model="ei_form.district_agent_rate" />
                </el-form-item>
              </el-col>
            <el-col :span="22">
              <el-form-item label="商品图片：">
                <!-- <el-upload
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  class="avatar-uploader"
                  action="https://lv-uncle-api.ishaohuo.cn/index.php/api/upload/uploadImg"
                >
                  <img v-if="ei_form.image_urls" :src="ei_form.image_urls" class="avatar" >
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload> -->
                <el-upload
                  action="https://lv-uncle-api.ishaohuo.cn/index.php/api/upload/uploadImg"
                  list-type="picture-card"
                  :file-list="fileList"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :on-preview="handlePictureCardPreview"
                  :on-remove="handleRemove">
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                  <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item class="editItem" label="商品详情：">
                <Editor v-model="ei_form.introduction" />
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item>
                <el-button>返回商品列表</el-button>
                <el-button type="primary" @click="addProduct">立即添加</el-button>
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
                <el-input disabled v-model="i.sku_name" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="价格：">
                <el-input disabled v-model="i.product_price" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="原价：">
                <el-input disabled v-model="i.orginal_price" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="库存：">
                <el-input disabled v-model="i.stock_total" />
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="排序：">
                <el-input disabled v-model="i.sort" />
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
    <el-dialog :title="db_dialog.title" :visible.sync="db_dialog.show">
      <el-form :model="skuForm" label-width="100px">
        <el-form-item label="规格名称：">
          <el-input v-model="skuForm.sku_name"></el-input>
        </el-form-item>
        <el-form-item label="价格：">
          <el-input v-model="skuForm.product_price"></el-input>
        </el-form-item>
        <el-form-item label="原价：">
          <el-input v-model="skuForm.orginal_price"></el-input>
        </el-form-item>
        <el-form-item label="库存：">
          <el-input v-model="skuForm.stock_total"></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="skuForm.sort"></el-input>
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
      fileList: [],

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
        province_agent_rate:"0",
        city_agent_rate:"0",
        district_agent_rate:"0"
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
          console.log(data)
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
          console.log(data);
          for (let i = 0; i < data.length; i++) {
            if (data[i].subCategory && data[i].subCategory.length > 0) {
              for (let j = 0; j < data[i].subCategory.length; j++) {
                that.classList.push(data[i].subCategory[j]);
              }
            }
          }
        } else {
          that.$message({
            type: 'warning',
            message: response.msg
          })
        }
      });
    },
    tabClick() {},


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
      console.log(res)
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
    addProduct() {
      let that = this;
      // let str = this.ei_form.image_urls
      // this.ei_form.image_urls =  str.slice(0,str.length-2)
      let imgStr = ""
      for(let i=0;i<this.fileList.length;i++){
        imgStr = imgStr + this.fileList[i].url + "@@"
      }
      imgStr = imgStr.slice(0,imgStr.length-2)
      this.ei_form.image_urls =  imgStr
      let postData = that.ei_form
      if(that.publicData.product_id){
        postData = { ...{id:that.publicData.product_id},...that.ei_form }
      }
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
          that.tabName = "sku";
        } else {
          this.$message.error(response.msg);
        }
      });
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
          console.log(row)
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
          this.db_dialog.show = false
          this.initEditData()
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    ////////////////    编辑页面初始化数据     ////////////////////
    initEditData() {
      let that = this;
        request({
          url: "/admin/product/getProductInfo/" + that.publicData.product_id,
          method: "get"
        }).then(response => {
          console.log(response);
          this.fileList = []
          let arr = (response.data.image_urls).split("@@")
          for(let i=0;i<arr.length;i++){
            let obj = {url:arr[i]}
            this.fileList.push(obj)
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
            province_agent_rate: response.data.province_agent_rate,
            city_agent_rate: response.data.city_agent_rate,
            district_agent_rate: response.data.district_agent_rate
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
