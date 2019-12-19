<template>
  <div class="box">
    <el-row :gutter="20" v-if="orderInfo">
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix" >
            <span>订单详情</span>
            <el-button style="float: right; padding: 3px 0" type="text" ></el-button>
          </div>
          <div>
            <p>用户ID：{{orderInfo.exhibit_id}}</p>
            <p>供应商：{{orderInfo.brand_name}}</p>
            <p>用户昵称：{{orderInfo.nick_name}}</p>
            <p>用户电话：{{orderInfo.phone}}</p>
            <p>订单编号：{{orderInfo.order_number}}</p>
            <p>总价：{{orderInfo.total_price}}</p>
            <p>订单创建时间：{{$formatDate(orderInfo.create_date)}}</p>
            <p>支付时间：{{$formatDate(orderInfo.payment_time)}}</p>
            <p>订单状态：{{changeState(orderInfo.order_status)}}</p>
            <p>收货人姓名：{{orderInfo.contact_name}}</p>
            <p>收货人联系方式：{{orderInfo.contact_number}}</p>
            <p>地址：{{orderInfo.province_name+orderInfo.city_name+orderInfo.district_name+orderInfo.detail_address}}</p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix" >
            <span>订单商品详情</span>
            <el-button style="float: right; padding: 3px 0" type="text" ></el-button>
          </div>
          <div v-for="i in orderInfo.detail" :key="i.id">
            <p>商品ID：{{i.product_id}}</p>
            <p>商品名称：{{i.product_name}}</p>
            <p>商品规格ID：{{i.product_sku_id}}</p>
            <p>商品规格名称：{{i.sku_name}}</p>
            <p>商品价格：{{i.product_price}}</p>
            <div><p>商品图片：</p><img :src="(i.image_urls).split('@@')[0]" width="80" ></div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="box-card">
          <div slot="header" class="clearfix" >
            <span>发货状态</span>
            <el-button v-if="orderInfo.ship_platform==0" @click="deliverOrder" style="float: right; padding: 3px 0" type="text" >点击发货</el-button>
          </div>
          <div>
            <p v-if="orderInfo.ship_platform==0">未发货</p>
            <p v-else>已发货</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 发货弹窗 -->
    <el-dialog :visible.sync="iv_dialog.show" :title="iv_dialog.title" >
      <el-form ref="addForm" :model="addForm" label-width="110px">
        <el-form-item label="物流公司">
          <el-input v-model="addForm.logistics_company" auto-complete="off" />
        </el-form-item>
        <el-form-item label="物流单号">
          <el-input v-model="addForm.logistics_number" auto-complete="off" />
        </el-form-item>
        <el-form-item style="display:block;text-align:center;" label-width="0px">
          <el-button @click="iv_dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
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
      id: "",
      orderInfo: null,
      addForm: {
        orderid: "",
        logistics_company:"",
        logistics_number:"",
      },
      iv_dialog: {
        show: false,
        title: null,
        isEdit: false,
        userId: null
      }
    };
  },
  mounted() {},
  created() {
    this.id = this.$route.query.orderId;
    this.getDetail();
  },
  methods: {
    getDetail() {
      request({
        url: "/admin/finance/getOrderDetail/" + this.id,
        method: "get"
      }).then(response => {
        console.log(response);
        if (response.code === 200) {
          this.orderInfo = response.data.orderInfo
        } else {

        }
      });
    },
    // 查询
    onSubmit() {
      console.log(this.query);
      const that = this;
      that.query.currPage = 1;
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
    //发货
    deliverOrder() {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "订单发货";
    },
    //发货提交
    postForm(form, formName) {
      // return
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/finance/deliverOrder/"+this.orderInfo.order_number,
            method: "post",
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: "提交成功",
                type: "success"
              });
              that.iv_dialog.show = false;
              this.getDetail();
              that.resetForm(formName);
            } else {
              this.$message.error(response.msg);
            }
          });
        }
      });
    },
    changeState(val){
      if(val=="0"){
        return "代发货"
      }else if(val=='1'){
        return "已发货"
      }else if(val=='2'){
        return "申请退款"
      }else if(val=='3'){
        return "已退款"
      }else if(val=='4'){
        return "已完成"
      }else if(val=='5'){
        return "已取消"
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    yymmddFormat(newDate) {
      if (newDate) {
        let Month = newDate.getMonth() + 1;
        Month = Month >= 10 ? Month : "0" + Month;
        let d = newDate.getDate();
        d = d >= 10 ? d : "0" + d;
        return [
          [newDate.getFullYear(), Month, d].join("-"),
          [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(
            ":"
          )
        ].join(" ");
      } else {
        return "";
      }
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
p{
  font-size: 14px;
}
</style>
