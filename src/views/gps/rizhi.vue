<template>
  <div class="testPaper">
    <!-- 条件栏 -->
    <div class="headClass">

      车牌号：
      <el-select v-model="licensePlate" placeholder="请选择车牌号" clearable class="seachInput">
        <el-option v-for="item in plateSelList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      状态：
      <el-select v-model="type" placeholder="请选择状态" clearable class="seachInput" style="width:120px">
        <el-option label="离线" :value="1 "></el-option>
        <el-option label="停车" :value="2"> </el-option>
        <el-option label="怠行" :value="3"> </el-option>
        <el-option label="行驶" :value="4"> </el-option>
      </el-select>
      部门：
      <el-select v-model="departmentId" placeholder="请选择部门" clearable class="seachInput" style="width:120px">
        <el-option v-for="item in bumenList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>

      持续时间(分)：
      <el-input-number v-model="duration" style="width:160px;margin-right:10px"></el-input-number>

      时间范围：
      <el-date-picker v-model="time" type="datetimerange" :picker-options="pickerOptions" range-separator="至"
        start-placeholder="开始日期" end-placeholder="结束日期" align="right" style="margin-right:10px" />
      <el-button type="primary" @click="seach">搜索</el-button>
      <el-button type="primary" @click="daochu">导出</el-button>
    </div>

    <!-- 表格 -->
    <el-table v-loading="listLoading" :data="records" element-loading-text="加载中" border fit highlight-current-row stripe
      style="margin-top:1.04vw">
      <el-table-column align="center" label="#" width="95">
        <template slot-scope="scope">
          {{ (pageIndex-1)*10+scope.$index+1 }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="车牌号">
        <template slot-scope="scope">
          {{ computedNull(scope.row.licensePlate) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" width="120px">
        <template slot-scope="scope">
          {{ computedNull(scope.row.departmentName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组名" width="120px">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="组长" width="100px">
        <template slot-scope="scope">
          {{ computedNull(scope.row.groupLeader) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态"  width="100px">
        <template slot-scope="scope">
          {{ computedNull(scope.row.typeName) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="开始时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.startTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="结束时间">
        <template slot-scope="scope">
          {{ computedNull(scope.row.endTime) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="持续时间" width="120px">
        <template slot-scope="scope">
          {{ computedNull(scope.row.duration) }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="地址">
        <template slot-scope="scope">
          {{ computedNull(scope.row.address) }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="buttonPagination">
      <el-pagination :current-page="pageIndex" :page-sizes="[10,20,30,40,50]" :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
        @current-change="handleCurrentChange" />
    </div>



  </div>
</template>

<script>
  import {
    listGpsDriveLogPage,
    listLicensePlateSel,
    exportGpsDriveLog,
    gpsDepartmentSel
  } from '@/api/table'

  // import the styles
  import Treeselect from '@riophae/vue-treeselect'
  // import the styles
  import '@riophae/vue-treeselect/dist/vue-treeselect.css'
  import {
    mapGetters
  } from 'vuex'

  import moment from 'moment'
  // import moment from 'moment'
  export default {
    name: 'RizhiGps',
    components: {
      Treeselect
    },
    data() {
      return {
        pageIndex: 1,
        pageSize: 10,
        total: 0,
        records: [],
        type: "",
        duration: "",
        time: [new Date() - 1000 * 60 * 60 * 24 * 7, new Date()],
        plateSelList: [],
        bumenList: [],
        departmentId: "",
        licensePlate: "",
        listLoading: false,
        pickerOptions: {
          shortcuts: [{
            text: '最近一个礼拜',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '最近半年',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          }]
        },
        normalizer(node) {
          // if (!node.children.length) delete node.children
          return {
            id: node.value,
            label: node.label,
            children: node.children && node.children.length ? node.children : 0
          }
        },
      }
    },
    computed: {
      ...mapGetters([
        'userId'
      ])
    },
    mounted() {
      this.listLicensePlateSel()
      this.gpsDepartmentSel()
      this.seach()
    },
    methods: {

      gpsDepartmentSel() {
        gpsDepartmentSel({

        }).then(res => {
          this.bumenList = res.retData
          this.bumenList.shift()
          console.log("部门", this.bumenList)
        })
      },
      daochu() {
        var startTime = ''
        var endTime = ''
        if (this.time == null) {
          startTime = ''
          endTime = ''
        } else if (this.time.length == 0) {
          startTime = ''
          endTime = ''
        } else {
          startTime = moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
          endTime = moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
        }


        exportGpsDriveLog({
          licensePlate: this.licensePlate,
          type: this.type,
          startTime: startTime,
          endTime: endTime,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          console.log(res)
          window.open(res.retData)
        })
      },

      listLicensePlateSel() { //所有车牌号
        listLicensePlateSel({}).then(res => {
          console.log("车牌号", res)
          this.plateSelList = res.retData
          this.plateSelList.shift()
        })
      },
      listGpsDriveLogPage() {
        var startTime = ''
        var endTime = ''
        if (this.time == null) {
          startTime = ''
          endTime = ''
        } else if (this.time.length == 0) {
          startTime = ''
          endTime = ''
        } else {
          startTime = moment(this.time[0]).format('YYYY-MM-DD HH:mm:ss')
          endTime = moment(this.time[1]).format('YYYY-MM-DD HH:mm:ss')
        }

        listGpsDriveLogPage({
          licensePlate: this.licensePlate,
          departmentId: this.departmentId,
          type: this.type,
          duration: this.duration,
          startTime: startTime,
          endTime: endTime,
          pageIndex: this.pageIndex,
          pageSize: this.pageSize
        }).then(res => {
          this.records = res.retData.records
          this.total = res.retData.total
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.listGpsDriveLogPage()
      },
      handleCurrentChange(val) {
        this.pageIndex = val
        this.listGpsDriveLogPage()
      },
      seach() {
        this.pageIndex = 1
        this.listGpsDriveLogPage()
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

  .dialog-vertical {
    display: flex;
    padding: 20px;

    .el-dialog {
      margin: auto !important;
    }
  }

  #container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 40vh;
  }

</style>
