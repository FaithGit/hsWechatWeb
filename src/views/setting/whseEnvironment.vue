<template>
  <div class="whseEnvContainer">
    <!-- 条件栏 -->
    <div class="headClass">
      开始日期：
      <el-date-picker
        v-model="queryForm.startTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择开始日期"
        class="seachInput"
      />
      结束日期：
      <el-date-picker
        v-model="queryForm.endTime"
        type="date"
        value-format="yyyy-MM-dd"
        placeholder="选择结束日期"
        class="seachInput"
      />
      <el-button type="primary" @click="search">搜索</el-button>
      <el-button @click="resetQuery">重置</el-button>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      style="margin-top: 1.04vw"
      height="calc(100vh - 84px - 60px - 40px - 32px - 1.04vw - 17px)"
    >
      <el-table-column align="center" label="序号" width="70" type="index" />
      <el-table-column align="center" label="时间" prop="time" width="150" />
      <el-table-column align="center" label="实验室温度 (°C)" prop="balanceTemperature" />
      <el-table-column align="center" label="实验室湿度 (%RH)" prop="balanceHumidity" />
      <el-table-column align="center" label="使用前100g砝码重量 (g)" prop="weight100gBefore" width="200" />
      <el-table-column align="center" label="仓库温度 (°C)" prop="whseTemp" />
      <el-table-column align="center" label="仓库湿度 (%RH)" prop="whseHum" />
    </el-table>

    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination
        :current-page="pageIndex"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script>
import { pagePreparationEnvironment } from "@/api/table";
import moment from "moment";

export default {
  name: "WhseEnvironment",
  data() {
    return {
      pageIndex: 1,
      pageSize: 30,
      total: 0,
      records: [],
      listLoading: false,
      queryForm: {
        startTime: "",
        endTime: "",
      }
    };
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    // 获取列表数据
    fetchData() {
      this.listLoading = true;
      const params = {
        startTime: this.queryForm.startTime ,
        endTime: this.queryForm.endTime,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize,
      };

      pagePreparationEnvironment(params)
        .then((res) => {
          if (res.retCode === 1000) {
            this.records = res.retData.records || [];
            this.total = res.retData.total || 0;
          } else {
            this.$message.error(res.retMsg || "获取数据失败");
          }
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          this.listLoading = false;
        });
    },
    // 搜索
    search() {
      this.pageIndex = 1;
      this.fetchData();
    },
    // 重置查询条件
    resetQuery() {
      this.queryForm.startTime = "";
      this.queryForm.endTime = "";
      this.pageIndex = 1;
      this.fetchData();
    },
    // 每页条数改变
    handleSizeChange(val) {
      this.pageSize = val;
      this.fetchData();
    },
    // 页码改变
    handleCurrentChange(val) {
      this.pageIndex = val;
      this.fetchData();
    },
  },
};
</script>

<style lang="scss" scoped>
.whseEnvContainer {
  margin: 30px;
}

.buttonPagination {
  text-align: center;
  margin-top: 15px;
}

.seachInput {
  width: 200px;
  margin: 0 10px;
}

.headClass {
  display: flex;
  align-items: center;
}
</style>
