<template>
  <div class="app">
    <div class="reagent-date-config">
      <div class="header-controls">
        <h2>
          <el-select
            v-model="selectedYear"
            placeholder="选择年份"
            @change="initCalendar"
            size="small"
            class="year-select"
          >
            <el-option
              v-for="year in availableYears"
              :key="year"
              :label="year + ' 年'"
              :value="year">
            </el-option>
          </el-select>
          年度试剂配置日历 🗓️
        </h2>

        <div class="year-controls">
          <el-link type="primary" :underline="false" @click="changeYear(-1)" class="control-link">
            &lt; 上一年
          </el-link>
          <el-link type="primary" :underline="false" @click="changeYear(1)" class="control-link">
            下一年 &gt;
          </el-link>
        </div>
      </div>

      <div class="calendar-container">

        <el-calendar v-for="(date, index) in monthlyDates" :key="index" :value="date" class="monthly-calendar">
          <template #dateCell="{ date: cellDate, data }">
            <div class="date-cell" :class="getCellClasses(data.day)" @click="handleDateClick(data.day)">
              <p class="date-number">{{ data.day.split('-').slice(2).join('') }}</p>
              <span class="mode-label">{{ getDayMode(data.day) }}</span>
            </div>
          </template>
        </el-calendar>

      </div>

      <el-dialog title="切换确认" :visible.sync="dialogVisible" width="30%" center>
        <span class="dialog-message">
          确定将 **{{ selectedDate }}** 的模式从
          <span :style="{ color: selectedIsWorkday ? '#f56c6c' : '#67c23a' }">
            {{ selectedIsWorkday ? '工作日' : '休息日' }}
          </span>
          切换为
          <span :style="{ color: selectedIsWorkday ? '#67c23a' : '#f56c6c' }">
            {{ selectedIsWorkday ? '休息日' : '工作日' }}
          </span>
          吗？
        </span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSwitch" :loading="isRequesting">
            {{ isRequesting ? '切换中...' : '确 定' }}
          </el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>



<script>
import {
  queryDayList,
  updateDate
} from '@/api/table'

export default {
  name: 'Peizhiday',
  data() {
    return {
      selectedYear: new Date().getFullYear()+1,
      monthlyDates: [],
      allDatesMap: {},
      dialogVisible: false,
      selectedDate: '',
      selectedIsWorkday: false,
      isRequesting: false,
      // 🎯 新增：可选年份列表
      availableYears: [],
    };
  },
  created() {
    this.generateAvailableYears(); // 🎯 新增：初始化可选年份
    this.initCalendar(this.selectedYear);
  },
  methods: {
    /**
     * 🎯 新增：生成可选年份列表（例如，当前年份的前 5 年到后 5 年）
     */
    generateAvailableYears() {
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 5;
      const endYear = currentYear + 5;
      this.availableYears = [];
      for (let y = startYear; y <= endYear; y++) {
        this.availableYears.push(y);
      }
    },

    initCalendar(year) {
      // 确保使用最新的 selectedYear
      const targetYear = year || this.selectedYear;
      this.generateMonthlyDates(targetYear);
      this.fetchAnnualDates(targetYear);
    },

    changeYear(step) {
      this.selectedYear += step;
      // 确保切换后的年份在可选范围内，如果不在，可以自动添加到 availableYears 或给出提示。
      if (!this.availableYears.includes(this.selectedYear)) {
          this.availableYears.push(this.selectedYear);
          this.availableYears.sort((a, b) => a - b);
      }
      this.initCalendar(this.selectedYear);
    },

    generateMonthlyDates(year) {
      this.monthlyDates = [];
      for (let i = 0; i < 12; i++) {
        this.monthlyDates.push(new Date(year, i, 1));
      }
    },

    async fetchAnnualDates(year) {
      this.allDatesMap = {};
      this.$message.info(`正在加载 ${year} 年数据...`);

      const requestYear = `${year}-01-01`;

      try {
        const res = await queryDayList({ year: requestYear });

        if (res.retCode === 1000 && res.retData && res.retData.length > 0) {
          const newMap = res.retData.reduce((map, item) => {
            const dateStr = item.dateTime.split(' ')[0];
            const isWorkday = item.isWork === 1;

            map[dateStr] = {
              id: item.id,
              isWorkday: isWorkday,
              mode: isWorkday ? "工作日" : "休息日"
            };
            return map;
          }, {});

          this.allDatesMap = newMap;
          this.$message.success(`${year} 年数据加载完成。共加载 ${res.retData.length} 条数据。`);
        } else {
          this.$message.warning(`${year} 年数据为空或加载失败。`);
        }
      } catch (error) {
        console.error('获取全年数据失败:', error);
        this.$message.error('获取全年数据失败，请检查网络或接口。');
      }
    },

    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    getCellClasses(dateString) {
      const dayConfig = this.allDatesMap[dateString];
      if (!dayConfig) return '';
      return {
        'is-workday': dayConfig.isWorkday,
        'is-restday': !dayConfig.isWorkday,
      };
    },

    getDayMode(dateString) {
      return this.allDatesMap[dateString]?.mode || '';
    },

    handleDateClick(dateString) {
      const dayConfig = this.allDatesMap[dateString];
      if (!dayConfig) {
        this.$message.warning('该日期配置数据未加载，请稍候。');
        return;
      }
      this.selectedDate = dateString;
      this.selectedIsWorkday = dayConfig.isWorkday;
      this.dialogVisible = true;
    },

    async confirmSwitch() {
      this.isRequesting = true;
      const dateToUpdate = this.selectedDate;
      const currentConfig = this.allDatesMap[dateToUpdate];

      const newIsWorkday = !currentConfig.isWorkday;
      const newMode = newIsWorkday ? '工作日' : '休息日';
      const newIsWorkValue = newIsWorkday ? 1 : 0;

      try {
        await this.requestUpdateMode({
          id: currentConfig.id,
          isWork: newIsWorkValue
        });

        this.$set(this.allDatesMap, dateToUpdate, {
          ...currentConfig,
          isWorkday: newIsWorkday,
          mode: newMode
        });
        this.$message.success(`${dateToUpdate} 模式已切换为 ${newMode}`);
      } catch (error) {
        this.$message.error(`切换失败: ${error.message || '网络错误'}`);
      } finally {
        this.isRequesting = false;
        this.dialogVisible = false;
      }
    },

    async requestUpdateMode(params) {
      console.log(`[API CALL] POST /supDate/updateDate:`, params);

      const res = await updateDate(params);

      if (res.retCode !== 1000) {
        throw new Error(res.retMsg || '更新失败');
      }
      return res;
    }
  }
};
</script>


