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
          placeholder="请输入关键字"
          clearable
          @keyup.enter.native="onSubmit"
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
            <img :src="scope.row.headimgurl" alt="" style="width:60px;display:block">
            <span>{{ scope.row.nick_name }}/{{ scope. row.exhibit_id }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="上级用户" prop="nick_name">
        <template slot-scope="scope">
          <div v-if="scope.row.parent_exhibit_id">
            <!-- <img :src="scope.row.parent_headimgurl" alt="" style="width:60px;display:block"> -->
            <span>{{ scope.row.parent_nick_name }}/{{ scope.row.parent_exhibit_id }}</span>
          </div>
          <div v-else>平台</div>
        </template>
      </el-table-column>
      <el-table-column label="余额" prop="rmb_balance"/>
      <el-table-column label="用户地区" prop="comment">
        <template slot-scope="scope">
          <span>{{ scope.row.province }}{{ scope.row.city }}</span>
        </template>
      </el-table-column>
      <el-table-column label="注册日期" prop="create_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改日期" prop="modify_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleRow(scope.row)">充值</el-button>
          <el-button @click="treeView(scope.row)">查看会员树</el-button>
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

    <!-- 充值弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title" style="overflow:hidden">
      <el-form ref="addForm" :model="addForm" label-width="130px">
        <el-form-item :rules="[{ required: true, message: '请填写充值金额', trigger: 'blur' }]" label="请填写充值金额:" prop="rmb_amount">
          <el-col :span="18">
            <el-form-item>
              <el-input v-model="addForm.rmb_amount" auto-complete="off" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <span style="font-size:12px;color:red;padding-left:5px">扣款请填写负数</span>
          </el-col>
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请输入备注', trigger: 'blur' }]" label="备注:" prop="comment">
          <el-input v-model="addForm.comment" auto-complete="off" />
        </el-form-item>
        <el-form-item>
          <el-button @click="iv_dialog.show=false">取消</el-button>
          <el-button type="success" @click="submitForm('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 用户结构树 -->
    <el-dialog :visible.sync="tree_dialog.show" :title="iv_dialog.title" style="overflow:hidden">
      <div class="treeBox">
        <el-tree
          v-loading="tree_dialog.loading"
          :data="tree_dialog.datatree"
          :props="defaultProps"
          node-key="user_id"
          default-expand-all>
          <el-row slot-scope="{ node, data }" type="flex" class="row-bg" style="width:100%">
            <img :src="data.headimgurl" alt="" class="treeImg">
            <div>
              <p style="padding:0;margin:0;font-size:14px;padding-bottom:10px;color:#000;padding-left:10px;">昵称：{{ data.nick_name }}</p>
              <p style="padding:0;margin:0;font-size:12px;color:#666"><span style="padding-left:10px;">ID：{{ data.exhibit_id }}</span><span style="padding-left:10px;">地区：{{ data.country }}{{ data.province }}{{ data.city }}</span></p>
            </div>
          </el-row>
        </el-tree>
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
        exhibit_id: null,
        rmb_amount: "",
        comment: "",
      },
      classTop: [],
      iv_dialog: {
        show: false,
        title: "",
        isEdit: false
      },
      tree_dialog: {
        loading:false,
        show: false,
        title: "重看用户结构树",
        datatree:[]
      },
      defaultProps: {
        children: 'subList',
        label: 'nick_name'
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
        url: "/admin/user/getUserList?currPage="+this.pagination.currentPage+"&pageSize="+this.pagination.pageSize+"&exhibit_id="+this.query.exhibit_id,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          that.listLoading = false;
          that.tableData = result.userList
          that.pagination.tatal = result.totalNum
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
        }
      });
    },
    treeView(row){
      let that = this
      that.tree_dialog.loading = true
      that.tree_dialog.show = true
      request({
        url: "/admin/user/getUserTree?exhibit_id="+row.exhibit_id,
        method: "get"
      }).then(response => {
        if (response.code === 200) {
          that.tree_dialog.loading = false
          let data = response.data
          let treeData = [
            { nick_name: data.nick_name,headimgurl:data.headimgurl, exhibit_id:data.exhibit_id ,subList:data.subList }
          ]
          that.tree_dialog.datatree = treeData
        } else {
          this.$message.error(response.msg);
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
    // 打开充值弹窗
    handleRow(row,type) {
      this.addForm.exhibit_id = row.exhibit_id
      this.iv_dialog.show=true
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
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm('是否确定给该会员充值?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.postForm(this.addForm, formName);
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消充值'
          });          
        });
        }
      });
      
      
    },
    //添加商品分类
    
    postForm(form, formName) {
      // return
      let that = this;
      request({
        url: "/admin/finance/officialRecharge",
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
.treeBox{
  // width: 500px;
  height: 500px;
  overflow-y: auto;
}
.treeImg{
  width: auto;
  height: 50px;
  border-radius: 10px;
  display: block;
}
// .imgBox{
//   width: 50px;
//   height: 50px;
  
//   overflow: hidden;
//   text-align: center;
// }
.el-tree-node__content {
  height: 60px;
}
.el-tree-node__expand-icon{
  font-size: 20px;
}
</style>
