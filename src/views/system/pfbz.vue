<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" size="small">
        <el-form-item label="标准名称">
          <el-input v-model="listQuery.standardName" placeholder="排放标准名称" clearable style="width: 200px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="listQuery.type" placeholder="请选择" clearable style="width: 120px;">
            <el-option label="废水" :value="1" />
            <el-option label="废气" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item label="标准编号">
          <el-input v-model="listQuery.number" placeholder="排放标准编号" clearable style="width: 180px;" @keyup.enter.native="handleFilter" />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button type="success" icon="el-icon-plus" @click="handleCreate">新增标准</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; margin-top: 10px;"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)"
    >
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <div style="padding: 10px 50px;">
            <h4 style="margin-top: 0;">因子限值详情</h4>
            <el-table :data="row.standardFactorList" size="mini" border stripe>
              <el-table-column label="因子代码" prop="factorCode" align="center" />
              <el-table-column label="下限" prop="lowerLimit" align="center" />
              <el-table-column label="上限" prop="upperLimit" align="center" />
              <el-table-column label="因子ID" prop="id" align="center" />
            </el-table>
            <div v-if="!row.standardFactorList || row.standardFactorList.length === 0" style="color: #909399; text-align: center; padding: 10px;">
              暂无因子数据
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="序号" type="index" width="60" align="center" />
      <el-table-column label="标准编号" prop="number" width="140" align="center" />
      <el-table-column label="排放标准名称" prop="standardName" min-width="350" show-overflow-tooltip />

      <el-table-column label="类型" prop="type" width="100" align="center">
        <template slot-scope="{row}">
          <el-tag :type="row.type === 1 ? '' : 'success'">
            {{ row.type === 1 ? '废水' : '废气' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="150" fixed="right">
        <template slot-scope="{row}">
          <el-link type="primary" :underline="false" size="small" style="margin-right: 10px;">详情</el-link>
          <el-link type="warning" :underline="false" size="small">编辑</el-link>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: center; padding: 20px 0;">
      <el-pagination
        background
        :current-page.sync="listQuery.pageIndex"
        :page-size.sync="listQuery.pageSize"
        :page-sizes="[10, 20, 30, 50]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <el-dialog title="新增排放标准" :visible.sync="dialogVisible" width="750px" @close="resetForm">
      <el-form ref="dataForm" :model="tempForm" :rules="rules" label-width="110px" size="small">
        <el-form-item label="标准名称" prop="standardName">
          <el-input v-model="tempForm.standardName" placeholder="请输入排放标准名称" />
        </el-form-item>
        <el-form-item label="标准编号" prop="number">
          <el-input v-model="tempForm.number" placeholder="请输入排放标准编号" />
        </el-form-item>
        <el-form-item label="标准类型" prop="type">
          <el-select v-model="tempForm.type" placeholder="请选择类型" style="width: 100%">
            <el-option label="废水" :value="1" />
            <el-option label="废气" :value="2" />
          </el-select>
        </el-form-item>

        <el-divider content-position="left">因子限值配置</el-divider>

        <div v-for="(item, index) in tempForm.standardFactorAddFormList" :key="index" class="factor-item">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item
                label="因子"
                label-width="50px"
                :prop="'standardFactorAddFormList.' + index + '.factorCode'"
                :rules="{ required: true, message: '请选择因子', trigger: 'change' }"
              >
                <el-select v-model="item.factorCode" filterable placeholder="选择因子">
                  <el-option
                    v-for="opt in factorOptions"
                    :key="opt.factorId"
                    :label="opt.factorName"
                    :value="opt.factorCode"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="下限"
                label-width="50px"
                :prop="'standardFactorAddFormList.' + index + '.lowerLimit'"
                :rules="{ required: true, message: '必填', trigger: 'blur' }"
              >
                <el-input-number v-model="item.lowerLimit" :controls="false" placeholder="下限" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item
                label="上限"
                label-width="50px"
                :prop="'standardFactorAddFormList.' + index + '.upperLimit'"
                :rules="{ required: true, message: '必填', trigger: 'blur' }"
              >
                <el-input-number v-model="item.upperLimit" :controls="false" placeholder="上限" style="width: 100%" />
              </el-form-item>
            </el-col>
            <el-col :span="2">
              <el-button type="danger" icon="el-icon-delete" circle @click="removeFactorRow(index)" />
            </el-col>
          </el-row>
        </div>

        <el-button type="primary" icon="el-icon-plus" plain @click="addFactorRow" style="margin-left: 50px;">
          添加因子
        </el-button>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" :loading="submitLoading" @click="submitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { pageStandard, listFactorPage, addDischargeStandard } from '@/api/table';

export default {
  name: 'Pfbz',
  data() {
    return {
      // 列表数据
      list: [],
      total: 0,
      listLoading: false,
      listQuery: {
        standardName: "",
        type: "",
        number: "",
        pageIndex: 1,
        pageSize: 10
      },
      // 新增对话框数据
      dialogVisible: false,
      submitLoading: false,
      factorOptions: [], // 因子下拉可选项
      tempForm: {
        standardName: "",
        type: "",
        number: "",
        standardFactorAddFormList: [] // 图一入参结构
      },
      rules: {
        standardName: [{ required: true, message: '请输入标准名称', trigger: 'blur' }],
        type: [{ required: true, message: '请选择类型', trigger: 'change' }],
        number: [{ required: true, message: '请输入标准编号', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getList();
    this.getFactorOptions();
  },
  methods: {
    // 获取标准列表
    async getList() {
      this.listLoading = true;
      try {
        const res = await pageStandard(this.listQuery);
        if (res.retCode === 1000) {
          this.list = res.retData.records;
          this.total = res.retData.total;
        } else {
          this.$message.error(res.retMsg || '获取数据失败');
        }
      } catch (error) {
        console.error('获取列表异常:', error);
      } finally {
        this.listLoading = false;
      }
    },
    // 获取因子下拉选项 (图二数据源)
    async getFactorOptions() {
      try {
        const res = await listFactorPage({ pageIndex: 1, pageSize: 999 });
        if (res.retCode === 1000) {
          this.factorOptions = res.retData.records;
        }
      } catch (error) {
        console.error('获取因子选项异常:', error);
      }
    },
    // 处理新增按钮
    handleCreate() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    // 增加一个因子配置行
    addFactorRow() {
      this.tempForm.standardFactorAddFormList.push({
        factorCode: "",
        lowerLimit: undefined,
        upperLimit: undefined
      });
    },
    // 删除一个因子配置行
    removeFactorRow(index) {
      this.tempForm.standardFactorAddFormList.splice(index, 1);
    },
    // 提交表单
    submitForm() {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true;
          try {
            const res = await addDischargeStandard(this.tempForm);
            if (res.retCode === 1000) {
              this.$message.success('新增排放标准成功');
              this.dialogVisible = false;
              this.getList(); // 刷新列表
            } else {
              this.$message.error(res.retMsg || '提交失败');
            }
          } catch (error) {
            console.error('提交异常:', error);
          } finally {
            this.submitLoading = false;
          }
        }
      });
    },
    // 重置表单
    resetForm() {
      this.tempForm = {
        standardName: "",
        type: "",
        number: "",
        standardFactorAddFormList: []
      };
      this.$refs['dataForm'].resetFields();
    },
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },
    resetQuery() {
      this.listQuery = {
        standardName: "",
        type: "",
        number: "",
        pageIndex: 1,
        pageSize: 10
      };
      this.handleFilter();
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 20px;
}
.filter-container {
  background: #f5f7fa;
  padding: 18px 18px 0 18px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.factor-item {
  margin-bottom: 15px;
  padding: 10px;
  border: 1px dashed #dcdfe6;
  border-radius: 4px;
}
.el-table__expanded-cell {
  padding: 20px !important;
  background-color: #fafafa;
}
</style>
