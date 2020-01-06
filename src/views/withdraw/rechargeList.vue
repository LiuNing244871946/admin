<template>
  <div class="box">
    <el-form
      ref="query"
      :model="query"
      :rules="query"
      :inline="true"
      class="merchantSubAcount"
    >
      <el-form-item prop="stockCode">
        <el-input
          v-model="query.exhibit_id"
          type="text"
          placeholder="用户ID"
          clearable
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-form-item prop="stockName">
        <el-input
          v-model="query.keyword"
          type="text"
          placeholder="请输入充值备注或手机号"
          clearable
          @keyup.enter.native="onSubmit"
        />
      </el-form-item>
      <el-date-picker
        v-model="query.time"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      </el-form-item>
      <el-form-item class="submit">
        <el-button type="primary" @click="onSubmit">查询</el-button>
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
      <el-table-column label="会员信息" prop="nick_name">
        <template slot-scope="scope">
          <div>
            <img :src="scope.row.headimgurl" alt="" style="width:80px">
            <p>{{ scope.row.nick_name }}/{{ scope.row.exhibit_id }}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="提现金额" prop="amount"/>
      <el-table-column label="备注" prop="comment"/>
      <el-table-column label="充值操作管理员" prop="username" />
      <el-table-column label="充值日期" prop="create_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改日期" prop="modify_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="block" align="center" style="margin-top:20px;padding-bottom:40px;">
      <el-pagination
        :current-page="pagination.currentPage"
        :page-size="pagination.pageSize"
        :total="pagination.tatal"
        layout="total, prev, pager, next"
        @current-change="handleCurrentChange"/>
    </div>

    <!-- 添加修改弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" label-width="80px" >
        <el-form-item :rules="[{ required: true, message: '请选择处理结果', trigger: 'change' }]" label="处理结果:" prop="approve_status">
          <el-select v-model="addForm.approve_status" width="100%" placeholder="请选择">
            <el-option label="通过" value="1"/>
            <el-option label="拒绝" value="2"/>
          </el-select>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请编辑备注', trigger: 'blur' }]" label="备注:" prop="approve_msg">
          <el-input v-model="addForm.approve_msg" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-button @click="iv_dialog.show=false">取消</el-button>
          <el-button type="success" @click="submitForm('addForm')">确定</el-button>
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
      tabs:"00",
      paneList:[
        {"label":"待审批", name:"00"},
        {"label":"已通过", name:"01"},
        {"label":"已拒绝", name:"02"}
      ],
      query: {
        exhibit_id: "",
        keyword:"",
        value2:"",
        time:["",""],
        approve_status:'00',
      },
      tableData: [],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        tatal: null
      },
      addForm: {
        withdrawid: null,
        approve_status: "",
        approve_msg: "",
      },
      classTop: [],
      iv_dialog: {
        show: false,
        title: "",
        isEdit: false
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
      that.tableData = [];
      that.classTop = [];
      let begin_date = this.yymmddFormat(this.query.time[0])
      let end_date = this.yymmddFormat(this.query.time[1])
      request({
        url: "/admin/finance/getOfficialRechargeList?currPage="+this.pagination.currentPage+"&pageSize="+this.pagination.pageSize+"&exhibit_id="+this.query.exhibit_id+"&keyword="+this.query.keyword+"&begin_date="+begin_date+"&end_date="+end_date,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          that.listLoading = false;
          that.tableData = result.rechargeList
          that.pagination.tatal = result.totalNum
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    tabClick(el){
      let name = el.name
      this.query.approve_status = name
      this.getTableDatas()
    },
    initPager(){
      this.query.currPage = 1
      this.query.pageSize =2
    },
    // 打开修改弹窗
    handleRow(row,type) {
      if(type==1){
        //审核
        this.addForm.withdrawid = row.id
        this.iv_dialog.show=true
      }else if(type==2){
        this.$confirm('此操作将打款到该账户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          request({
            url: "/admin/finance/withdraw/",
            method: "get"
          }).then(response => {
            if (response.code === 200) {
              this.$message({
                message: '打款成功',
                type: 'success'
              });
              this.getTableDatas();
            } else {
              this.$message.error(response.msg);
            }
      });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      }
      // this.$router.push({
      //   path: "/admin/order/orderDetail",
      //   query: { orderId: row.id }
      // });
      // request({
      //   url: "/admin/finance/getOrderDetail/"+row.id,
      //   method: "get"
      // }).then(response => {
      //   console.log(response)
      //   if (response.code === 200) {
         
      //   } else {
          
      //   }
      // });
    },
    // 查询
    onSubmit() {
      const that = this;
      that.query.currPage = 1;
      that.getTableDatas();
    },
    handleSizeChange(val) {
      console.log(val)
      
    },
    handleCurrentChange(val) {
      const that = this;
      this.pagination.currentPage = val
      that.getTableDatas();
    },

   
    submitForm(formName) {
      let that = this;
      this.postForm(this.addForm, formName);
    },
    //添加商品分类
    addClass() {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "添加管理员分组";
      this.iv_dialog.isEdit = false;
    },
    postForm(form, formName) {
      // return
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/finance/withdrawApprove/"+form.withdrawid,
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
    },
    yymmddFormat(newDate) {
      if(newDate){
        let Month = newDate.getMonth() + 1;
        Month = Month >= 10 ? Month : '0' + Month;
        let d = newDate.getDate();
        d = d >= 10 ? d : '0' + d
        return [
          [newDate.getFullYear(), Month, d].join('-'), [newDate.getHours(), newDate.getMinutes(), newDate.getSeconds()].join(':')
        ].join(' ');
      }else{
        return ""
      }
    },
  }
};
</script>

<style lang="scss">
.el-select{
  width: 100%;
}

</style>
