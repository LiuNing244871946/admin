<template>
  <div class="box">
    <el-tabs v-model="tabName" @tab-click="tabClick">
      <el-tab-pane label="商品基本信息" name="eiTab">
        <el-form ref="ei_form" :model="ei_form" label-width="110px">
          <el-row :gutter="20">
            <el-col :span="11">
              <el-form-item label="商品名称：">
                <el-input v-model="ei_form.product_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="商品副标题：">
                <el-input v-model="ei_form.product_title"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="设置初始销量：">
                <el-input v-model="ei_form.init_sell_num"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="排序：">
                <el-input v-model="ei_form.sort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="选择分类：">
                <el-select v-model="ei_form.category_id" placeholder="请选择">
                  <el-option v-for="i in classList" :key="i.id" :label="i.category_name" :value="i.id" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item label="商品类型：">
                <el-select @change="proTypeChange" v-model="ei_form.product_type" placeholder="请选择">
                  <el-option label="普通商品" value="1" ></el-option>
                  <el-option label="代理商品" value="2" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="22">
              <el-form-item label="商品图片：">
                <el-upload
                  class="avatar-uploader"
                  action="https://lv-uncle-api.ishaohuo.cn/index.php/api/upload/uploadImg"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <img v-if="ei_form.image_urls" :src="ei_form.image_urls" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </el-form-item>

            </el-col>
            <el-col :span="22">
              <el-form-item class="editItem" label="商品详情：">
                <Editor v-model="ei_form.introduction"/>
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
        <el-button style="margin-bottom:16px" type="primary" icon="el-icon-plus" @click="addSku">添加规格</el-button>
        <el-row v-for="i in skuList" :key="i.index" style="border-bottom:1px solid #ddd;padding-top:10px">
          <el-form  label-width="85px">
            <el-col :span="4">
              <el-form-item label="规格名称：">
                <el-input v-model="i.sku_name"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="价格：">
                <el-input v-model="i.product_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="原价：">
                <el-input v-model="i.orginal_price"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="库存：">
                <el-input v-model="i.stock_total"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item label="排序：">
                <el-input v-model="i.sort"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-button style="margin-left:10px">删除</el-button>
              <el-button type="primary" @click="addSkuPost(i)">保存</el-button>
            </el-col>
            
          </el-form>
        </el-row>
        
      </el-tab-pane>
      <el-tab-pane label="代理商品基本信息" name="entSet">
        <el-row v-if="ei_form.product_type == 2">
          <el-form  label-width="200px">
            <el-col :span="12">
              <el-form-item label="发起人购买规格选择：">
                <el-select v-model="ent_form.founder_sku_id" placeholder="请选择">
                  <el-option v-for="i in entSkuList" :key="i.id" :label="i.sku_name" :value="i.sku_id" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="合伙人购买规格选择：">
                <el-select v-model="ent_form.partner_sku_id" placeholder="请选择">
                  <el-option v-for="i in entSkuList" :key="i.id" :label="i.sku_name" :value="i.sku_id" ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="省代理佣金比设置：">
                <el-input v-model="ent_form.province_agent_rate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="市代佣金比例设置：">
                <el-input v-model="ent_form.city_agent_rate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="区代佣金比例设置：">
                <el-input v-model="ent_form.district_agent_rate"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="24">
              <el-form-item>
                <el-button>返回列表</el-button>
                <el-button type="primary" @click="addEntSet()">保存</el-button>
              </el-form-item>
              
            </el-col>
          </el-form>
        </el-row>
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import request from "@/utils/request";
import Editor from "@/components/Editor/Editor"
export default {
  components: {
    Editor
  },
  computed: {
    
  },
  data() {
    return {
      classList: [],
      tabName: "eiTab",
      publicData:{
        product_id: ""
      },
      ei_form: {
        product_name: "",
        product_title: "",
        image_urls: "",
        category_id: "",
        init_sell_num: "",
        introduction: "",
        product_type: '1',
        sort:""
      },
      ent_form:{
        founder_sku_id:"",//发起人
        partner_sku_id:"",//合伙人
        province_agent_rate:"",//S
        city_agent_rate:"",
        district_agent_rate:"",
        brand:""
      },
      entSkuList:[],
      skuList:[
        { sku_name:"", product_price:"",orginal_price:"", stock_total:"", sort:""}
      ]
    };
  },
  mounted() {
    this.entData()//代理信息设置
  },
  created() {
    this.getClassList();
    if(this.$route.query.pid){
      this.publicData.product_id = this.$route.query.pid
      this.initEditData()
    }
  },
  methods: {
    getClassList() {
      let that = this;
      request({
        url: "/admin/product/listCategory",
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
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
        }
      });
    },
    tabClick() {},

    //上传成功
    handleAvatarSuccess(res, file) {
      this.ei_form.image_urls = file.response.filename
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
    proTypeChange(el){
      this.entData()
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
    addProduct(){
      let that = this
      request({
        url: "/admin/product/putProduct",
        method: "post",
        data: that.ei_form
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          that.publicData.product_id = response.data.product_id
          that.tabName = 'sku'
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    ////////////////////////////SKU////////////////////////////////////////
    addSku(){
      this.skuList.push({ sku_name:"", product_price:"", stock_total:"", sort:""})
    },
    addSkuPost(skuData){
      let that = this
      if(that.publicData.product_id == null || that.publicData.product_id ==""){
        that.$message.error('请先添加商品基本信息！');
        return false
      }
      let skuPostData = {...skuData,...{ product_id: that.publicData.product_id }}
      request({
        url: "/admin/product/putProductSku",
        method: "post",
        data: skuPostData
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    entData(){
      let that = this
      if(this.ei_form.product_type == 2){
        console.log(this.ei_form.product_type)
        request({
          url: "/admin/product/getProductInfo/" + that.publicData.product_id,
          method: "get"
        }).then(response => {
          console.log(response)
          that.initEditData(response.data)
          that.entSkuList = response.data.skuList
        });
      }
    },
    /////////////////         代理设置       ///////////////////
    addEntSet(){
      let that = this
      let postForm = {...that.ei_form,...that.ent_form,...{id:that.publicData.product_id}}
      console.log(postForm)
      request({
        url: "/admin/product/putProduct",
        method: "post",
        data: postForm
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: "提交成功",
            type: "success"
          });
          
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    ////////////////    编辑页面初始化数据     ////////////////////
    initEditData(data){
      let that = this
      if(data){
        this.ei_form = {
          product_name: data.product_name,
          product_title: data.product_title,
          image_urls: data.image_urls,
          category_id: data.category_id,
          init_sell_num: data.init_sell_num,
          introduction: data.introduction,
          product_type: data.product_type,
          sort:data.sort
        }
        this.$set(this.ei_form, 'introduction',data.introduction)
      }else{
        request({
          // url: "/admin/product/getProductInfo/6",
          url: "/admin/product/getProductInfo/" + that.publicData.product_id,
          method: "get"
        }).then(response => {
          console.log(response)
          let data = response.data
          this.ei_form = {
            product_name: data.product_name,
            product_title: data.product_title,
            image_urls: data.image_urls,
            category_id: data.category_id,
            init_sell_num: data.init_sell_num,
            introduction: data.introduction,
            product_type: data.product_type,
            sort:data.sort
          }
          that.$set(this.ei_form,'introduction',data.introduction)
          that.skuList = data.skuList
        });
      }
      
      console.log(this.ei_form)
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
.editItem .el-form-item__content{
  line-height: 0px;
}
</style>
