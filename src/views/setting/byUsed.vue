<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="申请人">
          <el-input v-model="listQuery.applyUserName" placeholder="输入申请人姓名" clearable style="width: 150px;"
            size="small" />
        </el-form-item>

        <el-form-item label="申请部门">
          <el-input v-model="listQuery.applyGroupName" placeholder="输入部门名称" clearable style="width: 150px;"
            size="small" />
        </el-form-item>

        <el-form-item label="溶液名称">
          <el-input v-model="listQuery.standardSolutionName" placeholder="输入溶液名称" clearable style="width: 200px;"
            size="small" />
        </el-form-item>

        <el-form-item label="配置时间">
          <el-date-picker v-model="dateRange" type="daterange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="handleDateChange" style="width: 280px;"
            size="small" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="handleFilter">
            查询
          </el-button>
          <el-button size="small" icon="el-icon-refresh" @click="resetQuery">
            重置
          </el-button>
          <el-button size="small" type="success" icon="el-icon-download" @click="exportData">
            导出
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table v-loading="listLoading" :data="list" border fit highlight-current-row style="margin-top:1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px - 50px)">
      <el-table-column label="序号" type="index" width="60" align="center" />

      <el-table-column label="母液名称" prop="motherLiquorName" min-width="50" />
      <el-table-column label="标准溶液名称" prop="standardSolutionName" min-width="80" show-overflow-tooltip />
      <el-table-column label="标准品编号" prop="standardMaterialNumber" min-width="80" show-overflow-tooltip />
      <el-table-column label="浓度" prop="concentration" width="100" align="center" />
      <el-table-column label="不确定度" prop="uncertainty" width="80" align="center" />
      <el-table-column label="供应商" prop="vendor" width="80" show-overflow-tooltip />
      <el-table-column label="申请人" prop="applyUserName" width="90" align="center" />
      <el-table-column label="申请部门" prop="applyGroupName" width="120" align="center" show-overflow-tooltip />
      <el-table-column label="配置时间" prop="preparationTime" width="94" align="center" />
      <el-table-column label="有效期" prop="effectTime" width="94" align="center" />
      <el-table-column label="申请时间" prop="applyTime" width="94" align="center" />
      <el-table-column label="需求时间" prop="needTime" width="100" align="center" />
      <el-table-column label="配置编号" prop="number" width="100" show-overflow-tooltip />
      <el-table-column label="配置人" prop="preparationPeopleName" min-width="40" show-overflow-tooltip align="center" />
      <el-table-column label="点位名称" prop="pointName" min-width="200" show-overflow-tooltip />

    </el-table>

    <div class="pagination-container custom-pagination" style="text-align: center;">
      <el-pagination :background="true" :current-page.sync="listQuery.pageIndex" :page-size.sync="listQuery.pageSize"
        :page-sizes="[10, 20, 30, 50,100,200,500]" :layout="'total, sizes, prev, pager, next, jumper'" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>

  </div>
</template>

<script>
// 假设这是您的 API 接口
import { pageStandardSolutionUsedVO, exportStandardSolutionUsed } from '@/api/table';
// 确保您在 '@/api/table' 中导出了这两个接口

