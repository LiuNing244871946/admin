<template>
  <div class="box">

    <el-form ref="ei_form" :model="ei_form" label-width="250px">
      <el-row :gutter="22">
        <!-- <el-col :span="8">
          <el-button :disabled="productPostState" type="primary" @click="setting('ei_form')">立即添加</el-button>
        </el-col> -->
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代发起人数量', trigger: 'blur' }]" label="请编辑省代发起人数量" prop="agent_num_1_1">
            <el-input :disabled="productPostState" v-model="ei_form.agent_num_1_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代发起人自购件数', trigger: 'blur' }]" label="请编辑省代发起人自购件数" prop="condition1_1_1">
            <el-input :disabled="productPostState" v-model="ei_form.condition1_1_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代发起人推荐购买件数', trigger: 'blur' }]" label="请编辑省代发起人推荐购买件数" prop="condition2_1_1">
            <el-input :disabled="productPostState" v-model="ei_form.condition2_1_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代发起人分总佣金分配比例', trigger: 'blur' }]" label="请编辑省代发起人分总佣金分配比例" prop="all_commission_rate_1_1">
            <el-input :disabled="productPostState" v-model="ei_form.all_commission_rate_1_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代发起人单人佣金分配比例', trigger: 'blur' }]" label="请编辑省代发起人单人佣金分配比例" prop="single_commission_rate_1_1">
            <el-input :disabled="productPostState" v-model="ei_form.single_commission_rate_1_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代合伙人数量', trigger: 'blur' }]" label="请编辑省代合伙人数量" prop="agent_num_1_2">
            <el-input :disabled="productPostState" v-model="ei_form.agent_num_1_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代合伙人自购件数', trigger: 'blur' }]" label="请编辑省代合伙人自购件数" prop="condition1_1_2">
            <el-input :disabled="productPostState" v-model="ei_form.condition1_1_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代合伙人推荐购买件数', trigger: 'blur' }]" label="请编辑省代合伙人推荐购买件数" prop="condition2_1_2">
            <el-input :disabled="productPostState" v-model="ei_form.condition2_1_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代合伙人分总佣金分配比例', trigger: 'blur' }]" label="请编辑省代合伙人分总佣金分配比例" prop="all_commission_rate_1_2">
            <el-input :disabled="productPostState" v-model="ei_form.all_commission_rate_1_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑省代合伙人单人佣金分配比例', trigger: 'blur' }]" label="请编辑省代合伙人单人佣金分配比例" prop="single_commission_rate_1_2">
            <el-input :disabled="productPostState" v-model="ei_form.single_commission_rate_1_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代发起人数量', trigger: 'blur' }]" label="请编辑市代发起人数量" prop="agent_num_2_1">
            <el-input :disabled="productPostState" v-model="ei_form.agent_num_2_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代发起人自购件数', trigger: 'blur' }]" label="请编辑市代发起人自购件数" prop="condition1_2_1">
            <el-input :disabled="productPostState" v-model="ei_form.condition1_2_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代发起人推荐购买件数', trigger: 'blur' }]" label="请编辑市代发起人推荐购买件数" prop="condition2_2_1">
            <el-input :disabled="productPostState" v-model="ei_form.condition2_2_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代发起人分总佣金分配比例', trigger: 'blur' }]" label="请编辑市代发起人分总佣金分配比例" prop="all_commission_rate_2_1">
            <el-input :disabled="productPostState" v-model="ei_form.all_commission_rate_2_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代发起人单人佣金分配比例', trigger: 'blur' }]" label="请编辑市代发起人单人佣金分配比例" prop="single_commission_rate_2_1">
            <el-input :disabled="productPostState" v-model="ei_form.single_commission_rate_2_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代合伙人数量', trigger: 'blur' }]" label="请编辑市代合伙人数量" prop="agent_num_2_2">
            <el-input :disabled="productPostState" v-model="ei_form.agent_num_2_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代合伙人自购件数', trigger: 'blur' }]" label="请编辑市代合伙人自购件数" prop="condition1_2_2">
            <el-input :disabled="productPostState" v-model="ei_form.condition1_2_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代合伙人推荐购买件数', trigger: 'blur' }]" label="请编辑市代合伙人推荐购买件数" prop="condition2_2_2">
            <el-input :disabled="productPostState" v-model="ei_form.condition2_2_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代合伙人分总佣金分配比例', trigger: 'blur' }]" label="请编辑市代合伙人分总佣金分配比例" prop="all_commission_rate_2_2">
            <el-input :disabled="productPostState" v-model="ei_form.all_commission_rate_2_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑市代合伙人单人佣金分配比例', trigger: 'blur' }]" label="请编辑市代合伙人单人佣金分配比例" prop="single_commission_rate_2_2">
            <el-input :disabled="productPostState" v-model="ei_form.single_commission_rate_2_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代发起人数量', trigger: 'blur' }]" label="请编辑区代发起人数量" prop="agent_num_3_1">
            <el-input :disabled="productPostState" v-model="ei_form.agent_num_3_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代发起人自购件数', trigger: 'blur' }]" label="请编辑区代发起人自购件数" prop="condition1_3_1">
            <el-input :disabled="productPostState" v-model="ei_form.condition1_3_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代发起人推荐购买件数', trigger: 'blur' }]" label="请编辑区代发起人推荐购买件数" prop="condition2_3_1">
            <el-input :disabled="productPostState" v-model="ei_form.condition2_3_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代发起人分总佣金分配比例', trigger: 'blur' }]" label="请编辑区代发起人分总佣金分配比例" prop="all_commission_rate_3_1">
            <el-input :disabled="productPostState" v-model="ei_form.all_commission_rate_3_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代发起人单人佣金分配比例', trigger: 'blur' }]" label="请编辑区代发起人单人佣金分配比例" prop="single_commission_rate_3_1">
            <el-input :disabled="productPostState" v-model="ei_form.single_commission_rate_3_1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代合伙人数量', trigger: 'blur' }]" label="请编辑区代合伙人数量" prop="agent_num_3_2">
            <el-input :disabled="productPostState" v-model="ei_form.agent_num_3_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代合伙人自购件数', trigger: 'blur' }]" label="请编辑区代合伙人自购件数" prop="condition1_3_2">
            <el-input :disabled="productPostState" v-model="ei_form.condition1_3_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代合伙人推荐购买件数', trigger: 'blur' }]" label="请编辑区代合伙人推荐购买件数" prop="condition2_3_2">
            <el-input :disabled="productPostState" v-model="ei_form.condition2_3_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代合伙人分总佣金分配比例', trigger: 'blur' }]" label="请编辑区代合伙人分总佣金分配比例" prop="all_commission_rate_3_2">
            <el-input v-model="ei_form.all_commission_rate_3_2" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :rules="[{ required: true, message: '请编辑区代合伙人单人佣金分配比例', trigger: 'blur' }]" label="请编辑区代合伙人单人佣金分配比例" prop="single_commission_rate_3_2">
            <el-input :disabled="productPostState" v-model="ei_form.single_commission_rate_3_2" />
          </el-form-item>
        </el-col>
        <el-col :span="22">
          <el-form-item>
            <el-button>返回商品列表</el-button>
            <el-button type="success" @click="settingRule('ei_form')">设置规则</el-button>
            <el-button :disabled="productPostState" type="primary" @click="setting('ei_form')">立即添加</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
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
      productPostState: true,
      publicData: {
        product_id: ""
      },
      ei_form: {
        agent_num_1_1: "",
        condition1_1_1: "",
        condition2_1_1: "",
        all_commission_rate_1_1: "",
        single_commission_rate_1_1: "",
        agent_num_1_2: "",
        condition1_1_2: "",
        condition2_1_2: "",
        all_commission_rate_1_2:"",
        single_commission_rate_1_2:"",
        agent_num_2_1:"",
        condition1_2_1:"",
        condition2_2_1:"",
        all_commission_rate_2_1:"",
        single_commission_rate_2_1:"",
        agent_num_2_2:"",
        condition1_2_2:"",
        condition2_2_2:"",
        all_commission_rate_2_2:"",
        single_commission_rate_2_2:"",
        agent_num_3_1:"",
        condition1_3_1:"",
        condition2_3_1:"",
        all_commission_rate_3_1:"",
        single_commission_rate_3_1:"",
        agent_num_3_2:"",
        condition1_3_2:"",
        condition2_3_2:"",
        all_commission_rate_3_2:"",
        single_commission_rate_3_2:""
      },
      isEdit:false,
    };
  },
  mounted() {

  },
  created() {
    this.publicData.product_id = ""
    if (this.$route.query.pid) {
      this.publicData.product_id = this.$route.query.pid;
      this.initEditData();
    }
  },
  methods: {
    settingRule(){
      this.productPostState = false
    },
    setting() {
      let that = this;
      this.$refs["ei_form"].validate(valid => {
        if (valid) {
          request({
            url: "/admin/product/setAgentProductCommissionSetting/"+this.publicData.product_id,
            method: "post",
            data: this.ei_form
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              this.productPostState = true
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
          url: "/admin/product/getAgentProductCommissionSetting/" + that.publicData.product_id,
          method: "get"
        }).then(response => {
          if(response.code==200){
            this.ei_form = response.data.productCommissionSetting
          }else{
            this.$message.error(response.msg);
          }
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
.el-col{
  padding-bottom: 10px;
}
</style>
