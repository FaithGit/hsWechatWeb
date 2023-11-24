<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">
      车牌号：
      <el-input v-model="licensePlate" class="seachInput" placeholder="请选择输入点位名称" clearable />
      日期：
      <el-date-picker v-model="time" type="month" placeholder="选择月" />
      <el-button type="primary" style="margin-left:10px" @click="seach">搜索</el-button>
    </div>

    <div class="boxcss">
      <div class="boxITem">
        车辆总数
        <div style="color:#2995fe">{{ carNum }}辆</div>
      </div>
      <div class="boxITem">
        日期
        <div style="color:#2995fe">{{ date||'-' }}</div>
      </div>
      <div class="boxITem">
        出车数量
        <div style="color:#2995fe">{{ travelNum }}辆</div>
      </div>
      <div class="boxITem">
        出车率
        <div style="color:#2995fe">{{ travelRate }}</div>
      </div>
    </div>

    <!-- 表格 -->
    <el-table
      v-loading="listLoading"
      :data="records"
      element-loading-text="加载中"
      border
      fit
      highlight-current-row
      stripe
      style="margin-top:1.04vw"
    >

      <el-table-column align="center" label="序号" width="95">
        <template slot-scope="scope">
          {{ scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车牌号">
        <template slot-scope="scope">
          {{ computedNull(scope.row.licensePlate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车辆分组">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组负责人" width="100">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupLeader) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="应勤天数">
        <template slot-scope="scope">
          {{ computedNull(scope.row.totalDay) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出车天数">
        <template slot-scope="scope">
          {{ computedNull(scope.row.travelDay) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="出车率">
        <template slot-scope="scope">
          {{ computedNull(scope.row.travelRate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="总里程数(km)">
        <template slot-scope="scope">
          {{ computedNull(scope.row.driveDistance) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作时长">
        <template slot-scope="scope">
          {{ computedNull(scope.row.workTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="工作时长(秒)">
        <template slot-scope="scope">
          {{ computedNull(scope.row.workSecond) }}
        </template>
      </el-table-column>

      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="openDeatils(scope.row)">出行明细</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      v-if="chuVisible"
      :title="licensePlatedig+'出行明细'"
      :append-to-body="true"
      :visible="chuVisible"
      width="60%"
      :close-on-click-modal="false"
      @close="chuVisible=false"
    >
      状态类型：
      <el-select v-model="type" placeholder="请选择" clearable>
        <el-option label="静止" :value="1" />
        <el-option label="停车" :value="2" />
        <el-option label="怠行" :value="3" />
        <el-option label="行驶" :value="4" />
      </el-select>

      时间范围：
      <el-date-picker
        v-model="time2"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
      />
      <el-button type="primary" style="margin-left:10px" @click="seach2">搜索</el-button>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        element-loading-text="加载中"
        border
        fit
        highlight-current-row
        stripe
        height="30.46vw"
        style="margin-top:1.04vw"
      >

        <el-table-column align="center" label="#" width="95">
          <template slot-scope="scope">
            {{ (pageIndex-1)*10+ scope.$index+1 }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="开始时间" width="100">
          <template slot-scope="scope">
            {{ computedNull(scope.row.startTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="结束时间" width="100">
          <template slot-scope="scope">
            {{ computedNull(scope.row.endTime) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="起点">
          <template slot-scope="scope">
            {{ computedNull(scope.row.startAddress) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="终点">
          <template slot-scope="scope">
            {{ computedNull(scope.row.endAddress) }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="时长" width="100">
          <template slot-scope="scope">
            {{ computedNull(scope.row.duration) }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="类型" width="100">
          <template slot-scope="scope">
            {{ computedNull(scope.row.typeName) }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="buttonPagination">
        <el-pagination
          :current-page="pageIndex"
          :page-sizes="[10,20,30,40,50]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-dialog>

  </div>
</template>

<script>
import {
  getTripStatistics,
  listTripDetailPage
} from '@/api/table'
import moment from 'moment'

export default {
  name: 'Yfgl',
  data() {
    return {
      licensePlate: '',
      licensePlatedig: '', // 弹窗内的车牌号
      time: new Date(),
      time2: [],
      tableData: [],
      listLoading: false,
      chuVisible: false,
      records: [],
      carNum: '',
      date: '',
      travelNum: '',
      travelRate: '',
      type: '',
      pageIndex: 1,
      pageSize: 10,
      total: 0

    }
  },
  mounted() {
    this.seach()
  },
  methods: {
    listTripDetailPage() {
      var startTime = ''
      var endTime = ''
      startTime = moment(this.time2[0]).startOf('day').format('YYYY-MM-DD')
      endTime = moment(this.time2[1]).startOf('day').format('YYYY-MM-DD')

      listTripDetailPage({
        'licensePlate': this.licensePlatedig,
        'type': this.type,
        'startDate': startTime,
        'endDate': endTime,
        'pageIndex': this.pageIndex,
        'pageSize': this.pageSize
      }).then(res => {
        console.log(res)
        this.total = res.retData.total
        this.tableData = res.retData.records
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.listTripDetailPage()
    },
    handleCurrentChange(val) {
      this.pageIndex = val
      this.listTripDetailPage()
    },
    openDeatils(row) {
      console.log(row)
      this.chuVisible = true
      this.licensePlatedig = row.licensePlate
      this.time2 = [moment(this.time).startOf('month'), moment(this.time).endOf('month').add(1, 'day')]
      this.type = 4
      this.seach2()
    },
    getTripStatistics() {
      console.log('this.time', this.time)
      var startTime = ''
      var endTime = ''
      startTime = moment(this.time).startOf('month').format('YYYY-MM-DD')
      endTime = moment(this.time).endOf('month').add(1, 'day').format('YYYY-MM-DD')
      getTripStatistics({
        startDate: startTime,
        endDate: endTime,
        licensePlate: this.licensePlate
      }).then(res => {
        console.log(res)
        this.records = res.retData.tripInfo
        this.carNum = res.retData.carNum
        this.date = res.retData.date
        this.travelNum = res.retData.travelNum
        this.travelRate = res.retData.travelRate
      })
    },

    seach() {
      this.getTripStatistics()
    },
    seach2() {
      this.pageIndex = 1
      console.log(this.time2)
      this.listTripDetailPage()
    },
    computedNull(val) {
      if (val === undefined || val === null || val === '' || val === ' ') {
        return '-'
      } else {
        return val
      }
    }
  }
}

</script>

<style lang="scss" scoped>
  .testPaper {
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

  .testDetails {
    font-size: 16px;
    line-height: 26px;
  }

  .card {
    display: flex;
    margin: 20px 0;
    align-items: center;
    justify-content: space-between;
  }

  .headClass {
    display: flex;
    align-items: center;

  }

  .boxcss {
    width: 100%;
    height: 80px;
    display: flex;
    border: 1px solid #eee;
    margin: 10px 0 20px 0;
    align-items: center;
  }

  .boxITem {
    width: 25%;
    font-size: 1.0vw;
    color: #9ba4af;
    text-align: center;

  }

</style>