export default {
  name: 'ByUsed',
  data() {
    return {
      list: [],
      total: 0,
      listLoading: false,
      isExporting: false, // 🎯 新增：导出加载状态

      // 查询参数
      listQuery: {
        pageIndex: 1,
        pageSize: 50,
        applyUserId: '',
        applyUserName: '',
        applyGroupId: '',
        applyGroupName: '',
        standardSolutionName: '',
        preparationStartTime: this.getTodayMonthFirstDay(),
        preparationEndTime: this.getTodayMonthLastDay(),
      },

      dateRange: [this.getTodayMonthFirstDay(), this.getTodayMonthLastDay()],
      defaultListQuery: null,
    };
  },
  created() {
    this.defaultListQuery = Object.assign({}, this.listQuery);
    this.getList();
  },
  methods: {
    // 【查询相关方法不变】

    /**
     * 获取数据列表
     */
    async getList() {
      this.listLoading = true;
      try {
        const response = await pageStandardSolutionUsedVO(this.listQuery);

        if (response.retCode === 1000 && response.retData) {
          this.list = response.retData.records || [];
          this.total = response.retData.total || 0;
          this.$message.success(`数据加载成功，共 ${this.total} 条记录`);
        } else {
          this.list = [];
          this.total = 0;
          this.$message.error(response.retMsg || '查询失败');
        }
      } catch (error) {
        console.error('API请求失败:', error);
        this.$message.error('网络或系统错误，请重试');
      } finally {
        this.listLoading = false;
      }
    },

    /**
     * 处理查询按钮点击
     */
    handleFilter() {
      this.listQuery.pageIndex = 1;
      this.getList();
    },

    // ... (handleDateChange, resetQuery, handleSizeChange, handleCurrentChange 不变)

    handleDateChange(value) {
      if (value) {
        this.listQuery.preparationStartTime = value[0];
        this.listQuery.preparationEndTime = value[1];
      } else {
        this.listQuery.preparationStartTime = '';
        this.listQuery.preparationEndTime = '';
      }
    },

    resetQuery() {
      this.listQuery = Object.assign({}, this.defaultListQuery);
      this.dateRange = [this.listQuery.preparationStartTime, this.listQuery.preparationEndTime];
      this.handleFilter();
    },

    handleSizeChange(val) {
      this.getList();
    },

    handleCurrentChange(val) {
      this.getList();
    },


    // 【🎯 导出功能新增】

    /**
     * 导出按钮点击事件：调用导出API并下载文件
     */
    async exportData() {
        if (this.isExporting) return;
        this.isExporting = true;

        // 导出接口的参数与查询接口类似，但通常不需要 pageIndex 和 pageSize
        const exportQuery = {
            applyUserId: this.listQuery.applyUserId,
            applyUserName: this.listQuery.applyUserName,
            applyGroupId: this.listQuery.applyGroupId,
            applyGroupName: this.listQuery.applyGroupName,
            standardSolutionName: this.listQuery.standardSolutionName,
            // 确保导出时时间参数存在
            preparationStartTime: this.listQuery.preparationStartTime || '',
            preparationEndTime: this.listQuery.preparationEndTime || '',
        };

        // 可选：如果导出接口需要分页参数来限定导出范围，则保留它们
        // exportQuery.pageIndex = this.listQuery.pageIndex;
        // exportQuery.pageSize = this.listQuery.pageSize;

        this.$message.info('正在生成导出文件，请稍候...');

        try {
            const response = await exportStandardSolutionUsed(exportQuery);

            if (response.retCode === 1000 && response.retData) {
                const fileUrl = response.retData;
                this.$message.success('文件已生成，开始下载...');

                // 自动创建链接并下载文件
                const link = document.createElement('a');
                link.href = fileUrl;
                // 尝试设置文件名 (取决于服务器返回的类型)
                link.setAttribute('download', '标准溶液使用记录.xlsx');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

            } else {
                this.$message.error(response.retMsg || '导出文件生成失败！');
            }
        } catch (error) {
            console.error('导出API请求失败:', error);
            this.$message.error('导出失败，请检查网络或接口。');
        } finally {
            this.isExporting = false;
        }
    },


    // --- 辅助方法：获取默认时间不变 ---
    getTodayMonthFirstDay() {
      const date = new Date();
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-01`;
    },
    getTodayMonthLastDay() {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth();
      const lastDay = new Date(year, month + 1, 0).getDate();
      return `${year}-${String(month + 1).padStart(2, '0')}-${lastDay}`;
    },
  }
};
</script>

<style scoped>
/* 容器样式 */
.app-container {
  padding: 20px;
}

/* 查询表单容器 */
.filter-container {
  padding-bottom: 10px;
  margin-bottom: 20px;
  border-bottom: 1px solid #eee;
}

/* 表单项间距 */
.el-form-item {
  margin-right: 15px;
  /* 调整表单项之间的右侧间距 */
  margin-bottom: 10px;
  /* 调整表单项之间的底部间距，避免折行时间隙过大 */
}

/* 🎯 分页容器样式 */
.pagination-container {
  padding: 15px 0;
  /* 调整分页区域的内边距 */
  text-align: right;
}
</style>
