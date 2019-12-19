<template>
  <div class="box">
    
    <!-- 表格数据 -->
    <el-table v-loading="listLoading" :data="tableData" fit show-header empty-text="暂无数据" highlight-current-row element-loading-text="拼命加载中">
      <el-table-column label="名称" prop="setting_desc"/>
      <el-table-column label="佣金比例" prop="setting_value"/>
      <el-table-column label="首次添加时间" prop="create_date">
        <template slot-scope="scope">
          <span>{{$formatDate(scope.row.create_date)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="最后修改日期" prop="modify_date">
        <template slot-scope="scope">
          <span>{{$formatDate(scope.row.modify_date)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" style="color: #478FCA" @click="handleRow('edit',scope.row)">设置</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- 添加分组弹窗 -->
    <el-dialog :visible.sync="iv_dialog.show" :title="iv_dialog.title" >
      <el-form ref="addForm" :model="addForm" label-width="110px">
        <el-form-item label="参数值">
          <el-input v-model="addForm.setting_value" auto-complete="off" />
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
      addForm: {
        setting_code: "",
        setting_value: "",
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
      request({
        url: "/admin/index/listSetting",
        method: "get",
      }).then(response => {
        that.listLoading = false;
        if (response.code === 200) {
          that.tableData = response.data
          console.log(response)
        } else {
          this.$message.error(response.msg);
        }
      });
    },
    // 查询
    onSubmit() {
      const that = this;
      that.getTableDatas();
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      const that = this;
      that.getTableDatas();
    },
    handleRow(act,row) {
      this.iv_dialog.show = true;
      this.iv_dialog.title = "参数修改";
      this.addForm.setting_code = row.setting_code;
      this.addForm.setting_value = row.setting_value;
    },
    
    submitForm(formName) {
      let that = this;
      this.postForm(this.addForm, formName);
      this.iv_dialog.isEdit = false;
    },
    postForm(form, formName) {
      let that = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          request({
            url: "/admin/index/putSetting",
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
