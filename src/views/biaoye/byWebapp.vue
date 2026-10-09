<template>
  <div class="app-container">
    <el-card class="filter-container" shadow="never">
      <el-form :inline="true" :model="queryParams" size="small">
        <el-form-item label="标液名称">
          <el-input v-model="queryParams.standardSolutionName" placeholder="输入标液名称" clearable @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item label="标液种类">
          <el-select v-model="queryParams.useType" placeholder="请选择标液种类" clearable style="width: 150px;">
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>



        <el-form-item label="状态">
          <el-select v-model="queryParams.status" placeholder="请选择状态" style="width: 120px;" clearable>
            <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="运维组">
          <el-select v-model="queryParams.applyUserGroup" placeholder="请选择运维组" clearable>
            <el-option v-for="item in groupOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置人">
          <el-select v-model="queryParams.preparationPeople" placeholder="配置人" style="width: 120px;" clearable>
            <el-option v-for="item in preparationPeopleOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>

        <el-form-item label="配置时间">
          <el-date-picker v-model="queryParams.preparationDate" type="date" placeholder="选择配置时间" value-format="yyyy-MM-dd" style="width: 160px;" />
        </el-form-item>

        <el-form-item label="需要时间">
          <el-date-picker v-model="queryParams.needTime" type="date" placeholder="选择需要时间" value-format="yyyy-MM-dd" style="width: 160px;" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">搜索</el-button>
          <el-button icon="el-icon-refresh" @click="resetQuery">重置</el-button>
          <el-button type="warning" size="small" icon="el-icon-download" :disabled="multipleSelection.length === 0" @click="handleExport">
            导出选中项 ({{ multipleSelection.length }})
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-table v-loading="loading" :data="tableData" ref="multipleTable" border @selection-change="handleSelectionChange" @row-click="handleRowClick" height="calc(100vh - 288px)">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="标液名称" prop="standardSolutionName" align="center" min-width="150" />
      <el-table-column label="容量(ml)" prop="totalVolume" align="center" width="100" />
      <el-table-column label="采样量" prop="standardSolutionSamplingQuantity" align="center" width="100" />
      <el-table-column label="申请人" prop="applyUserName" align="center" width="100" />
      <el-table-column label="申请时间" prop="applyTime" align="center" width="140" />
      <el-table-column label="需要时间" prop="needTime" align="center" width="110" />
      <el-table-column label="点位" prop="usePointText" align="center" width="120" />
      <el-table-column label="配置人" prop="preparationPeopleName" align="center" width="100" />
      <el-table-column label="配置时间" prop="preparationTime" align="center" width="140" />
      <el-table-column label="有效日期" prop="effectTime" align="center" width="110" />
      <el-table-column label="领用人" prop="collecteUserName" align="center" width="100" />
      <el-table-column label="状态" align="center" width="100">
        <template slot-scope="scope">
          <el-tag :type="statusTagType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" style="text-align: center;">
      <el-pagination :current-page="queryParams.pageIndex" :page-sizes="[10, 20, 50, 100, 200]" :page-size="queryParams.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
// 请将下方的接口替换为您项目中实际的标液 api 文件及方法名
import { listVStandardSolutionApplyInfoPage, groupTreeList, getPointList } from '@/api/table'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'