<style lang="scss" scoped>
/* 样式部分新增 year-select 宽度控制 */
.year-select {
    width: 120px; /* 🎯 设置选择器宽度 */
    margin-right: 5px;
}

/* 📌 外部控制区域样式 */
.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding: 0 10px;
}

.year-controls {
  display: flex;
  gap: 15px;
}

.control-link {
  font-size: 14px;
}

/* 📌 布局：强制 4 列 */
.calendar-container {
  display: grid;
  /* 强制 4 列，保证每行最多 4 个日历 */
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.monthly-calendar {
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

/* ---------------------------------------------------- */
/* 📌 Element UI 样式穿透和定制 (实现精简头部) */
/* ---------------------------------------------------- */

/* 1. 隐藏日历头部的按钮组（包含 上个月/今天/下个月） */
:deep(.el-calendar__button-group) {
  display: none !important;
}

/* 2. 调整日历头部布局和边距 */
:deep(.el-calendar__header) {
  padding: 6px 10px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeef5;
  /* 确保月份标题在按钮组隐藏后能够居中 */
  justify-content: center;
}

/* 3. 确保月份标题显示 (因为它默认和按钮组在一起，可能被隐藏) */
:deep(.el-calendar__title) {
  display: block !important;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  pointer-events: none;
}

/* 4. 单元格样式保持不变 */
:deep(.el-calendar-day) {
  height: auto !important;
  min-height: 60px;
  padding: 0 !important;
}

.date-cell {
  height: 100%;
  box-sizing: border-box;
  padding: 4px;
  text-align: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.date-number {
  font-size: 14px;
  margin: 0;
}

.mode-label {
  display: block;
  font-size: 10px;
  font-weight: bold;
  margin-top: 2px;
}

.is-workday {
  background-color: #f0f9eb;
  color: #67c23a;
}

.is-restday {
  background-color: #fef0f0;
  color: #f56c6c;
}
::v-deep .el-button-group{
  display: none;
}
::v-deep .date-number{
  padding-top: 10px;
}

::v-deep .el-calendar-table:not(.is-range) td.next, .el-calendar-table:not(.is-range) td.prev {
    opacity: .5;
    filter: grayscale(0.2);
}
::v-deep .prev {
    opacity: .5;
    filter: grayscale(0.2);
}
</style>
