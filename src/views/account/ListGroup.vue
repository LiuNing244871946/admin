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
        <el-button type="success" @click="addGroup">
          <i class="el-icon-plus" />添加管理员分组
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
      border
      highlight-current-row
      element-loading-text="拼命加载中"
    >
      <el-table-column label="分组名称" prop="group_name" />
      <el-table-column label="创建日期" prop="create_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.create_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改日期" prop="modify_date">
        <template slot-scope="scope">
          <span>{{ $formatDate(scope.row.modify_date) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">编辑</el-button>
          <el-button type="text" style="color: #478FCA" @click="resource(scope.row)">设置页面权限</el-button>
          <el-button type="text" style="color: #478FCA" @click="resourceInter(scope.row)">设置接口权限</el-button>
          <el-button type="text" style="color: #478FCA" @click="del(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 添加分组弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title">
      <el-form ref="addForm" :model="addForm" label-width="90px">
        <el-form-item label="分组名：">
          <el-input v-model="addForm.group_name" auto-complete="off" />
        </el-form-item>
        <el-form-item style="display:block;text-align:center;" label-width="0px">
          <el-button @click="iv_dialog.show = false">取消</el-button>
          <el-button type="primary" @click="submitForm('addForm')">确定</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 权限弹窗 -->
    <el-dialog v-if="page_dialog.show" :visible.sync="page_dialog.show" :title="page_dialog.title">
      <div class="pagetree">
        <el-tree
          ref="pagetree"
          :props="props"
          :data="pageList"
          :default-checked-keys="inter_dialog.interList"
          default-expand-all
          node-key="id"
          show-checkbox
          @check-change="handleCheckChange"/>
      </div>
      <div style="text-align:right;padding:10px;">
        <el-button @click="page_dialog.show=false">关闭</el-button>
        <el-button type="primary" @click="pageTreeSava">保存</el-button>
      </div>
    </el-dialog>
    <el-dialog v-if="inter_dialog.show" :visible.sync="inter_dialog.show" :title="inter_dialog.title">
      <div class="pagetree">
        <el-tree
          ref="intertree"
          :props="interProps"
          :data="interList"
          :default-checked-keys="inter_dialog.interList"
          default-expand-all
          node-key="id"
          show-checkbox />
      </div>
      <div style="text-align:right;padding:10px;">
        <el-button @click="inter_dialog.show=false">关闭</el-button>
        <el-button type="primary" @click="interTreeSava">保存</el-button>
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
      formInline: {
        currPage: 1,
        pageSize: 10
      },
      id: null,
      tableData: [],
      listLoading: true,
      pagination: {
        currentPage: 1,
        pageSizes: [10],
        pageSize: 0,
        tatal: 0
      },
      addForm: {
        group_name: ""
      },
      iv_dialog: {
        show: false,
        title: null,
        isEdit: false,
        userId: null
      },
      page_dialog:{
        show: false,
        title: '设置用户组页面权限',
        id: '',
        userId: null,
        pageList:[]
      },
      inter_dialog:{
        show: false,
        title: '设置用户组接口权限',
        id: '',
        groupId: null,
        interList:[]
      },
      pageList:[],
      interList:[],
      props: {
        label: 'menu_name',
        children: 'subMenuList',
      },
      interProps: {
        label: 'interface_name'
      }
    };
  },
  mounted() {
    this.getTableDatas();
    this.getMenuList()
    this.getInterList()
  },
  methods: {
    // 获取表格数据
    getTableDatas() {
      const that = this;
      that.listLoading = true;
      const formInline = that.formInline;
      request({
        url: "/admin/index/listGroup",
        method: "get",
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          // that.pagination.pageSize = response.data.pageSize
          that.tableData = result;
          that.listLoading = false;
        } else {
          that.tableData = [];
          this.$message.error(response.msg);
        }
      });
    },
    getMenuList(){
      request({
        url: "/admin/index/listmenu",
        method: "get",
      }).then(response => {
        if (response.code === 200) {
          this.pageList = response.data
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    getInterList(){
      request({
        url: "/admin/index/listInterfaces",
        method: "get",
      }).then(response => {
        if (response.code === 200) {
          this.interList = response.data.userList
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    // 查询
    onSubmit() {
      const that = this;
      that.formInline.page = 1;
      that.getTableDatas();
    },
    handleRow(row) {
      this.iv_dialog.show = true;
      this.resetForm()
      this.iv_dialog.title = "修改分组信息";
      this.iv_dialog.isEdit = true;
      this.id = row.id;
      this.addForm.group_name = row.group_name;
    },
    addGroup() {
      this.iv_dialog.show = true;
      this.resetForm()
      this.iv_dialog.title = "添加管理员分组";
      this.iv_dialog.isEdit = false;
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
    postForm(form, formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/index/putGroup",
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
    del(row) {
      this.$confirm('此操作将删除该用户组, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delPost(row)
      }).catch(() => {

      })
    },
    delPost(row) {
      request({
        url: '/admin/index/delGroup/' + row.id,
        method: 'post'
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getTableDatas()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    resetForm() {
      this.$nextTick(()=>{
        this.$refs['addForm'].resetFields();
      })                
    },
    //////////////////  权限  /////////////////////
    resource(row){
      this.page_dialog.show = true
      this.page_dialog.id = row.id
      if(row.page_resources){
        this.page_dialog.pageList = row.page_resources.split(",")
      }else{
        this.page_dialog.pageList = []
      }
      
    },
    handleCheckChange(e){
      console.log(e)
    },
    pageTreeSava(){
      let treeArr = this.$refs.pagetree.getCheckedNodes()
      let that = this
      this.$confirm('是否确定给改用户组开放所选页面', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.postTree(treeArr)
        }).catch(() => {
             
        });
    },
    postTree(arr){
      let str = ""
      for(let i=0;i<arr.length;i++){
        str+=arr[i].id+","
      }
      str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
      let form = { group_id:this.page_dialog.id, menu_ids:str }
      request({
        url: '/admin/index/setGroupPageResources',
        method: 'post',
        data:form
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.page_dialog.show = false
          this.getTableDatas()
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    ///////////////////接口权限/////////////////////
    resourceInter(row){
      this.inter_dialog.show = true
      this.inter_dialog.groupId = row.id
      // console.log(row)
      if(row.interface_resources){
        this.inter_dialog.interList = row.interface_resources.split(",")
      }else{
        this.inter_dialog.interList = []
      }
    },
    interTreeSava(){
      let treeArr = this.$refs.intertree.getCheckedNodes()
      let that = this
      this.$confirm('是否确定给改用户组开放所选接口权限', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          that.postInterTree(treeArr)
        }).catch(() => {
             
        });
    },
    postInterTree(arr){
      let str = ""
      for(let i=0;i<arr.length;i++){
        str+=arr[i].id+","
      }
      str=(str.substring(str.length-1)==',')?str.substring(0,str.length-1):str;
      let form = { group_id:this.inter_dialog.groupId, interface_ids:str }
      request({
        url: '/admin/index/setGroupInterfaceResources',
        method: 'post',
        data:form
      }).then(response => {
        if (response.code === 200) {
          this.$message({
            message: '设置成功',
            type: 'success'
          })
          this.inter_dialog.show = false
          this.getTableDatas()
        } else {
          this.$message.error(response.msg)
        }
      })
    }
  }
};
</script>

<style lang="scss">
.pagetree{
  width: auto;
  height: 400px;
  overflow-y: auto;
}
</style>