export default {
  name: 'ByWebapp',
  data() {
    return {
      loading: false,
      tableData: [],
      total: 0,
      multipleSelection: [],
      groupOptions: [],
      pointOptions: [], // 点位下拉数据
      preparationPeopleOptions: [{ label: '全部', value: '' }, { label: '沈斌', value: 2 }, { label: '杨磊', value: 150 }],
      typeOptions: [
        { label: '全部', value: '' },
        { label: '混合标液', value: '2' }, // 根据图片2的返回情况推测
        { label: '单项标液', value: '1' }
      ],
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
        standardSolutionName: '',
        preparationPeople: '',
        needTime: '',
        useType: '',
        preparationDate: '',
        usePointId: '',
        status: '',
        applyUserGroup: ''
      }
    }
  },
  created() {
    this.getList()
    this.getGroupList()
    this.getPointOptions() // 如果有点位接口获取方法
  },
  methods: {
    handleRowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row)
    },
    // 获取运维组/申请组下拉
    getGroupList() {
      groupTreeList({ "roleId": "admin", "groupId": "17" }).then(res => {
        // 如果树形结构可以直接用就赋值，如果是键值对请根据实际接口修改映射
        this.groupOptions = res.retData || []
      })
    },
    // 获取点位下拉（预留，若有单独接口可在此调用）
    getPointOptions() {
      // getPointList().then(res => { this.pointOptions = res.retData })
    },
    // 获取标液分页列表
    getList() {
      this.loading = true
      // 严格匹配您提供的入参格式
      const params = {
        standardSolutionName: this.queryParams.standardSolutionName,
        preparationPeople: this.queryParams.preparationPeople,
        pageIndex: this.queryParams.pageIndex,
        pageSize: this.queryParams.pageSize,
        needTime: this.queryParams.needTime,
        useType: this.queryParams.useType,
        preparationDate: this.queryParams.preparationDate,
        usePointId: this.queryParams.usePointId,
        status: this.queryParams.status,
        applyUserGroup: this.queryParams.applyUserGroup
      }

      listVStandardSolutionApplyInfoPage(params).then(res => {
        if(res.retData) {
          this.tableData = res.retData.records || []
          this.total = res.retData.total || 0
        }
        this.loading = false
      }).catch(() => { this.loading = false })
    },
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
      if (this.multipleSelection.length === 0) {
        this.$message.warning('请先勾选需要导出的标液记录');
        return;
      }
      this.$confirm(`系统将导出选中的 ${this.multipleSelection.length} 条标液记录, 是否继续?`, '导出确认', {
        confirmButtonText: '确定导出',
        cancelButtonText: '取消',
        type: 'warning',
        closeOnClickModal: false
      }).then(() => {
        this.executeExport();
      }).catch(() => {
        this.$message({ type: 'info', message: '已取消导出' });
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
        const exportHeader = [[
          '标液名称', '容量(ml)', '采样量', '申请人', '申请时间',
          '需要时间', '点位', '配置人', '配置时间', '有效日期', '领用人', '状态'
        ]];

        const exportData = this.multipleSelection.map(item => [
          item.standardSolutionName || '',
          item.totalVolume || 0,
          item.standardSolutionSamplingQuantity || '',
          item.applyUserName || '',
          this.formatDateSimple(item.applyTime),
          this.formatDateSimple(item.needTime),
          item.usePointText || '',
          item.preparationPeopleName || '',
          this.formatDateSimple(item.preparationTime),
          this.formatDateSimple(item.effectTime),
          item.collecteUserName || '',
          this.getStatusLabel(item.status)
        ]);

        const ws = XLSX.utils.aoa_to_sheet(exportHeader.concat(exportData));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "标液领用列表");

        ws['!cols'] = [
          { wch: 25 }, { wch: 10 }, { wch: 12 }, { wch: 10 }, { wch: 15 },
          { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 15 }, { wch: 10 }, { wch: 12 }
        ];

        const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        FileSaver.saveAs(
          new Blob([wbout], { type: 'application/octet-stream' }),
          `标液领用明细_${new Date().getTime()}.xlsx`
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
    formatDateSimple(val) {
      if (!val) return '';
      return val.length > 10 ? val.substring(0, 10) : val;
    },
    handleQuery() {
      this.queryParams.pageIndex = 1
      this.getList()
    },
    resetQuery() {
      this.queryParams = {
        pageIndex: 1,
        pageSize: 20,
        standardSolutionName: '',
        preparationPeople: '',
        needTime: '',
        useType: '',
        preparationDate: '',
        usePointId: '',
        status: '',
        applyUserGroup: ''
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
