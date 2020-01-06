<template>
  <div class="box">

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
      <el-table-column label="代理类型" prop="agent_scope_desc" />
      <el-table-column label="代理等级" prop="agent_level_desc" />
      <el-table-column label="是否为发起人" prop="agent_type_desc" />
      <el-table-column label="代理人数量" prop="agent_num" />
      <el-table-column label="自购件数" prop="condition1" />
      <el-table-column label="推荐人数" prop="condition2" />
      <el-table-column label="佣金" prop="all_commission_rate" />
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
          <el-button type="text" style="color: #478FCA" @click="handleRow(scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加分组弹窗 -->
    <el-dialog v-if="iv_dialog.show" :visible.sync="iv_dialog.show" :title="iv_dialog.title" >
      <el-form ref="addForm" :model="addForm" label-width="120px">
        <el-form-item :rules="[{ required: true, message: '请编辑代理人数量', trigger: 'blur' }]" label="代理人数量：" prop="agent_num">
          <el-input v-model="addForm.agent_num" auto-complete="off" />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请编辑自购件数', trigger: 'blur' }]" label="自购件数：" prop="condition1">
          <el-input v-model="addForm.condition1" auto-complete="off" />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请编辑推荐人数：：', trigger: 'blur' }]" label="推荐人数：" prop="condition2">
          <el-input v-model="addForm.condition2" auto-complete="off" />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请编辑总额佣金比例', trigger: 'blur' }]" label="总额佣金比例：" prop="all_commission_rate">
          <el-input v-model="addForm.all_commission_rate" auto-complete="off" />
        </el-form-item>
        <el-form-item :rules="[{ required: true, message: '请编辑单人佣金比例', trigger: 'blur' }]" label="单人佣金比例：" prop="single_commission_rate">
          <el-input v-model="addForm.single_commission_rate" auto-complete="off" />
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
        agent_num: "",
        condition1:"",
        condition2:"",
        all_commission_rate:"",
        single_commission_rate:""
      },
      iv_dialog: {
        show: false,
        title: null,
        isEdit: false,
        userId: null
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
      const formInline = that.formInline;
      request({
        url: "/admin/index/listCommissionSetting",
        method: "get",
        data: formInline
      }).then(response => {
        if (response.code === 200) {
          const result = response.data;
          // that.pagination.pageSize = response.data.pageSize
          that.pagination.tatal = response.data.totalNum;
          that.tableData = result;
          that.listLoading = false;
        } else {
          that.pagination.pageSize = 0;
          that.pagination.tatal = 0;
          that.tableData = [];
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
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      const that = this;
      that.formInline.page = val;
      that.getTableDatas();
    },
    handleRow(row) {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "修改参数";
      this.iv_dialog.isEdit = true;
      this.id = row.id;
      this.addForm.single_commission_rate = row.single_commission_rate;
      this.addForm.all_commission_rate = row.all_commission_rate;
      this.addForm.condition1 = row.condition1;
      this.addForm.condition2 = row.condition2;
      this.addForm.agent_num = row.agent_num;
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
      console.log(form)
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/index/putCommissionSetting",
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
    }
  }
};
</script>

<style lang="scss">
</style>
