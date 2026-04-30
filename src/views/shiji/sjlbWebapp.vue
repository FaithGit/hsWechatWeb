<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="试剂名称">
          <el-input v-model="queryParams.reagentName" placeholder="输入名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px;">
            <el-option v-for="item in statusOptions" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="运维组">
          <el-select v-model="queryParams.groupId" placeholder="请选择运维组">
            <el-option v-for="item in groupOptions" :key="item.label" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置人">
          <el-select v-model="queryParams.preparationPeople" placeholder="配置人" style="width: 120px;">
            <el-option v-for="item in preparationPeopleOptions" :key="item.label" :label="item.label"
              :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置时间">
          <el-date-picker v-model="queryParams.preparationDate" type="date" placeholder="选择配置时间"
            value-format="yyyy-MM-dd" style="width: 160px;" />
        </el-form-item>

        <el-form-item label="需要时间">
          <el-date-picker v-model="queryParams.needTime" type="date" placeholder="选择需要时间" value-format="yyyy-MM-dd"
            style="width: 160px;" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button type="warning" size="small" icon="el-icon-download" :disabled="multipleSelection.length === 0"
            @click="handleExport">
            导出选中项 ({{ multipleSelection.length }})
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table v-loading="loading" :data="tableData" ref="multipleTable" border @selection-change="handleSelectionChange"
    @row-click="handleRowClick"
      height="calc(100vh - 288px)">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="试剂名称" prop="reagentName" align="center" />
      <el-table-column label="毫升(ml)" prop="volumesBottle" align="center" width="100" />
      <el-table-column label="瓶数" prop="reagentQuantity" align="center" width="60" />
      <el-table-column label="申请人" prop="applyUserName" align="center" width="90" />
      <el-table-column label="申请时间" prop="applyTime" align="center" width="100" />
      <el-table-column label="需要时间" prop="needTime" align="center" width="100" />
      <el-table-column label="配置人" prop="preparationPeopleName" align="center" width="90" />
      <el-table-column label="配置时间" prop="preparationTime" align="center" width="100" />
      <el-table-column label="有效日期" prop="effectTime" align="center" width="100" />
      <el-table-column label="领用人" prop="collecteUserName" align="center" width="90" />
      <el-table-column label="领用日期" prop="collecteUserName" align="center" width="100" />
      <el-table-column label="状态" align="center">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: center;">
      <el-pagination :current-page="queryParams.pageIndex" :page-sizes="[10, 20, 50, 100, 200]"
        :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import { reagentApplyListPage, groupTreeList } from '@/api/table'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'SjlbWebapp',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      groupOptions: [],
      preparationPeopleOptions: [{ label: '全部', value: '' }, { label: '沈斌', value: 2 }, { label: '杨磊', value: 150 }],
      statusOptions: [
        { label: '全部', value: '', type: '' },
        { label: '未配制', value: 0, type: 'info' },
        { label: '配制中', value: 1, type: 'warning' },
        { label: '配制完成', value: 2, type: 'success' },
        { label: '已领用', value: 3, type: '' },
        { label: '撤销无效', value: 9, type: 'danger' }
      ],
      queryParams: {
        pageIndex: 1,
        pageSize: 20,
        reagentName: '',
        status: '',
        preparationDate: '', // 对应参数
        needTime: '',        // 对应参数
        groupId: '',        // 对应参数
        preparationPeople: ""
      }
    }
  },
  filters: {
    formatDate(val) {
      return val ? val.substring(0, 10) : ''
    }
  },
  created() {
    this.getList()
    this.groupTreeList()
  },
  methods: {
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    groupTreeList() {
      groupTreeList({ "roleId": "admin", "groupId": "17" }).then(res => {
        this.groupOptions = res.retData
      })
    },
    getList() {
      this.loading = true
      // 组装请求参数，保持与小程序逻辑一致
      const params = {
        pageIndex: this.queryParams.pageIndex,
        pageSize: this.queryParams.pageSize,
        reagentName: this.queryParams.reagentName,
        status: this.queryParams.status,
        preparationDate: this.queryParams.preparationDate,
        needTime: this.queryParams.needTime,
        groupId: this.queryParams.groupId,
        preparationPeople: this.queryParams.preparationPeople,
      }

      reagentApplyListPage(params).then(res => {
        this.tableData = res.retData.records
        this.total = res.retData.total
        this.loading = false
      }).catch(() => { this.loading = false })
    },
    // 反向映射：根据接口返回的 status 显示文字
    getStatusLabel(status) {
      const statusMap = {
        0: '未配制',
        1: '配制中',
        2: '配制完成',
        3: '已领用',
        9: '撤销无效'
      }
      return statusMap[status] || '未知'
    },
    statusTagType(status) {
      const target = this.statusOptions.find(item => item.value === status)
      return target ? target.type : ''
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },

    handleExport() {
      // 1. 基础校验：是否勾选了数据
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先勾选需要导出的试剂记录');
        return;
      }

      // 2. 弹出确认框
      this.$confirm(`系统将导出选中的 ${this.multipleSelection.length} 条记录, 是否继续?`, '导出确认', {
        confirmButtonText: '确定导出',
        cancelButtonText: '取消',
        type: 'warning',
        // 加上这一行可以点击遮罩层不关闭，防止误操作
        closeOnClickModal: false
      }).then(() => {
        // 3. 用户点击“确定”后执行导出逻辑
        this.executeExport();
      }).catch(() => {
        // 用户点击“取消”
        this.$message({
          type: 'info',
          message: '已取消导出'
        });
      });
    },

    executeExport() {
      const loading = this.$loading({
        lock: true,
        text: '正在生成报表，请稍候...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      try {
        // 定义表头 (对齐你 table 里的字段)
        const exportHeader = [[
          '试剂名称', '毫升(ml)', '瓶数', '申请人', '申请时间',
          '需要时间', '配置人', '配置时间', '有效日期', '领用人', '状态'
        ]];

        // 映射数据
        const exportData = this.multipleSelection.map(item => [
          item.reagentName || '',
          item.volumesBottle || 0,
          item.reagentQuantity || 0,
          item.applyUserName || '',
          this.formatDateSimple(item.applyTime),
          this.formatDateSimple(item.needTime),
          item.preparationPeopleName || '',
          this.formatDateSimple(item.preparationTime),
          this.formatDateSimple(item.effectTime),
          item.collecteUserName || '',
          this.getStatusLabel(item.status) // 使用之前定义的文字转换函数
        ]);

        // 生成 Excel
        const ws = XLSX.utils.aoa_to_sheet(exportHeader.concat(exportData));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "试剂领用列表");

        // 设置列宽
        ws['!cols'] = [
          { wch: 20 }, { wch: 10 }, { wch: 8 }, { wch: 10 }, { wch: 15 },
          { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 12 }
        ];

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `试剂领用明细_${new Date().getTime()}.xlsx`
        );

        this.$notify({
          title: '导出成功',
          message: `成功导出 ${this.multipleSelection.length} 条数据`,
          type: 'success'
        });
      } catch (error) {
        console.error(error);
        this.$message.error('导出失败，请重试');
      } finally {
        loading.close();
      }
    },
    // 辅助函数：统一处理导出时的时间格式（只保留年月日）
    formatDateSimple(val) {
      if (!val) return '';
      return val.length > 10 ? val.substring(0, 10) : val;
    },

    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    resetQuery() {
      // 重置所有筛选字段
      this.queryParams = {
        pageIndex: 1,
        pageSize: 20,
        reagentName: '',
        status: '',
        preparationDate: '',
        needTime: '',
        groupId: "",
        preparationPeople: ""
      }
      this.handleQuery()
    },
    handleSizeChange(val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.queryParams.pageIndex = val
      this.getList()
    }
  }
}
</script>



<style scoped>
::v-deep .el-table__row {
  cursor: pointer !important;
}

.app-container {
  padding: 20px;
}

.filter-container {
  margin-bottom: 20px;
}

.pagination-container {
  margin-top: 20px;
  text-align: right;
}
</style>
